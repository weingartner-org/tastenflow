/// <reference path="../pb_data/types.d.ts" />
//
// DIE MAILS VON TASTENFLOW - DEUTSCH UND ENGLISCH (EN9, 19.09.2026)
// =================================================================
// Johannes 18.09.2026: „die komplette Übersetzung auf Englisch. die gesamte
// Oberfläche, Bedienung, Popups, Handbücher, Hilfen … muss gut und richtig
// übersetzt werden". Dazu gehören die Mails - sie erreichen die Menschen, die
// Tastenflow auf Englisch benutzen, genauso wie die Knöpfe.
//
// ── IN WELCHER SPRACHE? ─────────────────────────────────────────────────────
// In der Sprache der EMPFÄNGERIN, nicht der des Servers: `bedienSprache` an
// ihrem Konto (`tt_teachers` / `tt_pupils`, setup.mjs). Der Client schreibt
// das Feld, wenn jemand angemeldet die Bedienung umschaltet (nur mit
// Probe-Schalter, siehe `merkeBedienSprache` in `src/lib/typing/pbBackend.ts`).
// Englisch NUR bei genau "en", Französisch (E11c, 26.09.2026) NUR bei genau
// "fr", Spanisch (ES-M, 27.09.2026) NUR bei genau "es" - leer, "de" oder
// irgendetwas anderes ergibt die deutsche Mail, Zeichen für Zeichen wie vor EN9.
//
// ── WAS HIER STEHT ──────────────────────────────────────────────────────────
// Die REINEN Render-Funktionen (kein `$app`) der Mails, deren deutscher Text
// bis EN9 mitten in einem Cron-/Record-Rückruf stand - herausgelöst, damit das
// Englische DIREKT NEBEN dem Deutschen steht und beides ohne PocketBase prüfbar
// ist (`tests/tastenflow-englisch-mails.test.ts`):
//
//   selbstWocheMail   Wochenbericht der Selbstlernenden  (tt_selflearner_weekly)
//   loeschWarnungMail Löschwarnung nach einem Jahr        (tt_selflearner_lifecycle)
//   willkommenMail    Begrüssung einer neuen Lehrkraft    (tt_teacher_welcome)
//   nachrichtMail     ein Kind antwortet der Lehrkraft    (lw_message_mail)
//   schreibprobeMail  die Sammel-Mail der Tippchallenge   (tt_schreibprobe_mail)
//   kontoMailEn       Passwort / Bestätigung / Adresswechsel englisch
//                     (die deutschen Vorlagen stehen in setup.mjs; ersetzt
//                     werden sie in tt_mail_sprache.pb.js)
//
// Die übrigen Mails haben ihr Englisch neben ihrem Deutsch in der Lib, in der
// sie schon standen: der Klassen-Wochenbericht (`berichtHtmlEn`,
// tt_wochenziel_lib.pb.js), die Zugangsdaten eines Kindes
// (tt_pupils_passwort_mail_lib.pb.js), die Einladung als Co-Lehrkraft
// (tt_coteacher_lib.pb.js) und die Abbestell-Fusszeilen
// (mail_abbestellen_lib.pb.js).
//
// ⚠️ DEUTSCH: Jede deutsche Zeile ist aus ihrem Hook HIERHER KOPIERT, nicht
// umformuliert - auch dort, wo sie Schwächen hat („1 Minuten", „frueher",
// Gedankenstrich im Betreff der Begrüssung). Der Wächter vergleicht sie Byte
// für Byte mit dem Stand vor EN9 (`tests/fixtures/mails-deutsch.json`). Wer
// das Deutsche verbessern will, tut es bewusst und erneuert die Fixture.
//
// ★ ENGLISCH nach `GLOSSAR-ENGLISCH.md`: britisch, nur Bindestrich, kein
// Maus-Wort, Kinder ⇒ *pupils* (Lehrkraft), Tippchallenge ⇒ *Typing
// Challenge*, Treffsicherheit ⇒ *accuracy*, Leistungswert ⇒ *score*, Rang ⇒
// *place*, Fehler ⇒ *mistakes*, wacklige Tasten ⇒ *wobbly keys*, Zugangsdaten
// ⇒ *login details*, Klassencode ⇒ *class code*. Kalenderwochen nie als
// Nummer allein. Jede englische Mail steht in `<div lang="en">` - das
// Mailprogramm kann deutsch eingestellt sein, und eine Sprachausgabe läse
// sonst mit deutscher Stimme.
//
// ★★ FRANZÖSISCH (E11c, 26.09.2026) nach dem Glossar des Bauplans
// französischer Lehrgang §9.2: Lehrkräfte „vous", Kinder und Selbstlernende
// „tu" (F9), kein Point médian (F10, Doppelform „l'enseignant ou
// l'enseignante"), Tippchallenge ⇒ *Défi*, Fehler ⇒ *erreur de frappe*/
// *Erreurs* (nie *faute*), Wochenziel ⇒ *objectif de la semaine*, erlassen ⇒
// *dispensée*, gesperrte Stunde ⇒ *verrouillée*, Zugangsdaten ⇒
// *identifiants*, Zahnrad ⇒ *Réglages*. Zahlen mit Komma, „%" mit Leerzeichen
// davor, Zeit „10 h 05" (§9.1), Leerzeichen vor „: ; ! ?". Anführungszeichen
// gerade wie in der französischen Oberfläche (E11a-5). Kein Maus-Wort (nie
// *cliquez*). Jede französische Mail steht in `<div lang="fr">`.
// Wörter mit Geschlecht, das niemand kennt („entrainé/entrainée"), werden
// umgangen statt gegendert.
//
// ★★ SPANISCH (ES-M, 27.09.2026) nach dem Glossar der spanischen Oberfläche
// (Befund ES-O §2, Bauplan spanischer Lehrgang §1.2): Lehrkräfte „usted",
// Kinder und Selbstlernende „tú" (S9), kein vosotros, kein voseo.
// Geschlechtergerecht über Sammelwörter (S10: *alumnado, estudiante, persona
// docente*), nie -e/-x/@. Tippchallenge ⇒ *Reto* (S12), Treffsicherheit ⇒
// *precisión*, Leistungswert ⇒ *puntuación*, Anschläge ⇒ *pulsaciones por
// minuto* (ausgeschrieben), wacklige Tasten ⇒ *teclas inseguras*, Wochenziel ⇒
// *objetivo semanal*, erlassen ⇒ *eximida*, Übezeit ⇒ *tiempo de práctica*,
// Zugangsdaten ⇒ *datos de acceso*, Klassencode ⇒ *código de clase*, Zahnrad ⇒
// *Configuración*, E-Mail ⇒ *correo (electrónico)*. Dezimalpunkt (RAE/ASALE
// 2010, wie `eineStelle` in der App), „%" mit Leerzeichen, Zeit „10:05",
// Datum „12 de octubre de 2026". Anrede „Hola, Mia:" (Doppelpunkt, wie in
// spanischen Briefen). NEU GESCHRIEBEN, nicht aus dem Deutschen übersetzt -
// dieselben Sachinformationen. Jede spanische Mail steht in `<div lang="es">`.
//
// ★★ ITALIENISCH (O-IT, 02.10.2026) nach dem Glossar
// `recherche-italienisch-2026-10-02/GLOSSAR-it.md`: Kinder und Selbstlernende
// „tu", Lehrkräfte Infinitiv und neutrale Formen - nie „Lei" als Dauerton
// (Regel 1). „l'insegnante", „alunni" als Sammelwort, die einzelne „persona",
// keine Possessiva vor „insegnante" (Regel 2). Tippchallenge ⇒ *Sfida*
// (weiblich: „la Sfida"), Treffsicherheit ⇒ *precisione*, Leistungswert ⇒
// *punteggio*, Anschläge ⇒ *battute al minuto*, wacklige Tasten ⇒ *tasti
// incerti*, Wochenziel ⇒ *obiettivo settimanale*, erlassen ⇒ *esonerata*,
// Zugangsdaten ⇒ *dati di accesso*, Klassencode ⇒ *codice classe*, Zahnrad ⇒
// *Impostazioni*. Dezimalkomma, „95%" ohne Leerzeichen (Regel 5), Zeit
// „10:05", Datum „12 ottobre 2026". Lob ohne Adjektiv-Endung. NEU
// GESCHRIEBEN, nicht übersetzt. Jede italienische Mail steht in `<div lang="it">`.
//
// ★★ POLNISCH (O-PL, 02.10.2026) nach dem Glossar
// `recherche-polnisch-2026-10-02/GLOSSAR-pl.md`: ty für ALLE, auch für
// Lehrkräfte - nie „Pan/Pani" (Regel 1); eine Mail an eine Person beginnt mit
// „Dzień dobry," und schreibt Ty/Cię/Ci/Twój/Ciebie gross. Kein Geschlecht
// (Regel 2): keine Vergangenheit in der 2. Person, Sätze über die Sache, die
// -no/-to-Form („zapisano"), Futur vollendeter Verben („zalogujesz się").
// Namen nur im Nominativ - als Subjekt im Präsens oder nach Doppelpunkt
// (Regel 11), fremde Namen mit Nomen davor („na platformie Lernwerkstatt",
// „w programie Tastenflow"). Mehrzahl mit ALLEN vier Formen (`plForm`,
// §2.10a). Tippchallenge ⇒ *Wyzwanie* (gross wie ein Name, sächlich),
// Treffsicherheit ⇒ *dokładność*, Leistungswert ⇒ *wynik*, Anschläge ⇒
// *uderzeń na minutę*, wacklige Tasten ⇒ *niepewne klawisze*, Wochenbericht ⇒
// *podsumowanie tygodnia*, Zugangsdaten ⇒ *dane logowania*, Klassencode ⇒
// *kod klasy*, Zahnrad ⇒ *Ustawienia*. Datum mit dem Monat im Genitiv
// („21 września"), Dezimalkomma, „95%" ohne Leerzeichen (Regel 5), Zeit
// „10:05", Anführung „…” (Regel 8). Kein „kliknij", sondern „otwórz link" (Falle 7).
// NEU GESCHRIEBEN, nicht übersetzt. Jede polnische Mail steht in `<div lang="pl">`.
//
// ★★ TÜRKISCH (O-TR, 02.10.2026) nach dem Glossar
// `recherche-tuerkisch-2026-10-02/GLOSSAR-tr.md`: Kinder und Selbstlernende
// sen, Lehrkräfte und Eltern siz mit -(y)In („seçin") - nie die Amtsform
// -(y)InIz („seçiniz", Regel 1); Mails an Lehrkräfte ohne Ausrufezeichen.
// Anrede „Merhaba," oder „Merhaba Elif," - der Name ohne Endung (der Anruf
// ist endungslos). Kein grammatisches Geschlecht (Regel 2). ★★★ KEINE Endung
// an einem eingesetzten Wert - Name, Klasse, Zahl, Datum, Uhrzeit,
// „Tastenflow", „Lernwerkstatt" (Regel 6): sie stehen nach einem Doppelpunkt
// („Sınıf: 5A", „Son tarih: 21 Eylül 2026 Pazartesi") oder vor einem festen
// Wort („Lernwerkstatt sayfasına git", „14-20 Eylül haftası"). Nach einer
// Zahl Einzahl („12 öğrenci", „3 dakika", Regel 5). Tippchallenge ⇒ *Yarışma*,
// Treffsicherheit ⇒ *doğruluk*, Leistungswert ⇒ *puan*, Anschläge ⇒
// *dakikada vuruş*, wacklige Tasten ⇒ *henüz oturmamış tuşlar*, Wochenbericht
// ⇒ *haftalık rapor*, Zugangsdaten ⇒ *giriş bilgileri*, Klassencode ⇒
// *sınıf kodu*, Zahnrad ⇒ *Ayarlar*. Datum „21 Eylül 2026 Pazartesi"
// (Wochentag NACH dem Datum), Zeit „08:00", Dezimalkomma, „%95" (Zeichen VOR
// der Zahl, Regel 5), Anführung gerade (Regel 7). Kein „tıkla(yın)" (Regel 8).
// NEU GESCHRIEBEN, nicht übersetzt. Jede türkische Mail steht in `<div lang="tr">`.
//
// ★★ TSCHECHISCH (O-CS, 03.10.2026) nach dem Glossar
// `recherche-tschechisch-2026-10-02/GLOSSAR-cs.md`: Kinder und Selbstlernende
// ty („Ahoj,"), Lehrkräfte und Eltern vy in der Mehrzahlform („Dobrý den,",
// „Otevřete") - Mails an Lehrkräfte ohne Ausrufezeichen (Regel 1). ★★★ Kein
// Geschlecht (Regel 2): keine Vergangenheit in der 2. Person, „se"-Sätze und
// Hauptwort-Sätze („Přihlášení proběhlo."), „vyučující" nur im Nominativ, das
// Kind in der Lehrkraft-Sicht „osoba"/„žáci". ★★★ Namen NIE gebeugt (Regel 12):
// kein Name in der Anrede (kein Vokativ), Namen nach einem Doppelpunkt („Od:
// Honza") oder als Subjekt im Präsens; andere Werte mit Kopfwort („třída 5A",
// „v aplikaci Lernwerkstatt"). Mehrzahl mit ALLEN vier Formen (`csForm`,
// §2.11), „z"/„ze" vor einer Zahl über `zZeCs` (Regel 13); kein Satz endet mit
// Zahl und Punkt (Falle 4). Tippchallenge ⇒ *Výzva* (weiblich, gebeugt fest im
// Text: „ve Výzvě", „této Výzvy"), Treffsicherheit ⇒ *přesnost*,
// Leistungswert ⇒ *skóre*, Anschläge ⇒ *úhozy za minutu* („úhozů/min"),
// wacklige Tasten ⇒ *nejisté klávesy*, Wochenbericht ⇒ *týdenní přehled*,
// Zugangsdaten ⇒ *přihlašovací údaje*, Klassencode ⇒ *kód třídy*, Zahnrad ⇒
// *Nastavení*. Datum „2. října 2026" (Monat im GENITIV, von Hand -
// `MONATE_CS_GEN`), Zeit „10:05", Dezimalkomma, „95 %" mit GESCHÜTZTEM
// Leerzeichen U+00A0 (Regel 5), tschechische Anführung nur in Prosa (Regel 7). Kein
// „klikněte" (Regel 8). NEU GESCHRIEBEN, nicht übersetzt. Jede tschechische
// Mail steht in `<div lang="cs">`.
//
// ★ WELCHE SPRACHEN ES GIBT, steht an EINER Stelle: `MAIL_SPRACHEN` unten.
// `spracheVon` liest nur sie; die übrigen Mail-Hooks holen sich die Sprache
// über `spracheVon` (Leitfaden neue Sprache, Falle 50: nicht an jeder Stelle
// „|| s === …" nachtragen). Der Wächter `tests/tastenflow-spanisch-mails.test.ts`
// vergleicht die Liste mit der Bedienungssprache der App.
//
// ⚠️ Kein `Intl`, kein `toLocaleDateString`: goja hat keine Sprachdaten.
//
// Export nur im require()-Kontext ([[reference_pocketbase_hook_scope]]) -
// jeder Rückruf holt sich die Datei INNERHALB seines Körpers per require().

/**
 * ★ ES-M (27.09.2026): DIE Sprachen, in denen es die Tastenflow-Mails gibt -
 * dieselben Werte wie `BedienSprache` in der App (`src/lib/bedienSprache/
 * sprache.ts`, der Wächter vergleicht beide). „de" zuerst: Es ist die
 * Vorgabe für alles, was hier nicht steht.
 */
// ★ O4 (30.10.2026): die neun dazu - ihr Aufbau steht in tt_mail_neun_lib.pb.js, ihre Texte je Sprache in tt_mail_neun_<xx>_lib.pb.js.
var MAIL_SPRACHEN = ["de", "en", "fr", "es", "it", "pl", "tr", "cs", "bg", "el", "hu", "nl", "pt", "br", "ro", "sv", "uk"];

/** ★ O4: die Lib der neun, wenn `sprache` eine von ihnen ist - sonst `null` (dann wird nichts geladen). */
function neunLib(sprache) {
  return ["bg", "el", "hu", "nl", "pt", "br", "ro", "sv", "uk"].indexOf(String(sprache || "")) >= 0 ? require(`${__hooks}/tt_mail_neun_lib.pb.js`) : null;
}

/**
 * ★ G2b-2 (02.10.2026): Sprachen der App, die es als Bedienung gibt, für die es
 * aber (noch) KEINE Mail-Texte gibt. Ihre Mails gehen AUSDRÜCKLICH auf Englisch -
 * nie auf Deutsch (ein italienisches Kind bekäme sonst die Bestätigungs-Mail in
 * einer Sprache, die es nicht liest). Kommt ein Text dazu, wandert die Sprache
 * aus dieser Liste nach {@link MAIL_SPRACHEN}.
 * `tests/tastenflow-g2b2-mail-sprache.test.ts` hält beide Listen zusammen gleich
 * der Sprachliste der App (eine neue Sprache fällt dort auf, bis sie hier steht).
 */
// ★ O-IT (02.10.2026): „it" hat seither eigene Texte und steht in MAIL_SPRACHEN.
// ★ O-PL (02.10.2026): ebenso „pl".
// ★ O-TR (02.10.2026): ebenso „tr".
// ★ O-CS (03.10.2026): ebenso „cs" - die Liste ist seither leer; sie bleibt
// für die nächste Sprache stehen.
// ★ G2-NEUN (25.10.2026): die neun Sprachen des Gerüsts standen hier und bekamen Englisch.
// ★ O4 (30.10.2026): die neun haben eigene Texte - die Liste ist wieder leer und bleibt für die nächste Sprache.
var MAIL_SPRACHEN_OHNE_TEXT = [];

/**
 * Die Sprache der Empfängerin aus ihrem Konto: genau einer der Werte aus
 * {@link MAIL_SPRACHEN} ("en" seit EN9, "fr" seit E11c, "es" seit ES-M, "it",
 * "pl", "tr" und "cs" seit Etappe O) - eine Sprache aus {@link MAIL_SPRACHEN_OHNE_TEXT}
 * (seit O-CS keine) bekommt ENGLISCH (G2b-2: nie Deutsch für eine Sprache, die wir nicht
 * schreiben); alles andere (leer, „EN", „fr ") "de" (Bestand).
 */
function spracheVon(rec) {
  try {
    var s = rec ? String(rec.getString("bedienSprache") || "") : "";
    if (MAIL_SPRACHEN.indexOf(s) > 0) return s;
    if (MAIL_SPRACHEN_OHNE_TEXT.indexOf(s) >= 0) return "en";
    return "de";
  } catch (_) {
    return "de";
  }
}

/** Escaping für Text, der in HTML landet. */
function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Dasselbe, aber `null`/`undefined` werden zu "" (so stand es in der Tippchallenge-Mail). */
function escLeer(s) {
  return esc(s == null ? "" : s);
}

function pad2(n) {
  return n < 10 ? "0" + n : "" + n;
}

var MONATE_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
var MONATE_EN_KURZ = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

/** „12 October 2026" (Server-Uhr, wie der deutsche Hook mit `getDate()` rechnet). */
function datumEn(ms) {
  var d = new Date(ms);
  return d.getDate() + " " + MONATE_EN[d.getMonth()] + " " + d.getFullYear();
}

/** Die Monate französisch (E11c) - klein geschrieben, wie im Französischen üblich. */
var MONATE_FR = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "aout", "septembre", "octobre", "novembre", "décembre",
];
/** Die Kurzform, wie die französische Oberfläche sie schreibt („14 sept."). */
var MONATE_FR_KURZ = [
  "janv.", "févr.", "mars", "avr.", "mai", "juin",
  "juil.", "aout", "sept.", "oct.", "nov.", "déc.",
];

/** „12 octobre 2026" (Server-Uhr, wie `datumEn`). */
function datumFr(ms) {
  var d = new Date(ms);
  return d.getDate() + " " + MONATE_FR[d.getMonth()] + " " + d.getFullYear();
}

/** Die Monate spanisch (ES-M) - klein geschrieben, wie im Spanischen üblich. */
var MONATE_ES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

/** „12 de octubre de 2026" (Server-Uhr, wie `datumEn`). */
function datumEs(ms) {
  var d = new Date(ms);
  return d.getDate() + " de " + MONATE_ES[d.getMonth()] + " de " + d.getFullYear();
}

/** „71 minutos" / „1 minuto" - im Spanischen ist nur 1 Einzahl (0 minutos). */
function minutenEs(n) {
  return n + (n === 1 ? " minuto" : " minutos");
}

/** Die Monate italienisch (O-IT) - klein geschrieben, wie im Italienischen üblich. */
var MONATE_IT = [
  "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
  "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre",
];

/** „12 ottobre 2026" (Server-Uhr, wie `datumEn`). */
function datumIt(ms) {
  var d = new Date(ms);
  return d.getDate() + " " + MONATE_IT[d.getMonth()] + " " + d.getFullYear();
}

/** „71 minuti" / „1 minuto" - im Italienischen ist nur 1 Einzahl. */
function minutenIt(n) {
  return n + (n === 1 ? " minuto" : " minuti");
}

/** „del 14" / „dell'8" - die Präposition vor einem Tag (Elision vor 1, 8, 11). */
function delTagIt(tag) {
  return tag === 1 || tag === 8 || tag === 11 ? "dell'" + tag : "del " + tag;
}

/** Die Monate polnisch im GENITIV (O-PL) - so stehen sie in jedem Datum („21 września", Glossar §2.10). */
var MONATE_PL_GEN = [
  "stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca",
  "lipca", "sierpnia", "września", "października", "listopada", "grudnia",
];

/** „12 października 2026 r." (Server-Uhr, wie `datumEn`; „r." nach der Jahreszahl, Glossar §2.7). */
function datumPl(ms) {
  var d = new Date(ms);
  return d.getDate() + " " + MONATE_PL_GEN[d.getMonth()] + " " + d.getFullYear() + " r.";
}

/**
 * Die polnische Mehrzahl-Kategorie wie `Intl.PluralRules("pl-PL")` (Glossar
 * §2.10a, gemessen): 1 one · 2-4, 22-24 … few (nicht 12-14) · 0, 5-21, 25 …
 * many · Bruchzahl other. Von Hand - goja hat kein Intl.
 */
function plKategorie(n) {
  if (n !== Math.floor(n)) return "other";
  if (n === 1) return "one";
  var m10 = n % 10;
  var m100 = n % 100;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return "few";
  return "many";
}

/**
 * Eine Zahl mit der passenden der VIER Formen (O-PL) - `#` steht für die Zahl
 * (Dezimalkomma). Die ganze Wendung gehört in die Form („jest 1 osoba", „są 2
 * osoby"); fehlt keine, gibt es kein „5 minuty".
 */
function plForm(n, one, few, many, other) {
  var k = plKategorie(n);
  var form = k === "one" ? one : k === "few" ? few : k === "many" ? many : other;
  return form.replace("#", String(n).replace(".", ","));
}

/** „14-20 września" / „28 września - 4 października" - Montag bis Sonntag (Server-Uhr). */
function wocheSpannePl(montagMs) {
  var a = new Date(montagMs);
  var b = new Date(montagMs + 6 * 24 * 3600000 + 12 * 3600000);
  if (a.getMonth() === b.getMonth()) return a.getDate() + "-" + b.getDate() + " " + MONATE_PL_GEN[b.getMonth()];
  return a.getDate() + " " + MONATE_PL_GEN[a.getMonth()] + " - " + b.getDate() + " " + MONATE_PL_GEN[b.getMonth()];
}

/** Die Monate türkisch (O-TR) - gross, wie in jedem bestimmten Datum (Glossar Regel 9). */
var MONATE_TR = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];
/** Die Wochentage türkisch, Sonntag zuerst wie `Date#getDay()`. */
var WOCHENTAGE_TR_AB_SONNTAG = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

/** „12 Ekim 2026 Pazartesi" - Wochentag NACH dem Datum (Glossar §2.10; Server-Uhr, wie `datumEn`). */
function datumTr(ms) {
  var d = new Date(ms);
  return d.getDate() + " " + MONATE_TR[d.getMonth()] + " " + d.getFullYear() + " " + WOCHENTAGE_TR_AB_SONNTAG[d.getDay()];
}

/** „14-20 Eylül" / „28 Eylül - 4 Ekim" - Montag bis Sonntag (Server-Uhr), davor nie eine Endung. */
function wocheSpanneTr(montagMs) {
  var a = new Date(montagMs);
  var b = new Date(montagMs + 6 * 24 * 3600000 + 12 * 3600000);
  if (a.getMonth() === b.getMonth()) return a.getDate() + "-" + b.getDate() + " " + MONATE_TR[b.getMonth()];
  return a.getDate() + " " + MONATE_TR[a.getMonth()] + " - " + b.getDate() + " " + MONATE_TR[b.getMonth()];
}

/** Die Monate tschechisch im GENITIV (O-CS), klein - so stehen sie in jedem Datum („2. října", Glossar §4 Falle 7). */
var MONATE_CS_GEN = [
  "ledna", "února", "března", "dubna", "května", "června",
  "července", "srpna", "září", "října", "listopadu", "prosince",
];

/** „12. října 2026" (Server-Uhr, wie `datumEn`; Glossar §2.10). */
function datumCs(ms) {
  var d = new Date(ms);
  return d.getDate() + ". " + MONATE_CS_GEN[d.getMonth()] + " " + d.getFullYear();
}

/**
 * Die tschechische Mehrzahl-Kategorie wie `Intl.PluralRules("cs-CZ")` (Glossar
 * §2.11, gemessen): 1 one · 2-4 few · 0, 5+ (auch 21, 22) other · Bruchzahl
 * many. Von Hand - goja hat kein Intl.
 */
function csKategorie(n) {
  if (n !== Math.floor(n)) return "many";
  if (n === 1) return "one";
  if (n >= 2 && n <= 4) return "few";
  return "other";
}

/**
 * Eine Zahl mit der passenden der VIER Formen (O-CS) - `#` steht für die Zahl
 * (Dezimalkomma). Das Verb gehört in die Form („je 1 osoba", „jsou 2 osoby").
 */
function csForm(n, one, few, many, other) {
  var k = csKategorie(n);
  var form = k === "one" ? one : k === "few" ? few : k === "many" ? many : other;
  return form.replace("#", String(n).replace(".", ","));
}

/**
 * „z" oder „ze" vor einer ganzen Zahl (O-CS) - wie `zZe` in
 * `src/lib/bedienSprache/predlozkyCs.ts` (Glossar Regel 13): „ze" vor 2, 3, 4,
 * 6, 7, 12-14, 16, 17, 20-49, 60-79, 100-499, 600-799 usw., sonst „z".
 */
function zZeCs(n) {
  var k = Math.floor(Math.abs(n));
  if (k >= 1000000) return Math.floor(k / 1000000) === 1 ? "z" : zZeCs(Math.floor(k / 1000000));
  if (k >= 1000) return Math.floor(k / 1000) === 1 ? "z" : zZeCs(Math.floor(k / 1000));
  if (k >= 100) return Math.floor(k / 100) === 1 ? "ze" : zZeCs(Math.floor(k / 100));
  if (k >= 20) {
    var zehner = Math.floor(k / 10);
    return zehner === 2 || zehner === 3 || zehner === 4 || zehner === 6 || zehner === 7 ? "ze" : "z";
  }
  return [2, 3, 4, 6, 7, 12, 13, 14, 16, 17].indexOf(k) >= 0 ? "ze" : "z";
}

/** „14.-20. září" / „28. září - 4. října" - Montag bis Sonntag (Server-Uhr). */
function wocheSpanneCs(montagMs) {
  var a = new Date(montagMs);
  var b = new Date(montagMs + 6 * 24 * 3600000 + 12 * 3600000);
  if (a.getMonth() === b.getMonth()) return a.getDate() + ".-" + b.getDate() + ". " + MONATE_CS_GEN[b.getMonth()];
  return a.getDate() + ". " + MONATE_CS_GEN[a.getMonth()] + " - " + b.getDate() + ". " + MONATE_CS_GEN[b.getMonth()];
}

/** Der Stil der Fusszeilen - eine Stelle, damit Deutsch und Englisch gleich aussehen. */
var KLEIN = '<p style="color:#666;font-size:12px">';

// ── 1. Wochenbericht der Selbstlernenden (tt_selflearner_weekly) ────────────
//
// `d`: { name, wocheNr, wocheStartMs (Montag 00:00 Server-Uhr), minutenGesamt,
// tageAktiv, zeilen: [{ programm ("tippen"…), name (deutscher Programmname),
// minuten, tage, anzahl }], appUrl, fussHtml }.

/** Die Programme englisch - Eigennamen bleiben (Glossar §2), »Im Griff« mit grossem I. */
var PROGRAMM_NAMEN_EN = {
  tippen: "Tastenflow",
};

function selbstWocheMail(d, sprache) {
  var neun = neunLib(sprache);
  if (neun) return neun.selbstWoche(d, sprache); // ★ O4
  var zeilen = d.zeilen || [];
  var rows = "";
  var i, z;
  if (sprache === "en") {
    for (i = 0; i < zeilen.length; i++) {
      z = zeilen[i];
      rows +=
        "<tr>" +
        '<td style="padding:6px 8px;border-bottom:1px solid #eee">' + esc(PROGRAMM_NAMEN_EN[z.programm] || z.name) + "</td>" +
        '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + z.minuten + " min</td>" +
        '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + z.tage + "</td>" +
        '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + z.anzahl + "</td>" +
        "</tr>";
    }
    var montag = new Date(d.wocheStartMs);
    var linkEn = d.appUrl
      ? '<p><a href="' + esc(d.appUrl) + '/lernwerkstatt">Keep practising in Lernwerkstatt</a></p>'
      : "";
    // ★ Für ein Kind KEIN „w/c" (Schulsprache der Lehrkräfte) und keine
    // Wochennummer - „the week of 14 September" sagt dasselbe ohne Rätsel.
    return {
      subject:
        "Your practice week (week of " + montag.getDate() + " " + MONATE_EN_KURZ[montag.getMonth()] + ") - " +
        d.minutenGesamt + (d.minutenGesamt === 1 ? " minute" : " minutes"),
      html:
        '<div lang="en" style="font-family:system-ui,Segoe UI,Arial,sans-serif;font-size:15px;color:#222">' +
        "<p>Hello " + esc(d.name) + ",</p>" +
        "<p>Here's your week (the week of " + montag.getDate() + " " + MONATE_EN[montag.getMonth()] +
        "): <strong>" + d.minutenGesamt + (d.minutenGesamt === 1 ? " minute" : " minutes") +
        "</strong>" + (d.tageAktiv === 1 ? " on <strong>1 day" : " over <strong>" + d.tageAktiv + " days") +
        "</strong>.</p>" +
        '<table style="border-collapse:collapse;margin:12px 0">' +
        "<thead><tr>" +
        '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:left">App</th>' +
        '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Practised</th>' +
        '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Days</th>' +
        '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Exercises</th>' +
        "</tr></thead><tbody>" + rows + "</tbody></table>" +
        linkEn +
        KLEIN + "You're getting this email because you have a personal account without a " +
        "class - and only in weeks when you've practised. Only the apps you've used are listed.</p>" +
        (d.fussHtml || "") +
        "</div>",
    };
  }
  if (sprache === "fr") {
    // ★ E11c: tu (Kind oder Selbstlernende), dieselben Spalten wie oben.
    for (i = 0; i < zeilen.length; i++) {
      z = zeilen[i];
      rows +=
        "<tr>" +
        '<td style="padding:6px 8px;border-bottom:1px solid #eee">' + esc(PROGRAMM_NAMEN_EN[z.programm] || z.name) + "</td>" +
        '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + z.minuten + " min</td>" +
        '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + z.tage + "</td>" +
        '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + z.anzahl + "</td>" +
        "</tr>";
    }
    var montagFr = new Date(d.wocheStartMs);
    // Französisch sind 0 und 1 Einzahl.
    var minutenFr = d.minutenGesamt + (d.minutenGesamt < 2 ? " minute" : " minutes");
    var linkFr = d.appUrl
      ? '<p><a href="' + esc(d.appUrl) + '/lernwerkstatt">Continuer à t\'entrainer dans Lernwerkstatt</a></p>'
      : "";
    return {
      subject:
        "Ta semaine d'entrainement (semaine du " + montagFr.getDate() + " " +
        MONATE_FR_KURZ[montagFr.getMonth()] + ") - " + minutenFr,
      html:
        '<div lang="fr" style="font-family:system-ui,Segoe UI,Arial,sans-serif;font-size:15px;color:#222">' +
        "<p>Bonjour " + esc(d.name) + ",</p>" +
        "<p>Voici ta semaine (semaine du " + montagFr.getDate() + " " + MONATE_FR[montagFr.getMonth()] +
        ") : <strong>" + minutenFr + "</strong> sur <strong>" + d.tageAktiv +
        (d.tageAktiv < 2 ? " jour" : " jours") + "</strong>.</p>" +
        '<table style="border-collapse:collapse;margin:12px 0">' +
        "<thead><tr>" +
        '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:left">Application</th>' +
        '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Temps d\'exercice</th>' +
        '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Jours</th>' +
        '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Exercices</th>' +
        "</tr></thead><tbody>" + rows + "</tbody></table>" +
        linkFr +
        KLEIN + "Tu reçois cet e-mail parce que tu as un compte personnel sans classe - et " +
        "seulement les semaines avec de l'entrainement. Seules les applications que tu as " +
        "utilisées sont listées.</p>" +
        (d.fussHtml || "") +
        "</div>",
    };
  }
  if (sprache === "es") {
    // ★ ES-M: tú (Kind oder Selbstlernende), dieselben Spalten wie oben.
    // Keine Wochennummer - „la semana del 14 de septiembre" sagt dasselbe.
    for (i = 0; i < zeilen.length; i++) {
      z = zeilen[i];
      rows +=
        "<tr>" +
        '<td style="padding:6px 8px;border-bottom:1px solid #eee">' + esc(PROGRAMM_NAMEN_EN[z.programm] || z.name) + "</td>" +
        '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + z.minuten + " min</td>" +
        '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + z.tage + "</td>" +
        '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + z.anzahl + "</td>" +
        "</tr>";
    }
    var montagEs = new Date(d.wocheStartMs);
    var wocheEs = montagEs.getDate() + " de " + MONATE_ES[montagEs.getMonth()];
    var linkEs = d.appUrl
      ? '<p><a href="' + esc(d.appUrl) + '/lernwerkstatt">Seguir practicando en Lernwerkstatt</a></p>'
      : "";
    return {
      subject: "Tu semana de práctica (semana del " + wocheEs + ") - " + minutenEs(d.minutenGesamt),
      html:
        '<div lang="es" style="font-family:system-ui,Segoe UI,Arial,sans-serif;font-size:15px;color:#222">' +
        "<p>Hola, " + esc(d.name) + ":</p>" +
        "<p>Así fue tu semana (la semana del " + wocheEs + "): <strong>" + minutenEs(d.minutenGesamt) +
        "</strong> en <strong>" + d.tageAktiv + (d.tageAktiv === 1 ? " día" : " días") + "</strong>.</p>" +
        '<table style="border-collapse:collapse;margin:12px 0">' +
        "<thead><tr>" +
        '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:left">Programa</th>' +
        '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Tiempo de práctica</th>' +
        '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Días</th>' +
        '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Ejercicios</th>' +
        "</tr></thead><tbody>" + rows + "</tbody></table>" +
        linkEs +
        KLEIN + "Recibes este correo porque tienes una cuenta propia, sin clase - y solo en las " +
        "semanas en que has practicado. Aparecen solo los programas que has usado.</p>" +
        (d.fussHtml || "") +
        "</div>",
    };
  }
  if (sprache === "it") {
    // ★ O-IT: tu (Kind oder Selbstlernende), dieselben Spalten wie oben.
    // Keine Wochennummer - „la settimana del 14 settembre" sagt dasselbe.
    for (i = 0; i < zeilen.length; i++) {
      z = zeilen[i];
      rows +=
        "<tr>" +
        '<td style="padding:6px 8px;border-bottom:1px solid #eee">' + esc(PROGRAMM_NAMEN_EN[z.programm] || z.name) + "</td>" +
        '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + z.minuten + " min</td>" +
        '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + z.tage + "</td>" +
        '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + z.anzahl + "</td>" +
        "</tr>";
    }
    var montagIt = new Date(d.wocheStartMs);
    var wocheIt = delTagIt(montagIt.getDate()) + " " + MONATE_IT[montagIt.getMonth()];
    var linkIt = d.appUrl
      ? '<p><a href="' + esc(d.appUrl) + '/lernwerkstatt">Continua a esercitarti in Lernwerkstatt</a></p>'
      : "";
    return {
      subject: "La tua settimana di esercizio (settimana " + wocheIt + ") - " + minutenIt(d.minutenGesamt),
      html:
        '<div lang="it" style="font-family:system-ui,Segoe UI,Arial,sans-serif;font-size:15px;color:#222">' +
        "<p>Ciao " + esc(d.name) + ",</p>" +
        "<p>Ecco la tua settimana (la settimana " + wocheIt + "): <strong>" + minutenIt(d.minutenGesamt) +
        "</strong> in <strong>" + d.tageAktiv + (d.tageAktiv === 1 ? " giorno" : " giorni") + "</strong>.</p>" +
        '<table style="border-collapse:collapse;margin:12px 0">' +
        "<thead><tr>" +
        '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:left">Programma</th>' +
        '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Tempo di esercizio</th>' +
        '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Giorni</th>' +
        '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Esercizi</th>' +
        "</tr></thead><tbody>" + rows + "</tbody></table>" +
        linkIt +
        KLEIN + "Ricevi questa email perché hai un account personale, senza classe - e solo nelle " +
        "settimane in cui hai fatto esercizio. Compaiono solo i programmi che hai usato.</p>" +
        (d.fussHtml || "") +
        "</div>",
    };
  }
  if (sprache === "pl") {
    // ★ O-PL: ty mit Ty/Twój gross (Mail an eine Person), dieselben Spalten wie
    // oben. Keine Wochennummer - „tydzień 14-20 września" (Glossar §2.10). Der
    // Name fehlt in der Anrede mit Absicht: Polnisch verlangte den Vokativ, und
    // Namen stehen nur im Nominativ (Regel 11). Kein „ćwiczyłeś" (Regel 2).
    for (i = 0; i < zeilen.length; i++) {
      z = zeilen[i];
      rows +=
        "<tr>" +
        '<td style="padding:6px 8px;border-bottom:1px solid #eee">' + esc(PROGRAMM_NAMEN_EN[z.programm] || z.name) + "</td>" +
        '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + z.minuten + " min</td>" +
        '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + z.tage + "</td>" +
        '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + z.anzahl + "</td>" +
        "</tr>";
    }
    var spannePl = wocheSpannePl(d.wocheStartMs);
    var minutenPl = plForm(d.minutenGesamt, "# minuta", "# minuty", "# minut", "# minuty");
    var linkPl = d.appUrl
      ? '<p><a href="' + esc(d.appUrl) + '/lernwerkstatt">Ćwicz dalej na platformie Lernwerkstatt</a></p>'
      : "";
    return {
      subject: "Twój tydzień ćwiczeń (" + spannePl + ") - " + minutenPl,
      html:
        '<div lang="pl" style="font-family:system-ui,Segoe UI,Arial,sans-serif;font-size:15px;color:#222">' +
        "<p>Dzień dobry,</p>" +
        "<p>Oto Twój tydzień ćwiczeń (" + spannePl + ").<br>" +
        "Czas ćwiczeń: <strong>" + minutenPl + "</strong><br>" +
        "Dni z ćwiczeniami: <strong>" + d.tageAktiv + "</strong></p>" +
        '<table style="border-collapse:collapse;margin:12px 0">' +
        "<thead><tr>" +
        '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:left">Program</th>' +
        '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Czas ćwiczeń</th>' +
        '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Dni</th>' +
        '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Ćwiczenia</th>' +
        "</tr></thead><tbody>" + rows + "</tbody></table>" +
        linkPl +
        KLEIN + "Dostajesz tę wiadomość, bo masz konto prywatne bez klasy - i tylko w tygodniach " +
        "z ćwiczeniami. Na liście są tylko programy, z których korzystasz.</p>" +
        (d.fussHtml || "") +
        "</div>",
    };
  }
  if (sprache === "tr") {
    // ★ O-TR: sen (Kind oder Selbstlernende), dieselben Spalten wie oben.
    // Keine Wochennummer - „14-20 Eylül haftası" (Glossar §2.10). Der Name
    // ohne Endung im Anruf; Zahlen vor einem festen Wort („3 gün", „71 dakika").
    for (i = 0; i < zeilen.length; i++) {
      z = zeilen[i];
      rows +=
        "<tr>" +
        '<td style="padding:6px 8px;border-bottom:1px solid #eee">' + esc(PROGRAMM_NAMEN_EN[z.programm] || z.name) + "</td>" +
        '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + z.minuten + " dk.</td>" +
        '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + z.tage + "</td>" +
        '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + z.anzahl + "</td>" +
        "</tr>";
    }
    var spanneTr = wocheSpanneTr(d.wocheStartMs);
    var linkTr = d.appUrl
      ? '<p><a href="' + esc(d.appUrl) + '/lernwerkstatt">Lernwerkstatt sayfasında çalışmaya devam et</a></p>'
      : "";
    return {
      subject: "Çalışma haftan (" + spanneTr + " haftası) - " + d.minutenGesamt + " dakika",
      html:
        '<div lang="tr" style="font-family:system-ui,Segoe UI,Arial,sans-serif;font-size:15px;color:#222">' +
        "<p>" + (d.name ? "Merhaba " + esc(d.name) + "," : "Merhaba,") + "</p>" +
        "<p>Bu haftaki çalışman (" + spanneTr + " haftası): <strong>" + d.tageAktiv +
        " gün</strong> içinde toplam <strong>" + d.minutenGesamt + " dakika</strong>.</p>" +
        '<table style="border-collapse:collapse;margin:12px 0">' +
        "<thead><tr>" +
        '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:left">Program</th>' +
        '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Çalışma süresi</th>' +
        '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Gün</th>' +
        '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Alıştırma</th>' +
        "</tr></thead><tbody>" + rows + "</tbody></table>" +
        linkTr +
        KLEIN + "Bu e-postayı, sınıfa bağlı olmayan kişisel bir hesabın olduğu için alıyorsun - " +
        "ve yalnızca çalıştığın haftalarda. Listede yalnızca kullandığın programlar var.</p>" +
        (d.fussHtml || "") +
        "</div>",
    };
  }
  if (sprache === "cs") {
    // ★ O-CS: ty (Kind oder Selbstlernende), dieselben Spalten wie oben.
    // Keine Wochennummer - „14.-20. září" (Glossar §2.10). Anrede „Ahoj,"
    // OHNE Namen (kein Vokativ, Regel 12); Zahlen nach Doppelpunkt, Minuten als
    // „min" (keine Mehrzahl nötig); „kdy cvičíš" statt „cvičil jsi" (Regel 2).
    for (i = 0; i < zeilen.length; i++) {
      z = zeilen[i];
      rows +=
        "<tr>" +
        '<td style="padding:6px 8px;border-bottom:1px solid #eee">' + esc(PROGRAMM_NAMEN_EN[z.programm] || z.name) + "</td>" +
        '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + z.minuten + " min</td>" +
        '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + z.tage + "</td>" +
        '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + z.anzahl + "</td>" +
        "</tr>";
    }
    var spanneCs = wocheSpanneCs(d.wocheStartMs);
    var linkCs = d.appUrl
      ? '<p><a href="' + esc(d.appUrl) + '/lernwerkstatt">Cvičit dál v aplikaci Lernwerkstatt</a></p>'
      : "";
    return {
      subject: "Tvůj týden cvičení (" + spanneCs + ") - " + d.minutenGesamt + " min",
      html:
        '<div lang="cs" style="font-family:system-ui,Segoe UI,Arial,sans-serif;font-size:15px;color:#222">' +
        "<p>Ahoj,</p>" +
        "<p>Tvůj týden cvičení (" + spanneCs + ")<br>" +
        "Čas cvičení: <strong>" + d.minutenGesamt + " min</strong><br>" +
        "Dny s cvičením: <strong>" + d.tageAktiv + "</strong></p>" +
        '<table style="border-collapse:collapse;margin:12px 0">' +
        "<thead><tr>" +
        '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:left">Program</th>' +
        '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Čas cvičení</th>' +
        '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Dny</th>' +
        '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Počet cvičení</th>' +
        "</tr></thead><tbody>" + rows + "</tbody></table>" +
        linkCs +
        KLEIN + "Tento e-mail dostáváš, protože máš vlastní účet bez třídy - a jen v týdnech, " +
        "kdy cvičíš. V seznamu jsou jen programy, které používáš.</p>" +
        (d.fussHtml || "") +
        "</div>",
    };
  }
  // --- Deutsch: wörtlich aus tt_selflearner_weekly.pb.js (Stand vor EN9) ---
  for (i = 0; i < zeilen.length; i++) {
    z = zeilen[i];
    rows +=
      "<tr>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee">' + esc(z.name) + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + z.minuten + " min</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + z.tage + "</td>" +
      '<td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">' + z.anzahl + "</td>" +
      "</tr>";
  }
  var tageAktiv = d.tageAktiv;
  var link = d.appUrl
    ? '<p><a href="' + esc(d.appUrl) + '/lernwerkstatt">Weiterüben in der Lernwerkstatt</a></p>'
    : "";
  return {
    subject: "Deine Übungswoche (KW " + d.wocheNr + ") - " + d.minutenGesamt + " Minuten",
    html:
      '<div style="font-family:system-ui,Segoe UI,Arial,sans-serif;font-size:15px;color:#222">' +
      "<p>Hallo " + esc(d.name) + ",</p>" +
      "<p>das war deine Woche (KW " + d.wocheNr + "): <strong>" + d.minutenGesamt +
      " Minuten</strong> an <strong>" + tageAktiv + (tageAktiv === 1 ? " Tag" : " Tagen") +
      "</strong>.</p>" +
      '<table style="border-collapse:collapse;margin:12px 0">' +
      "<thead><tr>" +
      '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:left">Programm</th>' +
      '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Geübt</th>' +
      '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Tage</th>' +
      '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Aufgaben</th>' +
      "</tr></thead><tbody>" + rows + "</tbody></table>" +
      link +
      '<p style="color:#666;font-size:12px">Du bekommst diese Mail, weil du ein ' +
      "eigenes Konto ohne Klasse hast - und nur in Wochen, in denen du geübt hast. " +
      "Aufgelistet sind nur die Programme, die du benutzt hast.</p>" +
      (d.fussHtml || "") +
      "</div>",
  };
}

// ── 2. Die Löschwarnung (tt_selflearner_lifecycle) ─────────────────────────
//
// `d`: { name, loeschAmMs, appUrl, fuss (der Satz, warum man diese Mail nicht
// abbestellen kann - `LIFECYCLE_FUSS` bzw. `LIFECYCLE_FUSS_EN` aus
// mail_abbestellen_lib; hereingereicht, damit diese Datei ohne require bleibt) }.

function loeschWarnungMail(d, sprache) {
  var neun = neunLib(sprache);
  if (neun) return neun.loeschWarnung(d, sprache); // ★ O4
  if (sprache === "en") {
    var linkEn = d.appUrl
      ? '<p><a href="' + esc(d.appUrl) + '/lernwerkstatt">Sign in now and keep practising</a></p>'
      : "";
    return {
      subject: "Your Sensorik account will be deleted in three weeks",
      html:
        '<div lang="en" style="font-family:system-ui,Segoe UI,Arial,sans-serif;font-size:15px;color:#222">' +
        "<p>Hello " + esc(d.name) + ",</p>" +
        "<p>You haven't practised in any of the learning apps for a year - not in " +
        "Tastenflow.</p>" +
        "<p><strong>If you don't sign in by " + esc(datumEn(d.loeschAmMs)) + ", we will " +
        "delete your account with all your progress and data.</strong> " +
        "Signing in once is enough - then everything stays as it is.</p>" +
        linkEn +
        KLEIN + "You're getting this email because you have a personal account without a " +
        "class. If you no longer need the account, you don't need to do anything.</p>" +
        KLEIN + d.fuss + "</p>" +
        "</div>",
    };
  }
  if (sprache === "fr") {
    // ★ E11c: tu. `d.fuss` ist dann `LIFECYCLE_FUSS_FR` (mail_abbestellen_lib).
    var linkFr = d.appUrl
      ? '<p><a href="' + esc(d.appUrl) + '/lernwerkstatt">Me connecter et continuer</a></p>'
      : "";
    return {
      subject: "Ton compte Sensorik sera supprimé dans trois semaines",
      html:
        '<div lang="fr" style="font-family:system-ui,Segoe UI,Arial,sans-serif;font-size:15px;color:#222">' +
        "<p>Bonjour " + esc(d.name) + ",</p>" +
        "<p>Depuis un an, tu n'as utilisé aucune des applications d'apprentissage - ni " +
        "Tastenflow.</p>" +
        "<p><strong>Si tu ne te connectes pas d'ici le " + esc(datumFr(d.loeschAmMs)) + ", nous " +
        "supprimerons ton compte avec toute ta progression et tes données.</strong> " +
        "Il suffit de te connecter une fois - tout reste alors comme avant.</p>" +
        linkFr +
        KLEIN + "Tu reçois cet e-mail parce que tu as un compte personnel sans classe. " +
        "Si tu n'as plus besoin de ce compte, tu n'as rien à faire.</p>" +
        KLEIN + d.fuss + "</p>" +
        "</div>",
    };
  }
  if (sprache === "es") {
    // ★ ES-M: tú. `d.fuss` ist dann `LIFECYCLE_FUSS_ES` (mail_abbestellen_lib).
    var linkEs = d.appUrl
      ? '<p><a href="' + esc(d.appUrl) + '/lernwerkstatt">Iniciar sesión y seguir practicando</a></p>'
      : "";
    return {
      subject: "Tu cuenta de Sensorik se eliminará dentro de tres semanas",
      html:
        '<div lang="es" style="font-family:system-ui,Segoe UI,Arial,sans-serif;font-size:15px;color:#222">' +
        "<p>Hola, " + esc(d.name) + ":</p>" +
        "<p>Hace un año que no practicas en ninguno de los programas de aprendizaje - ni en " +
        "Tastenflow.</p>" +
        "<p><strong>Si no inicias sesión antes del " + esc(datumEs(d.loeschAmMs)) + ", " +
        "eliminaremos tu cuenta con todo tu progreso y tus datos.</strong> " +
        "Basta con iniciar sesión una vez - y todo sigue como está.</p>" +
        linkEs +
        KLEIN + "Recibes este correo porque tienes una cuenta propia, sin clase. Si ya no " +
        "necesitas la cuenta, no tienes que hacer nada.</p>" +
        KLEIN + d.fuss + "</p>" +
        "</div>",
    };
  }
  if (sprache === "it") {
    // ★ O-IT: tu. `d.fuss` ist dann `LIFECYCLE_FUSS_IT` (mail_abbestellen_lib).
    var linkIt = d.appUrl
      ? '<p><a href="' + esc(d.appUrl) + '/lernwerkstatt">Accedi e continua a esercitarti</a></p>'
      : "";
    return {
      subject: "Il tuo account Sensorik verrà cancellato tra tre settimane",
      html:
        '<div lang="it" style="font-family:system-ui,Segoe UI,Arial,sans-serif;font-size:15px;color:#222">' +
        "<p>Ciao " + esc(d.name) + ",</p>" +
        "<p>Da un anno non fai esercizio in nessuno dei programmi di apprendimento - né in " +
        "Tastenflow.</p>" +
        "<p><strong>Se non accedi entro il " + esc(datumIt(d.loeschAmMs)) + ", " +
        "cancelleremo il tuo account con tutti i tuoi progressi e i tuoi dati.</strong> " +
        "Basta accedere una volta - e tutto resta com'è.</p>" +
        linkIt +
        KLEIN + "Ricevi questa email perché hai un account personale, senza classe. Se l'account " +
        "non ti serve più, non devi fare niente.</p>" +
        KLEIN + d.fuss + "</p>" +
        "</div>",
    };
  }
  if (sprache === "pl") {
    // ★ O-PL: ty, Twój gross. `d.fuss` ist dann `LIFECYCLE_FUSS_PL` (mail_abbestellen_lib).
    // „zalogujesz się" ist Futur eines vollendeten Verbs - ohne Geschlecht (Regel 2).
    var linkPl = d.appUrl
      ? '<p><a href="' + esc(d.appUrl) + '/lernwerkstatt">Zaloguj się i ćwicz dalej</a></p>'
      : "";
    return {
      subject: "Twoje konto Sensorik zostanie usunięte za trzy tygodnie",
      html:
        '<div lang="pl" style="font-family:system-ui,Segoe UI,Arial,sans-serif;font-size:15px;color:#222">' +
        "<p>Dzień dobry,</p>" +
        "<p>Od roku na Twoim koncie nie ma nowych ćwiczeń w żadnym z programów do nauki " +
        "(Tastenflow).</p>" +
        "<p><strong>Jeśli nie zalogujesz się do " + esc(datumPl(d.loeschAmMs)) + ", " +
        "usuniemy Twoje konto razem ze wszystkimi postępami i danymi.</strong> " +
        "Wystarczy zalogować się raz - wtedy wszystko zostanie bez zmian.</p>" +
        linkPl +
        KLEIN + "Dostajesz tę wiadomość, bo masz konto prywatne bez klasy. Jeśli konto nie jest " +
        "Ci już potrzebne, nie musisz nic robić.</p>" +
        KLEIN + d.fuss + "</p>" +
        "</div>",
    };
  }
  if (sprache === "tr") {
    // ★ O-TR: sen. `d.fuss` ist dann `LIFECYCLE_FUSS_TR` (mail_abbestellen_lib).
    // Das Datum nach einem Doppelpunkt - nie „21 Eylül 2026'ya kadar" (Regel 6).
    var linkTr = d.appUrl
      ? '<p><a href="' + esc(d.appUrl) + '/lernwerkstatt">Giriş yap ve çalışmaya devam et</a></p>'
      : "";
    return {
      subject: "Sensorik hesabın üç hafta sonra silinecek",
      html:
        '<div lang="tr" style="font-family:system-ui,Segoe UI,Arial,sans-serif;font-size:15px;color:#222">' +
        "<p>" + (d.name ? "Merhaba " + esc(d.name) + "," : "Merhaba,") + "</p>" +
        "<p>Bir yıldır öğrenme programlarının hiçbirinde (Tastenflow) çalışmadın.</p>" +
        "<p><strong>Son tarih: " + esc(datumTr(d.loeschAmMs)) + ". Bu tarihe kadar giriş " +
        "yapmazsan hesabını tüm ilerlemen ve verilerinle birlikte sileceğiz.</strong> " +
        "Bir kez giriş yapman yeterli - o zaman her şey olduğu gibi kalır.</p>" +
        linkTr +
        KLEIN + "Bu e-postayı, sınıfa bağlı olmayan kişisel bir hesabın olduğu için alıyorsun. " +
        "Hesaba artık ihtiyacın yoksa bir şey yapmana gerek yok.</p>" +
        KLEIN + d.fuss + "</p>" +
        "</div>",
    };
  }
  if (sprache === "cs") {
    // ★ O-CS: ty. `d.fuss` ist dann `LIFECYCLE_FUSS_CS` (mail_abbestellen_lib).
    // „do 2. října 2026" - der Monat im Genitiv passt nach „do" (Glossar §4
    // Falle 7); kein „necvičil jsi" (Regel 2), der Satz spricht vom Konto.
    var linkCs = d.appUrl
      ? '<p><a href="' + esc(d.appUrl) + '/lernwerkstatt">Přihlásit se a cvičit dál</a></p>'
      : "";
    return {
      subject: "Tvůj účet Sensorik bude za tři týdny odstraněn",
      html:
        '<div lang="cs" style="font-family:system-ui,Segoe UI,Arial,sans-serif;font-size:15px;color:#222">' +
        "<p>Ahoj,</p>" +
        "<p>Už rok na tvém účtu není žádné nové cvičení v žádném z výukových programů " +
        "(Tastenflow).</p>" +
        "<p><strong>Pokud se do " + esc(datumCs(d.loeschAmMs)) + " nepřihlásíš, odstraníme " +
        "tvůj účet se všemi výsledky a daty.</strong> " +
        "Stačí se jednou přihlásit - pak všechno zůstane, jak je.</p>" +
        linkCs +
        KLEIN + "Tento e-mail dostáváš, protože máš vlastní účet bez třídy. Pokud účet už " +
        "nepotřebuješ, nemusíš nic dělat.</p>" +
        KLEIN + d.fuss + "</p>" +
        "</div>",
    };
  }
  // --- Deutsch: wörtlich aus tt_selflearner_lifecycle.pb.js (Stand vor EN9) ---
  var dt = new Date(d.loeschAmMs);
  var loeschDatum = pad2(dt.getDate()) + "." + pad2(dt.getMonth() + 1) + "." + dt.getFullYear();
  var link = d.appUrl
    ? '<p><a href="' + esc(d.appUrl) + '/lernwerkstatt">Jetzt anmelden und weiterüben</a></p>'
    : "";
  return {
    subject: "Dein Sensorik-Konto wird in drei Wochen gelöscht",
    html:
      '<div style="font-family:system-ui,Segoe UI,Arial,sans-serif;font-size:15px;color:#222">' +
      "<p>Hallo " + esc(d.name) + ",</p>" +
      "<p>du hast seit einem Jahr in keinem der Lernprogramme geübt - weder in " +
      "Tastenflow.</p>" +
      "<p><strong>Wenn du dich bis " + esc(loeschDatum) + " nicht anmeldest, " +
      "löschen wir dein Konto mit allen Spielständen und Daten.</strong> " +
      "Eine Anmeldung genügt - dann bleibt alles, wie es ist.</p>" +
      link +
      '<p style="color:#666;font-size:12px">Du bekommst diese Mail, weil du ein ' +
      "eigenes Konto ohne Klasse hast. Wenn du das Konto nicht mehr brauchst, " +
      "musst du nichts tun.</p>" +
      '<p style="color:#666;font-size:12px">' +
      d.fuss +
      "</p>" +
      "</div>",
  };
}

// ── 3. Die Begrüssung einer neuen Lehrkraft (tt_teacher_welcome) ────────────
//
// `d`: { name, appUrl }. Liefert auch den Absender-Namen (`vonName`) - der ist
// deutsch „Sensorik — Lernprogramme".

function willkommenMail(d, sprache) {
  var neun = neunLib(sprache);
  if (neun) return neun.willkommen(d, sprache); // ★ O4
  var link = function (path, label) {
    return d.appUrl ? '<a href="' + esc(d.appUrl) + path + '">' + label + "</a>" : label;
  };
  if (sprache === "en") {
    return {
      vonName: "Sensorik - learning apps",
      subject: "Welcome - your teacher account is ready",
      html:
        '<div lang="en">' +
        "<p>" + (d.name ? "Hello " + esc(d.name) + "," : "Hello,") + "</p>" +
        "<p>Your teacher account for the learning apps of the Sensorik learning platform " +
        "is set up. With it you can create classes and follow your pupils' progress - " +
        "in both apps with the same account:</p>" +
        "<ul>" +
        // Die Braille-App ist deutschsprachig und bleibt es (Glossar §2) - das
        // gehört dazugesagt, bevor jemand sie öffnet.
        "<li>" + link("/programme/braille", "Learn braille") + " (in German)</li>" +
        "<li>" + link("/programme/tastenflow", "Tastenflow (touch typing)") + "</li>" +
        "</ul>" +
        "<p>In each of them you sign in at the top right with this email address and " +
        "your password. If you ever forget your password, you can get a new one by " +
        "email at any time via " + link("/lernprogramm-passwort", "“Forgotten your password?”") + ".</p>" +
        KLEIN + "This confirmation was sent automatically because a teacher account was " +
        "created with this address. If that wasn't you, you can simply ignore this email.</p>" +
        "</div>",
    };
  }
  if (sprache === "fr") {
    // ★ E11c: vous. Die Braille-App bleibt deutsch - das wird dazugesagt.
    return {
      vonName: "Sensorik - applications d'apprentissage",
      subject: "Bienvenue - votre compte enseignant est prêt",
      html:
        '<div lang="fr">' +
        "<p>" + (d.name ? "Bonjour " + esc(d.name) + "," : "Bonjour,") + "</p>" +
        "<p>Votre compte enseignant pour les applications d'apprentissage de la plateforme " +
        "Sensorik est prêt. Avec lui, vous créez des classes et suivez les progrès de vos " +
        "élèves - dans les deux applications, avec le même compte :</p>" +
        "<ul>" +
        "<li>" + link("/programme/braille", "Apprendre le braille") + " (en allemand)</li>" +
        "<li>" + link("/programme/tastenflow", "Tastenflow (taper à dix doigts)") + "</li>" +
        "</ul>" +
        "<p>Dans chacune, vous vous connectez en haut à droite avec cette adresse e-mail et " +
        "votre mot de passe. Si vous oubliez votre mot de passe, vous en recevez un nouveau " +
        "par e-mail à tout moment avec " + link("/lernprogramm-passwort", '"Mot de passe oublié ?"') + ".</p>" +
        KLEIN + "Cette confirmation a été envoyée automatiquement parce qu'un compte enseignant " +
        "a été créé avec cette adresse. Si cela ne vient pas de vous, vous pouvez simplement " +
        "ignorer cet e-mail.</p>" +
        "</div>",
    };
  }
  if (sprache === "es") {
    // ★ ES-M: usted. Die Braille-App bleibt deutsch - das wird dazugesagt.
    // „Le damos la bienvenida" statt „Bienvenido/a" - ohne Geschlecht.
    // „¿Has olvidado la contraseña?" steht so am Anmeldeformular
    // (`TypingAuth.tsx`) - zitiert, damit es sich wiederfinden lässt.
    return {
      vonName: "Sensorik - programas de aprendizaje",
      subject: "Le damos la bienvenida - su cuenta de docente está lista",
      html:
        '<div lang="es">' +
        "<p>" + (d.name ? "Hola, " + esc(d.name) + ":" : "Hola:") + "</p>" +
        "<p>Su cuenta de docente para los programas de aprendizaje de la plataforma Sensorik " +
        "ya está creada. Con ella puede crear clases y seguir el progreso de su alumnado - " +
        "en los dos programas, con la misma cuenta:</p>" +
        "<ul>" +
        "<li>" + link("/programme/braille", "Aprender braille") + " (en alemán)</li>" +
        "<li>" + link("/programme/tastenflow", "Tastenflow (mecanografía con los diez dedos)") + "</li>" +
        "</ul>" +
        "<p>En cada uno inicia sesión arriba a la derecha con este correo electrónico y su " +
        "contraseña. Si alguna vez la olvida, puede pedir una nueva por correo en cualquier " +
        "momento con " + link("/lernprogramm-passwort", '"¿Has olvidado la contraseña?"') + ".</p>" +
        KLEIN + "Esta confirmación se envió automáticamente porque se creó una cuenta de docente " +
        "con esta dirección. Si no ha sido usted, puede ignorar este correo.</p>" +
        "</div>",
    };
  }
  if (sprache === "it") {
    // ★ O-IT: neutral ohne „Lei". Die Braille-App bleibt deutsch - das wird
    // dazugesagt. „Password dimenticata?" steht so am Anmeldeformular.
    return {
      vonName: "Sensorik - programmi di apprendimento",
      subject: "Account da insegnante pronto - programmi di apprendimento Sensorik",
      html:
        '<div lang="it">' +
        "<p>" + (d.name ? "Buongiorno " + esc(d.name) + "," : "Buongiorno,") + "</p>" +
        "<p>L'account da insegnante per i programmi di apprendimento della piattaforma Sensorik " +
        "è pronto. Con questo account si creano classi e si seguono i progressi degli alunni - " +
        "in tutti e due i programmi, con lo stesso account:</p>" +
        "<ul>" +
        "<li>" + link("/programme/braille", "Imparare il braille") + " (in tedesco)</li>" +
        "<li>" + link("/programme/tastenflow", "Tastenflow (scrivere con dieci dita)") + "</li>" +
        "</ul>" +
        "<p>In ognuno si accede in alto a destra con questo indirizzo email e la password. " +
        "Se la password si dimentica, se ne può chiedere una nuova via email in qualsiasi " +
        "momento con " + link("/lernprogramm-passwort", '"Password dimenticata?"') + ".</p>" +
        KLEIN + "Questa conferma è stata inviata automaticamente perché con questo indirizzo è " +
        "stato creato un account da insegnante. Se non è stato fatto da chi legge, basta " +
        "ignorare questa email.</p>" +
        "</div>",
    };
  }
  if (sprache === "pl") {
    // ★ O-PL: ty mit Twój gross, Beschreibungen unpersönlich („można"), nie
    // „Pan/Pani" (Regel 1). Die Braille-App bleibt deutsch - das wird
    // dazugesagt („po niemiecku", §3). „Nie pamiętasz hasła?" steht so am
    // Anmeldeformular (Glossar §2.5). Der Name fehlt in der Anrede (kein Vokativ, Regel 11).
    return {
      vonName: "Sensorik - programy do nauki",
      subject: "Konto dla nauczycieli jest gotowe - programy do nauki Sensorik",
      html:
        '<div lang="pl">' +
        "<p>Dzień dobry,</p>" +
        "<p>Twoje konto dla nauczycieli w programach do nauki na platformie Sensorik jest " +
        "gotowe. Na tym koncie można tworzyć klasy i śledzić postępy uczniów - w obu " +
        "programach, przy tym samym koncie:</p>" +
        "<ul>" +
        "<li>" + link("/programme/braille", "Nauka pisma Braille'a") + " (po niemiecku)</li>" +
        "<li>" + link("/programme/tastenflow", "Tastenflow (pisanie dziesięcioma palcami)") + "</li>" +
        "</ul>" +
        "<p>W każdym z nich logowanie jest w prawym górnym rogu - tym adresem e-mail i hasłem. " +
        "Nowe hasło można w każdej chwili dostać e-mailem: wystarczy otworzyć link " +
        link("/lernprogramm-passwort", "„Nie pamiętasz hasła?”") + ".</p>" +
        KLEIN + "To potwierdzenie zostało wysłane automatycznie, bo z tym adresem założono konto " +
        "dla nauczycieli. Jeśli wiadomość nie jest przeznaczona dla Ciebie, możesz ją zignorować.</p>" +
        "</div>",
    };
  }
  if (sprache === "tr") {
    // ★ O-TR: siz mit -(y)In bzw. „-abilirsiniz" (Regel 1), kein Ausrufezeichen.
    // Die Braille-App bleibt deutsch - das wird dazugesagt („(Almanca)", §3).
    // „Şifremi unuttum" steht so am Anmeldeformular (Glossar §2.5) - die
    // Endung hängt an „bağlantı", nicht am Zitat (Regel 6).
    return {
      vonName: "Sensorik - öğrenme programları",
      subject: "Öğretmen hesabınız hazır - Sensorik öğrenme programları",
      html:
        '<div lang="tr">' +
        "<p>" + (d.name ? "Merhaba " + esc(d.name) + "," : "Merhaba,") + "</p>" +
        "<p>Sensorik öğrenme platformundaki öğrenme programları için öğretmen hesabınız " +
        "oluşturuldu. Bu hesapla sınıf oluşturabilir ve öğrencilerinizin ilerlemesini " +
        "izleyebilirsiniz - iki programda da aynı hesapla:</p>" +
        "<ul>" +
        "<li>" + link("/programme/braille", "Braille yazısı öğrenme") + " (Almanca)</li>" +
        "<li>" + link("/programme/tastenflow", "Tastenflow (on parmak klavye)") + "</li>" +
        "</ul>" +
        "<p>İki programda da sağ üstten bu e-posta adresi ve şifrenizle giriş yapabilirsiniz. " +
        "Şifrenizi unutursanız istediğiniz zaman " +
        link("/lernprogramm-passwort", '"Şifremi unuttum"') + " bağlantısıyla e-posta ile yeni " +
        "bir şifre alabilirsiniz.</p>" +
        KLEIN + "Bu onay e-postası, bu adresle bir öğretmen hesabı oluşturulduğu için otomatik " +
        "olarak gönderildi. Hesabı siz oluşturmadıysanız bu e-postayı dikkate almayabilirsiniz.</p>" +
        "</div>",
    };
  }
  if (sprache === "cs") {
    // ★ O-CS: vy in der Mehrzahlform (Regel 1), kein Ausrufezeichen, „Dobrý
    // den," OHNE Namen (kein Vokativ, Regel 12). Die Braille-App bleibt deutsch
    // - das wird dazugesagt („(v němčině)", §3). „Zapomenuté heslo?" steht so am
    // Anmeldeformular (Glossar §2.5). Kein „Pokud jste účet nezaložili"
    // (Vergangenheit mit Geschlecht, Regel 2) - der Satz spricht vom E-Mail.
    return {
      vonName: "Sensorik - výukové programy",
      subject: "Účet pro vyučující je připraven - výukové programy Sensorik",
      html:
        '<div lang="cs">' +
        "<p>Dobrý den,</p>" +
        "<p>Váš účet pro vyučující ve výukových programech platformy Sensorik je připraven. " +
        "Můžete v něm vytvářet třídy a sledovat pokrok žáků - v obou programech se stejným " +
        "účtem:</p>" +
        "<ul>" +
        "<li>" + link("/programme/braille", "Učit se Braillovo písmo") + " (v němčině)</li>" +
        "<li>" + link("/programme/tastenflow", "Tastenflow (psaní všemi deseti)") + "</li>" +
        "</ul>" +
        "<p>V obou programech se přihlásíte vpravo nahoře touto e-mailovou adresou a svým " +
        "heslem. Pokud heslo zapomenete, otevřete odkaz " +
        link("/lernprogramm-passwort", "„Zapomenuté heslo?“") + " - nové heslo vám přijde e-mailem.</p>" +
        KLEIN + "Toto potvrzení bylo odesláno automaticky, protože s touto adresou vznikl účet " +
        "pro vyučující. Pokud tento e-mail není určen vám, můžete ho ignorovat.</p>" +
        "</div>",
    };
  }
  // --- Deutsch: wörtlich aus tt_teacher_welcome.pb.js (Stand vor EN9) ---
  var anrede = d.name ? "Hallo " + esc(d.name) + "," : "Hallo,";
  return {
    vonName: "Sensorik — Lernprogramme",
    subject: "Willkommen — dein Lehrkraft-Konto ist da",
    html:
      "<p>" + anrede + "</p>" +
      "<p>dein Lehrkraft-Konto für die Lernprogramme der Sensorik-Lernplattform " +
      "ist eingerichtet. Damit kannst du Klassen anlegen und den Lernfortschritt " +
      "deiner Schüler:innen verfolgen — in beiden Programmen mit demselben Konto:</p>" +
      "<ul>" +
      "<li>" + link("/programme/braille", "Brailleschrift lernen") + "</li>" +
      "<li>" + link("/programme/tastenflow", "Tastenflow (Zehnfinger-Tippen)") + "</li>" +
      "</ul>" +
      "<p>Anmelden kannst du dich dort jeweils oben rechts mit dieser E-Mail-Adresse " +
      "und deinem Passwort. Passwort einmal vergessen? Über " +
      link("/lernprogramm-passwort", "„Passwort vergessen\"") +
      " bekommst du jederzeit einen neuen Zugang per Mail.</p>" +
      '<p style="color:#666;font-size:12px">Diese Bestätigung wurde automatisch ' +
      "versendet, weil mit dieser Adresse ein Lehrkraft-Konto erstellt wurde. " +
      "Warst du das nicht, kannst du diese Mail einfach ignorieren.</p>",
  };
}

// ── 4. Ein Kind antwortet der Lehrkraft (lw_message_mail) ──────────────────
//
// `d`: { fromName ("" = unbekannt), body (Klartext des Kindes), appUrl }.
// Die Nachricht selbst ist INHALT, sie bleibt, wie das Kind sie geschrieben hat.

function nachrichtMail(d, sprache) {
  var neun = neunLib(sprache);
  if (neun) return neun.nachricht(d, sprache); // ★ O4
  var safeBody = esc(d.body).replace(/\n/g, "<br>");
  if (sprache === "en") {
    var wer = d.fromName || "A pupil";
    var openLineEn = d.appUrl
      ? '<p><a href="' + esc(d.appUrl) + '/lernwerkstatt">Go to Lernwerkstatt</a></p>'
      : "";
    return {
      subject: "New reply in Lernwerkstatt: " + wer,
      html:
        '<div lang="en">' +
        "<p>" + esc(wer) + " has written to you in Lernwerkstatt:</p>" +
        '<blockquote style="border-left:3px solid #ccc;margin:0;padding:0 0 0 12px;color:#333">' +
        safeBody +
        "</blockquote>" +
        openLineEn +
        KLEIN + "This email was sent automatically by the Sensorik Lernwerkstatt. You'll also " +
        "find the message in Lernwerkstatt under the bell symbol at the top right, and you " +
        "can reply to it there directly.</p>" +
        "</div>",
    };
  }
  if (sprache === "fr") {
    // ★ E11c: vous (die Lehrkraft). „Un enfant" wie im Deutschen „Ein Kind".
    var werFr = d.fromName || "Un enfant";
    var openLineFr = d.appUrl
      ? '<p><a href="' + esc(d.appUrl) + '/lernwerkstatt">Aller à Lernwerkstatt</a></p>'
      : "";
    return {
      subject: "Nouvelle réponse dans Lernwerkstatt : " + werFr,
      html:
        '<div lang="fr">' +
        "<p>" + esc(werFr) + " vous a écrit dans Lernwerkstatt :</p>" +
        '<blockquote style="border-left:3px solid #ccc;margin:0;padding:0 0 0 12px;color:#333">' +
        safeBody +
        "</blockquote>" +
        openLineFr +
        KLEIN + "Cet e-mail a été envoyé automatiquement par Sensorik Lernwerkstatt. Vous " +
        "trouvez aussi le message dans Lernwerkstatt, sous le symbole de la cloche en haut à " +
        "droite, et vous pouvez y répondre directement.</p>" +
        "</div>",
    };
  }
  if (sprache === "es") {
    // ★ ES-M: usted (die Lehrkraft). Ohne Namen „Alguien de su clase" - ohne
    // Geschlecht, anders als „un niño" (S10).
    var werEs = d.fromName || "Alguien de su clase";
    var openLineEs = d.appUrl
      ? '<p><a href="' + esc(d.appUrl) + '/lernwerkstatt">Ir a Lernwerkstatt</a></p>'
      : "";
    return {
      subject: "Nueva respuesta en Lernwerkstatt: " + werEs,
      html:
        '<div lang="es">' +
        "<p>" + esc(werEs) + " le ha escrito en Lernwerkstatt:</p>" +
        '<blockquote style="border-left:3px solid #ccc;margin:0;padding:0 0 0 12px;color:#333">' +
        safeBody +
        "</blockquote>" +
        openLineEs +
        KLEIN + "Este correo lo ha enviado automáticamente Sensorik Lernwerkstatt. También " +
        "encontrará el mensaje en Lernwerkstatt, bajo el símbolo de la campana arriba a la " +
        "derecha, y puede responder allí directamente.</p>" +
        "</div>",
    };
  }
  if (sprache === "it") {
    // ★ O-IT: neutral (die Lehrkraft). Ohne Namen „Una persona della classe" -
    // ohne Geschlecht (Regel 2).
    var werIt = d.fromName || "Una persona della classe";
    var openLineIt = d.appUrl
      ? '<p><a href="' + esc(d.appUrl) + '/lernwerkstatt">Vai a Lernwerkstatt</a></p>'
      : "";
    return {
      subject: "Nuova risposta in Lernwerkstatt: " + werIt,
      html:
        '<div lang="it">' +
        "<p>" + esc(werIt) + " ha scritto in Lernwerkstatt:</p>" +
        '<blockquote style="border-left:3px solid #ccc;margin:0;padding:0 0 0 12px;color:#333">' +
        safeBody +
        "</blockquote>" +
        openLineIt +
        KLEIN + "Questa email è stata inviata automaticamente da Sensorik Lernwerkstatt. Il " +
        "messaggio si trova anche in Lernwerkstatt, sotto il simbolo della campanella in alto a " +
        "destra, e lì si può rispondere direttamente.</p>" +
        "</div>",
    };
  }
  if (sprache === "pl") {
    // ★ O-PL: an die Lehrkraft, ty mit Ciebie gross. Der Name als Subjekt im
    // Präsens („Ania pisze do Ciebie"), sonst „Osoba z klasy" (Glossar §2.6) -
    // ohne Geschlecht (Regel 2). Lernwerkstatt mit Nomen davor (Regel 11).
    var werPl = d.fromName || "Osoba z klasy";
    var openLinePl = d.appUrl
      ? '<p><a href="' + esc(d.appUrl) + '/lernwerkstatt">Przejdź do platformy Lernwerkstatt</a></p>'
      : "";
    return {
      subject: "Nowa odpowiedź na platformie Lernwerkstatt - od: " + werPl,
      html:
        '<div lang="pl">' +
        "<p>" + esc(werPl) + " pisze do Ciebie na platformie Lernwerkstatt:</p>" +
        '<blockquote style="border-left:3px solid #ccc;margin:0;padding:0 0 0 12px;color:#333">' +
        safeBody +
        "</blockquote>" +
        openLinePl +
        KLEIN + "Ta wiadomość została wysłana automatycznie przez platformę Sensorik Lernwerkstatt. " +
        "Wiadomość jest też na platformie Lernwerkstatt pod symbolem dzwonka w prawym górnym " +
        "rogu - tam możesz od razu odpowiedzieć.</p>" +
        "</div>",
    };
  }
  if (sprache === "tr") {
    // ★ O-TR: an die Lehrkraft, siz. Der Name nach „Gönderen:", ohne Namen
    // „Sınıftan biri" (Glossar §2.11) - nie mit Endung (Regel 6);
    // Lernwerkstatt vor einem festen Wort („Lernwerkstatt üzerinden").
    var werTr = d.fromName || "Sınıftan biri";
    var openLineTr = d.appUrl
      ? '<p><a href="' + esc(d.appUrl) + '/lernwerkstatt">Lernwerkstatt sayfasına git</a></p>'
      : "";
    return {
      subject: "Lernwerkstatt: yeni yanıt - Gönderen: " + werTr,
      html:
        '<div lang="tr">' +
        "<p>Lernwerkstatt üzerinden size yeni bir mesaj var. Gönderen: " + esc(werTr) + "</p>" +
        '<blockquote style="border-left:3px solid #ccc;margin:0;padding:0 0 0 12px;color:#333">' +
        safeBody +
        "</blockquote>" +
        openLineTr +
        KLEIN + "Bu e-posta Sensorik Lernwerkstatt tarafından otomatik olarak gönderildi. Mesajı " +
        "Lernwerkstatt içinde, sağ üstteki zil simgesinin altında da bulabilir ve oradan doğrudan " +
        "yanıtlayabilirsiniz.</p>" +
        "</div>",
    };
  }
  if (sprache === "cs") {
    // ★ O-CS: an die Lehrkraft, vy. Der Name nach „Od:", nie gebeugt (Regel
    // 12); ohne Namen „Někdo ze třídy" - ohne Geschlecht (Regel 2).
    // Lernwerkstatt mit Kopfwort („v aplikaci Lernwerkstatt", §3).
    var werCs = d.fromName || "Někdo ze třídy";
    var openLineCs = d.appUrl
      ? '<p><a href="' + esc(d.appUrl) + '/lernwerkstatt">Přejít do aplikace Lernwerkstatt</a></p>'
      : "";
    return {
      subject: "Nová odpověď v aplikaci Lernwerkstatt - od: " + werCs,
      html:
        '<div lang="cs">' +
        "<p>V aplikaci Lernwerkstatt pro vás je nová zpráva. Od: " + esc(werCs) + "</p>" +
        '<blockquote style="border-left:3px solid #ccc;margin:0;padding:0 0 0 12px;color:#333">' +
        safeBody +
        "</blockquote>" +
        openLineCs +
        KLEIN + "Tento e-mail odeslala automaticky aplikace Sensorik Lernwerkstatt. Zprávu najdete " +
        "také v aplikaci Lernwerkstatt pod symbolem zvonku vpravo nahoře a můžete na ni přímo " +
        "odpovědět.</p>" +
        "</div>",
    };
  }
  // --- Deutsch: wörtlich aus lw_message_mail.pb.js (Stand vor EN9) ---
  var fromName = d.fromName || "Ein Kind";
  var openLine = d.appUrl
    ? '<p><a href="' + esc(d.appUrl) + '/lernwerkstatt">Zur Lernwerkstatt</a></p>'
    : "";
  return {
    subject: "Neue Antwort in der Lernwerkstatt: " + fromName,
    html:
      "<p>" +
      esc(fromName) +
      " hat dir in der Lernwerkstatt geschrieben:</p>" +
      '<blockquote style="border-left:3px solid #ccc;margin:0;padding:0 0 0 12px;color:#333">' +
      safeBody +
      "</blockquote>" +
      openLine +
      '<p style="color:#666;font-size:12px">Diese Mail wurde automatisch ' +
      "von der Sensorik-Lernwerkstatt versendet. Du findest die Nachricht " +
      "auch in der Lernwerkstatt unter dem Glocken-Symbol oben rechts und " +
      "kannst dort direkt antworten.</p>",
  };
}

// ── 5. Die Sammel-Mail der Tippchallenge (tt_schreibprobe_mail) ────────────
//
// `d`: { wort (der Name der Challenge - „Tippchallenge" bzw. „Typing
// Challenge", eine Kopie im Hook), teacherName, className, alleFertig,
// niveau (Schlüssel), textNr, startZeile, dauerMin, startMs, zuschlag,
// angetreten, anzahlKinder, schnittA, genauSchnitt (0..1|null), reihen,
// appUrl, fehlerGewicht, bezugstempo, mindZeichen, fussHtml }.
// ⚠️ `startMs` kommt vom Hook schon auf die NAIVE WIENER WANDUHR verschoben
// (`plan.startMs + wienOffsetMs(...)`, tt_wochenziel_lib.pb.js) - `fmtZeit`
// liest seine Felder darum mit UTC-Gettern, nicht mit lokalen (Nachtrag
// 19.09.2026: vorher zeigte die Mail die Server-Uhr (UTC) und ging damit in
// Wien 1-2 Std. NACH).
// `reihen[i]`: { name, da, rang, gewertet, wert, vorlesenMs, anschlaege, apm,
// genau, zeichen, fehler, wacklig ([{zeichen, quote}]|null), zusatz,
// textZuEnde, frueherAbgegeben } - schon sortiert (bestes zuerst).

/** Die Tastaturniveaus deutsch - wie `NIVEAU_NAMEN` im Hook bis EN9 (ohne „eigen"). */
var NIVEAU_NAMEN_DE = {
  start: "Grundreihe",
  gross: "Erste Buchstaben",
  buchstaben: "Alle Buchstaben",
  satz: "Mit Satzzeichen",
  zahlen: "Mit Zahlen",
  alles: "Alles",
  code: "Programmcode",
};

/** Dieselben englisch - die Kurzformen aus `schreibprobe.ts` (`en.kurz`, EN5). */
var NIVEAU_NAMEN_EN = {
  start: "Home row",
  gross: "First letters",
  buchstaben: "All letters",
  satz: "With punctuation",
  zahlen: "With numbers",
  alles: "All keys",
  code: "Program code",
  eigen: "Custom file",
};

/** Dieselben französisch (E11c) - die Kurzformen aus `schreibprobe.ts` (`fr.kurz`). */
var NIVEAU_NAMEN_FR = {
  start: "Rangée de base",
  gross: "Premières lettres",
  buchstaben: "Toutes les lettres",
  satz: "Avec ponctuation",
  zahlen: "Avec chiffres",
  alles: "Toutes les touches",
  code: "Code informatique",
  eigen: "Fichier personnel",
};

/** Dieselben spanisch (ES-M) - die Kurzformen aus `schreibprobe.ts` (`es.kurz`). */
var NIVEAU_NAMEN_ES = {
  start: "Fila guía",
  gross: "Primeras letras",
  buchstaben: "Todas las letras",
  satz: "Con puntuación",
  zahlen: "Con números",
  alles: "Todas las teclas",
  code: "Código informático",
  eigen: "Archivo propio",
};

/** Dieselben italienisch (O-IT) - die Kurzformen aus `schreibprobe.ts` (`it.kurz`, Glossar §2.3). */
var NIVEAU_NAMEN_IT = {
  start: "Riga di base",
  gross: "Prime lettere",
  buchstaben: "Tutte le lettere",
  satz: "Con punteggiatura",
  zahlen: "Con numeri",
  alles: "Tutti i tasti",
  code: "Codice",
  eigen: "File personale",
};

/** Dieselben polnisch (O-PL) - „używane klawisze", Glossar §2.3. */
var NIVEAU_NAMEN_PL = {
  start: "Rząd podstawowy",
  gross: "Pierwsze litery",
  buchstaben: "Wszystkie litery",
  satz: "Z interpunkcją",
  zahlen: "Z cyframi",
  alles: "Wszystkie klawisze",
  code: "Kod",
  eigen: "Własny plik",
};

/**
 * Dieselben türkisch (O-TR) - „kullanılan tuşlar", Glossar §2.3. „eigen" in
 * der siz-Form („Kendi dosyanız"), weil die Mail an die Lehrkraft geht (das
 * Glossar nennt die sen-Form „Kendi dosyan" für die Oberfläche).
 */
var NIVEAU_NAMEN_TR = {
  start: "Temel sıra",
  gross: "İlk harfler",
  buchstaben: "Tüm harfler",
  satz: "Noktalama ile",
  zahlen: "Sayılarla",
  alles: "Tüm tuşlar",
  code: "Kod",
  eigen: "Kendi dosyanız",
};

/** Dieselben tschechisch (O-CS) - „použité klávesy", Glossar §2.3. */
var NIVEAU_NAMEN_CS = {
  start: "Základní řada",
  gross: "První písmena",
  buchstaben: "Všechna písmena",
  satz: "S interpunkcí",
  zahlen: "S číslicemi",
  alles: "Všechny klávesy",
  code: "Kód",
  eigen: "Vlastní soubor",
};

var NIVEAU_NAMEN_JE_SPRACHE = {
  de: NIVEAU_NAMEN_DE,
  en: NIVEAU_NAMEN_EN,
  fr: NIVEAU_NAMEN_FR,
  es: NIVEAU_NAMEN_ES,
  it: NIVEAU_NAMEN_IT,
  pl: NIVEAU_NAMEN_PL,
  tr: NIVEAU_NAMEN_TR,
  cs: NIVEAU_NAMEN_CS,
};

/** Der Name des Niveaus für Betreff und Kopf. */
function niveauName(niveau, sprache) {
  var neun = neunLib(sprache);
  if (neun) return neun.niveauName(niveau, sprache); // ★ O4
  // ★ ES-M: als Tabelle je Sprache - eine unbekannte Sprache bekommt Deutsch.
  var tabelle = NIVEAU_NAMEN_JE_SPRACHE[sprache] || NIVEAU_NAMEN_DE;
  return tabelle[niveau] || niveau;
}

function schreibprobeMail(d, sprache) {
  var neun = neunLib(sprache);
  if (neun) return neun.schreibprobe(d, sprache); // ★ O4
  var en = sprache === "en";
  // ★ E11c: Französisch. `w(deutsch, englisch, französisch)` wählt das Wort -
  // Deutsch und Englisch bleiben dabei Zeichen für Zeichen, was vorher dastand.
  var fr = sprache === "fr";
  // ★ ES-M (27.09.2026): Spanisch - `w` bekommt das spanische Wort als
  // viertes (usted an die Lehrkraft, Glossar Befund ES-O §2).
  var es = sprache === "es";
  // ★ O-IT (02.10.2026): Italienisch als fünftes Wort (neutral an die Lehrkraft).
  var it = sprache === "it";
  // ★ O-PL (02.10.2026): Polnisch als sechstes Wort (ty an die Lehrkraft, nie „Pan/Pani").
  var pl = sprache === "pl";
  // ★ O-TR (02.10.2026): Türkisch als siebtes Wort (siz an die Lehrkraft, Glossar Regel 1).
  var tr = sprache === "tr";
  // ★ O-CS (03.10.2026): Tschechisch als achtes Wort (vy an die Lehrkraft, Glossar Regel 1).
  var cs = sprache === "cs";
  var w = function (de, enText, frText, esText, itText, plText, trText, csText) {
    return en ? enText : fr ? frText : es ? esText : it ? itText : pl ? plText : tr ? trText : cs ? csText : de;
  };
  // ★ 23.09.2026 („Freies Schreiben", E6): die Art im Mail-TEXT nennen und
  // die Fehler-Spalte umbenennen - siehe `d.modus` (aus `tt_schreibprobe_mail.pb.js`).
  var frei = d.modus === "frei";
  var td = 'style="padding:6px 8px;border-bottom:1px solid #eee"';
  var tdR = 'style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right"';
  // Prozent: deutsch „90.7 %" (so stand es da - mit Punkt), englisch „90.7%".
  // Französisch „90,7 %" - Komma und Leerzeichen (Bauplan §9.1).
  var proz = function (x) {
    // ★ O-IT: „90,7%" - Komma, ohne Leerzeichen (Glossar Regel 5).
    // ★ O-PL: ebenso „90,7%" (Glossar pl Regel 5).
    if (it || pl) return x > 0 ? String(Math.round(x * 1000) / 10).replace(".", ",") + "%" : "-";
    // ★ O-TR: „%90,7" - das Zeichen VOR der Zahl, Komma (Glossar tr Regel 5).
    if (tr) return x > 0 ? "%" + String(Math.round(x * 1000) / 10).replace(".", ",") : "-";
    // ★ O-CS: „90,7 %" - Komma, GESCHÜTZTES Leerzeichen U+00A0 (Glossar cs Regel 5).
    if (cs) return x > 0 ? String(Math.round(x * 1000) / 10).replace(".", ",") + "\u00a0%" : "-";
    if (fr) return x > 0 ? String(Math.round(x * 1000) / 10).replace(".", ",") + " %" : "-";
    return x > 0 ? Math.round(x * 1000) / 10 + (en ? "%" : " %") : "-";
  };
  // Eine Kommazahl: deutsch mit Komma, englisch mit Punkt.
  // ★ ES-M: spanisch mit Punkt (RAE/ASALE 2010, wie `eineStelle` in der App);
  // Prozent spanisch „90.7 %" - Punkt UND Leerzeichen, also wie `proz` deutsch.
  var komma = function (x) {
    return en || es ? String(x) : String(x).replace(".", ",");
  };
  // ★ UTC-Getter, nicht lokale (Nachtrag 19.09.2026): `d.startMs` kommt vom
  // Hook schon als NAIVE Wiener Wanduhr (siehe Dateikopf) - ein lokaler
  // Getter hinge zusätzlich von der Zeitzone der ausführenden Laufzeit ab.
  var fmtZeit = function (ts) {
    if (!ts) return "-";
    var dt = new Date(ts);
    // ★ O-CS: „18. září 2026, 10:05" - der Monat im Genitiv (Glossar §2.10).
    if (cs)
      return dt.getUTCDate() + ". " + MONATE_CS_GEN[dt.getUTCMonth()] + " " + dt.getUTCFullYear() +
        ", " + dt.getUTCHours() + ":" + pad2(dt.getUTCMinutes());
    // ★ O-TR: „18 Eylül 2026, 08:05" - Monat gross, Stunde mit Null (Glossar §2.10).
    if (tr)
      return dt.getUTCDate() + " " + MONATE_TR[dt.getUTCMonth()] + " " + dt.getUTCFullYear() +
        ", " + pad2(dt.getUTCHours()) + ":" + pad2(dt.getUTCMinutes());
    // ★ O-PL: „18 września 2026, 10:05" - der Monat im Genitiv (Glossar §2.10).
    if (pl)
      return dt.getUTCDate() + " " + MONATE_PL_GEN[dt.getUTCMonth()] + " " + dt.getUTCFullYear() +
        ", " + dt.getUTCHours() + ":" + pad2(dt.getUTCMinutes());
    // ★ O-IT: „18 settembre 2026, 10:05".
    if (it)
      return dt.getUTCDate() + " " + MONATE_IT[dt.getUTCMonth()] + " " + dt.getUTCFullYear() +
        ", " + dt.getUTCHours() + ":" + pad2(dt.getUTCMinutes());
    // ★ ES-M: Spanisch „18 de septiembre de 2026, 10:05".
    if (es)
      return dt.getUTCDate() + " de " + MONATE_ES[dt.getUTCMonth()] + " de " + dt.getUTCFullYear() +
        ", " + dt.getUTCHours() + ":" + pad2(dt.getUTCMinutes());
    // Französisch „21 septembre 2026, 10 h 05" (Bauplan §9.1).
    if (fr)
      return dt.getUTCDate() + " " + MONATE_FR[dt.getUTCMonth()] + " " + dt.getUTCFullYear() +
        ", " + dt.getUTCHours() + " h " + pad2(dt.getUTCMinutes());
    return en
      ? dt.getUTCDate() + " " + MONATE_EN[dt.getUTCMonth()] + " " + dt.getUTCFullYear() +
          ", " + pad2(dt.getUTCHours()) + ":" + pad2(dt.getUTCMinutes())
      : pad2(dt.getUTCDate()) + "." + pad2(dt.getUTCMonth() + 1) + "." + dt.getUTCFullYear() +
          ", " + pad2(dt.getUTCHours()) + ":" + pad2(dt.getUTCMinutes());
  };
  /*
    ★ D2 (28.09.2026): Die Startzeit steht in der Zeitzone der Lehrkraft
    (`d.startMs` kommt vom Hook schon in IHRE Wanduhr verschoben,
    `tt_zeitzone_lib.pb.js`). `d.zeitLokal`:
      true      ⇒ Ortszeit der Lehrkraft - kein Zusatz;
      false     ⇒ keine (bekannte) Zone am Konto - Wiener Zeit, und die Mail
                  sagt es dazu, in jeder Sprache;
      fehlt     ⇒ wie vor D2 (Deutsch/Englisch/Französisch ohne Zusatz,
                  Spanisch mit) - für Aufrufer, die den Wert nicht kennen.
  */
  var zeitZusatz =
    d.zeitLokal === true
      ? ""
      : d.zeitLokal === false || es
        ? w(" (mitteleuropäische Zeit)", " (Central European Time)", " (heure d'Europe centrale)", " (hora de Europa central)", " (ora dell'Europa centrale)", " (czas środkowoeuropejski)", " (Orta Avrupa saati)", " (středoevropský čas)")
        : "";
  var reihen = d.reihen || [];

  var rows = "";
  for (var i = 0; i < reihen.length; i++) {
    var r = reihen[i];
    if (!r.da) {
      rows +=
        '<tr style="color:#999">' +
        "<td " + td + ">-</td>" +
        "<td " + td + ">" + escLeer(r.name) + "</td>" +
        '<td colspan="7" ' + td + ">" + w("nicht angetreten", "did not take part", "n'a pas participé", "no participó", "non ha partecipato", "bez udziału", "katılmadı", "bez účasti") + "</td>" +
        "</tr>";
      continue;
    }
    // ★ O-TR: türkisch steht „%" VOR der Zahl („%100", „a (%25)", „+%10 ek süre").
    var rangZelle = r.rang === null
      ? '<span style="color:#999">-</span>'
      // ★ O-CS: tschechisch „95 %" mit GESCHÜTZTEM Leerzeichen (Glossar cs Regel 5).
      : cs
        ? "<b>" + komma(r.rang) + "\u00a0%</b>"
      : tr
        ? "<b>%" + komma(r.rang) + "</b>"
        : "<b>" + komma(r.rang) + (en || it || pl ? "%" : " %") + "</b>";
    var wacklig = r.wacklig
      ? r.wacklig
          .map(function (w) {
            if (tr) return w.zeichen + " (%" + Math.round((1 - (w.quote || 0)) * 100) + ")";
            if (cs) return w.zeichen + " (" + Math.round((1 - (w.quote || 0)) * 100) + "\u00a0%)";
            return w.zeichen + " (" + Math.round((1 - (w.quote || 0)) * 100) + (en || it || pl ? "%)" : " %)");
          })
          .join(", ")
      : "";
    var hinweise = [];
    if (r.zusatz > 0 && tr) hinweise.push("+%" + r.zusatz + " ek süre");
    else if (r.zusatz > 0 && cs) hinweise.push("+" + r.zusatz + "\u00a0% času navíc");
    else if (r.zusatz > 0) hinweise.push("+" + r.zusatz + w(" % gewertet", "% counted", " % de temps en plus", " % de tiempo extra", "% di tempo in più", "% dodatkowego czasu"));
    if (r.textZuEnde) hinweise.push(w("Text zu Ende", "reached the end of the text", "texte tapé jusqu'au bout", "texto escrito hasta el final", "testo scritto fino alla fine", "tekst napisany do końca", "metni sonuna kadar yazdı", "text dopsán do konce"));
    if (r.frueherAbgegeben) hinweise.push(w("frueher abgegeben", "handed in early", "rendu plus tôt", "entregado antes de tiempo", "consegnata prima del tempo", "oddane przed czasem", "süre bitmeden teslim etti", "odevzdáno před koncem času"));
    // ★ 23.09.2026 („Freies Schreiben", E6): Korrekturen je Kind, wenn
    // vorhanden - nur zur Auskunft, siehe `SchreibprobeErgebnis.korrekturen`.
    if (typeof r.korrekturen === "number")
      hinweise.push(w("Korrekturen: ", "corrections: ", "corrections : ", "correcciones: ", "correzioni: ", "poprawki: ", "düzeltme: ", "opravy: ") + r.korrekturen);
    var sek = Math.round(r.vorlesenMs / 1000);
    rows +=
      "<tr>" +
      "<td " + tdR + ">" + rangZelle + "</td>" +
      "<td " + td + ">" + escLeer(r.name) + "</td>" +
      "<td " + tdR + ">" +
      (r.gewertet ? "<b>" + komma(r.wert) + "</b>" : '<span style="color:#999">-</span>') +
      "</td>" +
      "<td " + td + ">" +
      // Dieselbe Schreibweise wie in der App („ja, 2:14 abgezogen").
      (r.vorlesenMs > 0
        ? w("ja, ", "yes, ", "oui, ", "sí, ", "sì, ", "tak, odjęto ", "evet, düşülen: ", "ano, odečteno ") +
          Math.floor(sek / 60) + ":" + (sek % 60 < 10 ? "0" : "") + (sek % 60) +
          w(" abgezogen", " taken off", " déduit", " descontados", " tolti", "", "", "")
        : w("nein", "no", "non", "no", "no", "nie", "hayır", "ne")) +
      "</td>" +
      "<td " + tdR + ">" + r.anschlaege +
      (r.apm !== r.anschlaege ? ' <span style="color:#666">(' + r.apm + ")</span>" : "") +
      "</td>" +
      "<td " + tdR + ">" + escLeer(proz(r.genau)) + "</td>" +
      "<td " + tdR + ">" + r.zeichen + "</td>" +
      "<td " + tdR + ">" + r.fehler + "</td>" +
      "<td " + td + ">" + escLeer(wacklig || "-") +
      (!r.gewertet
        ? '<br><span style="color:#666;font-size:12px">' +
          w("zu kurz fuer eine Wertung", "too short to score", "trop court pour un score", "demasiado corto para una puntuación", "troppo breve per un punteggio", "za mało tekstu, by policzyć wynik", "puan için çok kısa", "příliš málo textu pro skóre") + "</span>"
        : "") +
      (hinweise.length
        ? '<br><span style="color:#666;font-size:12px">' + escLeer(hinweise.join(" · ")) + "</span>"
        : "") +
      "</td>" +
      "</tr>";
  }

  var niveau = niveauName(d.niveau, sprache);
  var schnittG = d.angetreten ? proz(d.genauSchnitt) : "-";
  var mitKlammer = reihen.some(function (x) {
    return x.da && x.apm !== x.anschlaege;
  });
  var th = function (text, rechts) {
    return (
      '<th style="padding:6px 8px;border-bottom:2px solid #ccc' + (rechts ? ";text-align:right" : "") + '">' +
      text + "</th>"
    );
  };

  if (en) {
    var openLineEn = d.appUrl
      ? '<p><a href="' + escLeer(d.appUrl) + '/meine-klasse?app=tippen">Go to the class</a></p>'
      : "";
    return {
      subject: d.wort + " - " + d.className + " (" + niveau + ")",
      html:
        '<div lang="en">' +
        "<p>Hello" + (d.teacherName ? " " + escLeer(d.teacherName) : "") + ",</p>" +
        "<p>The " + d.wort + " for your class <b>" + escLeer(d.className) + "</b> is " +
        (d.alleFertig ? "complete - every pupil has finished" : "over") + ".</p>" +
        "<p>" +
        "Key range: <b>" + escLeer(niveau) + "</b> · " +
        "Text " + ((Number(d.textNr) || 0) + 1) +
        (Number(d.startZeile) > 0 ? ", from line " + (Number(d.startZeile) + 1) : " of 15") +
        " · " +
        "Time limit " + d.dauerMin + (Number(d.dauerMin) === 1 ? " minute" : " minutes") + " · " +
        "Start " + escLeer(fmtZeit(d.startMs)) + zeitZusatz +
        (d.zuschlag > 0 ? " · Extra time " + d.zuschlag + "%" : "") +
        (frei
          ? " · Type: Free writing - a mistake left standing counts as " + d.fehlerGewicht + " characters"
          : "") +
        "</p>" +
        "<p>" + d.angetreten + " of " + d.anzahlKinder + (d.anzahlKinder === 1 ? " pupil" : " pupils") +
        " took part" +
        (d.angetreten
          ? " - on average <b>" + d.schnittA + " keystrokes per minute</b> with " + escLeer(schnittG) + " accuracy."
          : ".") +
        "</p>" +
        '<table style="border-collapse:collapse;font-size:14px">' +
        '<thead><tr style="text-align:left">' +
        th("Place", true) + th("Name") + th("Score", true) + th("Read aloud") +
        th("Keystrokes/min", true) + th("Accuracy", true) + th("Characters", true) +
        th(frei ? "Mistakes left" : "Mistakes", true) + th("Wobbly keys") +
        "</tr></thead><tbody>" + rows + "</tbody></table>" +
        '<p style="color:#666;font-size:13px"><b>How the place is worked out:</b> ' +
        "accuracy counts for more than speed - a wrong key weighs as much as " +
        d.fehlerGewicht + " characters, and double the speed does not count double " +
        "(square root, relative to " + d.bezugstempo + " keystrokes per minute). " +
        "<b>100% goes to the best result in this round</b> - it is a ranking, not a " +
        "mark. Anyone who typed fewer than " + d.mindZeichen +
        " characters gets no place: at that length a single wrong key can shift the " +
        "result by a whole percentage point, and that is just noise." +
        (mitKlammer
          ? " A number in brackets next to the keystrokes is the value with extra time - " +
            "it only applies where no read-aloud time was measured."
          : "") +
        "</p>" +
        // Die Regel seit 11.09.2026 (D4, `schreibprobe.ts`): Kein Häkchen der
        // Lehrkraft mehr - die App liest vor, wem sie auch beim Üben
        // vorliest. Der deutsche Absatz unten wurde am 19.09.2026 nachgezogen
        // (vorher nannte er noch das abgeschaffte Häkchen „Vorlesen bei
        // Prüfungen erlaubt").
        '<p style="color:#666;font-size:13px"><b>Read aloud:</b> In the ' + d.wort +
        " the app reads aloud to pupils who have switched on read aloud for themselves - " +
        "just as when practising. Only the time spent waiting for the voice is taken off " +
        "the time limit; anyone who keeps typing while the voice is speaking gets nothing " +
        "taken off.</p>" +
        KLEIN + "“Wobbly keys” are keys that came up at least three times in this " + d.wort +
        " and stayed below 90% accuracy - in brackets, the share of wrong keys. They say " +
        "something about this challenge, not about the pupil's overall progress.</p>" +
        openLineEn +
        KLEIN + "You're receiving this email because you started a " + d.wort +
        " for this class.</p>" +
        (d.fussHtml || "") +
        "</div>",
    };
  }

  if (fr) {
    // ★ E11c: vous. `d.wort` ist „Défi" (WORT_FR im Hook), männlich: « le Défi ».
    var openLineFr = d.appUrl
      ? '<p><a href="' + escLeer(d.appUrl) + '/meine-klasse?app=tippen">Aller à la classe</a></p>'
      : "";
    var dauer = Number(d.dauerMin);
    return {
      subject: d.wort + " - " + d.className + " (" + niveau + ")",
      html:
        '<div lang="fr">' +
        "<p>Bonjour" + (d.teacherName ? " " + escLeer(d.teacherName) : "") + ",</p>" +
        "<p>Le " + d.wort + " de votre classe <b>" + escLeer(d.className) + "</b> est " +
        (d.alleFertig ? "terminé - tous les élèves ont fini" : "terminé - le temps est écoulé") + ".</p>" +
        "<p>" +
        "Niveau de touches : <b>" + escLeer(niveau) + "</b> · " +
        "Texte " + ((Number(d.textNr) || 0) + 1) +
        (Number(d.startZeile) > 0 ? ", à partir de la ligne " + (Number(d.startZeile) + 1) : " sur 15") +
        " · " +
        "Temps " + d.dauerMin + (dauer === 1 ? " minute" : " minutes") + " · " +
        "Début " + escLeer(fmtZeit(d.startMs)) + zeitZusatz +
        (d.zuschlag > 0 ? " · Temps supplémentaire " + d.zuschlag + " %" : "") +
        (frei
          ? " · Type : Écriture libre - une erreur restante compte comme " + d.fehlerGewicht + " caractères"
          : "") +
        "</p>" +
        // Französisch richtet sich die Zahl nach der ERSTEN Zahl, und 0 und 1
        // sind Einzahl: « 1 élève sur 4 a participé », « 3 élèves sur 4 ont … ».
        "<p>" + d.angetreten + (d.angetreten < 2 ? " élève sur " : " élèves sur ") + d.anzahlKinder +
        (d.angetreten < 2 ? " a participé" : " ont participé") +
        (d.angetreten
          ? " - en moyenne <b>" + d.schnittA + " frappes par minute</b> avec " + escLeer(schnittG) + " de précision."
          : ".") +
        "</p>" +
        '<table style="border-collapse:collapse;font-size:14px">' +
        '<thead><tr style="text-align:left">' +
        th("Rang", true) + th("Nom") + th("Score", true) + th("Lecture à voix haute") +
        th("Frappes/min", true) + th("Précision", true) + th("Caractères", true) +
        th(frei ? "Erreurs restantes" : "Erreurs", true) + th("Touches instables") +
        "</tr></thead><tbody>" + rows + "</tbody></table>" +
        '<p style="color:#666;font-size:13px"><b>Comment le rang est calculé :</b> ' +
        "la précision compte plus que la vitesse - une touche manquée pèse autant que " +
        d.fehlerGewicht + " caractères, et une vitesse double ne compte pas double " +
        "(racine carrée, par rapport à " + d.bezugstempo + " frappes par minute). " +
        "<b>100 % revient au meilleur résultat de CE " + d.wort + "</b> - ce n'est pas une " +
        "note, mais un ordre. Les élèves qui ont tapé moins de " + d.mindZeichen +
        " caractères n'ont pas de rang : à cette longueur, une seule touche manquée déplace " +
        "le résultat d'un point entier, et ce n'est que du bruit." +
        (mitKlammer
          ? " Un nombre entre parenthèses à côté des frappes est la valeur avec temps " +
            "supplémentaire - elle ne s'applique que là où aucun temps de lecture n'a été mesuré."
          : "") +
        "</p>" +
        '<p style="color:#666;font-size:13px"><b>Lecture à voix haute :</b> Pendant le ' + d.wort +
        ", l'application lit à voix haute pour les élèves qui ont activé la lecture pour " +
        "eux-mêmes - comme à l'entrainement. Seul le temps d'attente de la voix est déduit " +
        "du temps ; si un élève continue à taper pendant que la voix parle, rien n'est déduit.</p>" +
        KLEIN + '"Touches instables" : les touches qui sont venues au moins trois fois dans ce ' +
        d.wort + " et sont restées sous 90 % de précision - entre parenthèses, la part " +
        "d'erreurs de frappe. Elles disent quelque chose sur CE " + d.wort + ", pas sur les " +
        "progrès de l'élève.</p>" +
        openLineFr +
        KLEIN + "Vous recevez cet e-mail parce que vous avez lancé un " + d.wort +
        " pour cette classe.</p>" +
        (d.fussHtml || "") +
        "</div>",
    };
  }

  if (es) {
    // ★ ES-M: usted. `d.wort` ist „Reto" (WORT_ES im Hook), männlich: « el Reto ».
    // Die Zahl der Teilnehmenden über „estudiante" (S10, ohne Geschlecht);
    // Einzahl nur bei genau 1.
    var openLineEs = d.appUrl
      ? '<p><a href="' + escLeer(d.appUrl) + '/meine-klasse?app=tippen">Ir a la clase</a></p>'
      : "";
    var dauerEs = Number(d.dauerMin);
    return {
      subject: d.wort + " - " + d.className + " (" + niveau + ")",
      html:
        '<div lang="es">' +
        "<p>Hola" + (d.teacherName ? ", " + escLeer(d.teacherName) : "") + ":</p>" +
        "<p>El " + d.wort + " de su clase <b>" + escLeer(d.className) + "</b> ha terminado - " +
        (d.alleFertig ? "todo el alumnado ha acabado" : "se acabó el tiempo") + ".</p>" +
        "<p>" +
        "Nivel de teclas: <b>" + escLeer(niveau) + "</b> · " +
        "Texto " + ((Number(d.textNr) || 0) + 1) +
        (Number(d.startZeile) > 0 ? ", desde la línea " + (Number(d.startZeile) + 1) : " de 15") +
        " · " +
        "Tiempo " + d.dauerMin + (dauerEs === 1 ? " minuto" : " minutos") + " · " +
        // ★ ES-TF2: `fmtZeit` schreibt die WIENER Wanduhr (siehe oben) - die
        // Zeitzone steht darum dabei; eine Klasse in Lateinamerika läse sonst
        // eine falsche Startzeit. ★ D2 (28.09.2026): mit gemerkter Zone steht
        // hier die Ortszeit der Lehrkraft, ohne Zusatz (`zeitZusatz` oben).
        "Inicio " + escLeer(fmtZeit(d.startMs)) + zeitZusatz +
        (d.zuschlag > 0 ? " · Tiempo extra " + d.zuschlag + " %" : "") +
        (frei
          ? " · Tipo: Escritura libre - un error que se queda en el texto cuenta como " +
            d.fehlerGewicht + " caracteres"
          : "") +
        "</p>" +
        "<p>Participaron " + d.angetreten + " de " + d.anzahlKinder +
        (d.anzahlKinder === 1 ? " estudiante" : " estudiantes") +
        (d.angetreten
          ? " - de media, <b>" + d.schnittA + " pulsaciones por minuto</b> con un " + escLeer(schnittG) +
            " de precisión."
          : ".") +
        "</p>" +
        '<table style="border-collapse:collapse;font-size:14px">' +
        '<thead><tr style="text-align:left">' +
        th("Puesto", true) + th("Nombre") + th("Puntuación", true) + th("Lectura en voz alta") +
        th("Pulsaciones por minuto", true) + th("Precisión", true) + th("Caracteres", true) +
        th(frei ? "Errores que quedan" : "Errores", true) + th("Teclas inseguras") +
        "</tr></thead><tbody>" + rows + "</tbody></table>" +
        '<p style="color:#666;font-size:13px"><b>Cómo se calcula el puesto:</b> ' +
        "la precisión cuenta más que la velocidad - una tecla equivocada pesa tanto como " +
        d.fehlerGewicht + " caracteres, y el doble de velocidad no cuenta el doble " +
        "(raíz cuadrada, con referencia a " + d.bezugstempo + " pulsaciones por minuto). " +
        "<b>El 100 % es el mejor resultado de ESTE " + d.wort + "</b> - no es una nota, " +
        "sino un orden. Quien escribió menos de " + d.mindZeichen +
        " caracteres no recibe puesto: con tan poco texto, una sola tecla equivocada mueve " +
        "el resultado un punto entero, y eso es solo ruido." +
        (mitKlammer
          ? " Un número entre paréntesis junto a las pulsaciones es el valor con tiempo " +
            "extra - solo se aplica donde no se midió tiempo de lectura en voz alta."
          : "") +
        "</p>" +
        '<p style="color:#666;font-size:13px"><b>Lectura en voz alta:</b> Durante el ' + d.wort +
        ", la aplicación lee en voz alta a cada estudiante que tiene activada su propia lectura " +
        "en voz alta - igual que al practicar. Solo se descuenta el tiempo de espera mientras " +
        "habla la voz; a quien sigue tecleando mientras la voz habla no se le descuenta nada.</p>" +
        KLEIN + '"Teclas inseguras" son las teclas que aparecieron al menos tres veces en este ' +
        d.wort + " y se quedaron por debajo del 90 % de precisión - entre paréntesis, el porcentaje " +
        "de pulsaciones equivocadas. Se refieren solo a este " + d.wort + ", no al progreso " +
        "general de cada estudiante.</p>" +
        openLineEs +
        KLEIN + "Recibe este correo porque inició un " + d.wort + " para esta clase.</p>" +
        (d.fussHtml || "") +
        "</div>",
    };
  }

  if (it) {
    // ★ O-IT: neutral (die Lehrkraft, nie „Lei"). `d.wort` ist „Sfida"
    // (WORT_IT im Hook), weiblich: « la Sfida ». Die Teilnehmenden als
    // „alunni" bzw. „persona" (Regel 2).
    var openLineIt = d.appUrl
      ? '<p><a href="' + escLeer(d.appUrl) + '/meine-klasse?app=tippen">Vai alla classe</a></p>'
      : "";
    var dauerIt = Number(d.dauerMin);
    return {
      subject: d.wort + " - " + d.className + " (" + niveau + ")",
      html:
        '<div lang="it">' +
        "<p>Buongiorno" + (d.teacherName ? " " + escLeer(d.teacherName) : "") + ",</p>" +
        "<p>La " + d.wort + " della classe <b>" + escLeer(d.className) + "</b> è finita - " +
        (d.alleFertig ? "tutti gli alunni hanno concluso" : "il tempo è scaduto") + ".</p>" +
        "<p>" +
        "Tasti usati: <b>" + escLeer(niveau) + "</b> · " +
        "Testo " + ((Number(d.textNr) || 0) + 1) +
        (Number(d.startZeile) > 0 ? ", dalla riga " + (Number(d.startZeile) + 1) : " di 15") +
        " · " +
        "Tempo " + d.dauerMin + (dauerIt === 1 ? " minuto" : " minuti") + " · " +
        "Inizio " + escLeer(fmtZeit(d.startMs)) + zeitZusatz +
        (d.zuschlag > 0 ? " · Tempo in più " + d.zuschlag + "%" : "") +
        (frei
          ? " · Tipo: Scrittura libera - un errore che resta nel testo conta come " +
            d.fehlerGewicht + " caratteri"
          : "") +
        "</p>" +
        "<p>Hanno partecipato " + d.angetreten + " su " +
        (d.anzahlKinder === 1 ? "1 persona" : d.anzahlKinder + " alunni") +
        (d.angetreten
          ? " - in media <b>" + d.schnittA + " battute al minuto</b>, precisione " + escLeer(schnittG) + "."
          : ".") +
        "</p>" +
        '<table style="border-collapse:collapse;font-size:14px">' +
        '<thead><tr style="text-align:left">' +
        th("Posto", true) + th("Nome") + th("Punteggio", true) + th("Lettura ad alta voce") +
        th("Battute al minuto", true) + th("Precisione", true) + th("Caratteri", true) +
        th(frei ? "Errori rimasti" : "Errori", true) + th("Tasti incerti") +
        "</tr></thead><tbody>" + rows + "</tbody></table>" +
        '<p style="color:#666;font-size:13px"><b>Come si calcola il posto:</b> ' +
        "la precisione conta più della velocità - un tasto sbagliato pesa quanto " +
        d.fehlerGewicht + " caratteri, e il doppio della velocità non conta il doppio " +
        "(radice quadrata, rispetto a " + d.bezugstempo + " battute al minuto). " +
        "<b>Il 100% è il miglior risultato di QUESTA " + d.wort + "</b> - non è un voto, " +
        "ma un ordine. Chi ha scritto meno di " + d.mindZeichen +
        " caratteri non riceve un posto: con così poco testo un solo tasto sbagliato sposta " +
        "il risultato di un punto intero, ed è solo rumore." +
        (mitKlammer
          ? " Un numero tra parentesi accanto alle battute è il valore con tempo in più - " +
            "vale solo dove non è stato misurato tempo di lettura ad alta voce."
          : "") +
        "</p>" +
        '<p style="color:#666;font-size:13px"><b>Lettura ad alta voce:</b> Durante la ' + d.wort +
        " il programma legge ad alta voce per chi ha attivato la propria lettura ad alta voce - " +
        "come durante l'esercizio. Si toglie solo il tempo di attesa mentre parla la voce; a chi " +
        "continua a scrivere mentre la voce parla non si toglie niente.</p>" +
        KLEIN + '"Tasti incerti" sono i tasti che sono comparsi almeno tre volte in questa ' +
        d.wort + " e sono rimasti sotto il 90% di precisione - tra parentesi, la quota di " +
        "battute sbagliate. Riguardano solo questa " + d.wort + ", non i progressi generali " +
        "di ogni persona.</p>" +
        openLineIt +
        KLEIN + "Questa email arriva perché per questa classe è stata avviata una " + d.wort + ".</p>" +
        (d.fussHtml || "") +
        "</div>",
    };
  }

  if (pl) {
    // ★ O-PL: ty an die Lehrkraft (Regel 1), Beschreibungen unpersönlich.
    // `d.wort` ist „Wyzwanie" (WORT_PL im Hook) - sächlich und gebeugt
    // („Wyzwania", „Wyzwaniu"), darum stehen die gebeugten Formen hier selbst;
    // gross wie ein Name (Glossar §2.3). Die Teilnehmenden als „osoby"
    // (Regel 2), Zahlen mit allen vier Formen (`plForm`, §2.10a).
    var openLinePl = d.appUrl
      ? '<p><a href="' + escLeer(d.appUrl) + '/meine-klasse?app=tippen">Przejdź do klasy</a></p>'
      : "";
    var dauerPl = Number(d.dauerMin);
    var znakiPl = function (n) {
      return plForm(Number(n), "# znak", "# znaki", "# znaków", "# znaku");
    };
    var uderzenPl = function (n) {
      return plForm(Number(n), "# uderzenie na minutę", "# uderzenia na minutę", "# uderzeń na minutę", "# uderzenia na minutę");
    };
    return {
      subject: d.wort + " - " + d.className + " (" + niveau + ")",
      html:
        '<div lang="pl">' +
        "<p>Dzień dobry,</p>" +
        "<p>Wyzwanie w klasie <b>" + escLeer(d.className) + "</b> dobiegło końca - " +
        (d.alleFertig ? "wszystkie osoby skończyły pisać" : "czas minął") + ".</p>" +
        "<p>" +
        "Używane klawisze: <b>" + escLeer(niveau) + "</b> · " +
        "Tekst " + ((Number(d.textNr) || 0) + 1) +
        (Number(d.startZeile) > 0 ? ", od wiersza " + (Number(d.startZeile) + 1) : " z 15") +
        " · " +
        "Czas: " + plForm(dauerPl, "# minuta", "# minuty", "# minut", "# minuty") + " · " +
        "Początek: " + escLeer(fmtZeit(d.startMs)) + zeitZusatz +
        (d.zuschlag > 0 ? " · Dodatkowy czas: " + d.zuschlag + "%" : "") +
        (frei
          ? " · Rodzaj: Swobodne pisanie - błąd, który zostaje w tekście, liczy się jak " +
            znakiPl(d.fehlerGewicht)
          : "") +
        "</p>" +
        "<p>Udział w Wyzwaniu: " + d.angetreten + " z " + d.anzahlKinder +
        (d.angetreten
          ? ". Średnie tempo: <b>" + uderzenPl(d.schnittA) + "</b>, dokładność: " + escLeer(schnittG) + "."
          : ".") +
        "</p>" +
        '<table style="border-collapse:collapse;font-size:14px">' +
        '<thead><tr style="text-align:left">' +
        th("Miejsce", true) + th("Imię") + th("Wynik", true) + th("Czytanie na głos") +
        th("Uderzenia/min", true) + th("Dokładność", true) + th("Znaki", true) +
        th(frei ? "Błędy pozostawione w tekście" : "Błędy", true) + th("Niepewne klawisze") +
        "</tr></thead><tbody>" + rows + "</tbody></table>" +
        '<p style="color:#666;font-size:13px"><b>Jak liczy się miejsce:</b> ' +
        "dokładność liczy się bardziej niż tempo - jedna pomyłka waży tyle co " +
        znakiPl(d.fehlerGewicht) + ", a dwa razy szybsze tempo nie liczy się podwójnie " +
        "(pierwiastek kwadratowy, punkt odniesienia: " + uderzenPl(d.bezugstempo) + "). " +
        "<b>100% to najlepszy wynik TEGO Wyzwania</b> - to nie jest ocena, tylko kolejność. " +
        "Miejsca nie dostaje nikt, kto napisze za mało (próg: " + znakiPl(d.mindZeichen) +
        "): przy tak krótkim tekście jedna pomyłka przesuwa wynik o cały punkt procentowy, " +
        "a to tylko szum." +
        (mitKlammer
          ? " Liczba w nawiasie obok uderzeń to wartość z dodatkowym czasem - obowiązuje tylko " +
            "tam, gdzie nie zmierzono czasu czytania na głos."
          : "") +
        "</p>" +
        '<p style="color:#666;font-size:13px"><b>Czytanie na głos:</b> Podczas Wyzwania program ' +
        "czyta na głos tym osobom, które mają włączone własne czytanie na głos - tak jak podczas " +
        "ćwiczeń. Od czasu Wyzwania odejmuje się tylko czas czekania na głos; osobom, które piszą " +
        "dalej, gdy głos mówi, nic się nie odejmuje.</p>" +
        KLEIN + "„Niepewne klawisze” to klawisze, które w tym Wyzwaniu pojawiły się co " +
        "najmniej trzy razy i miały dokładność poniżej 90% - w nawiasie udział pomyłek. Dotyczą " +
        "tylko tego Wyzwania, a nie ogólnych postępów danej osoby.</p>" +
        openLinePl +
        KLEIN + "Ta wiadomość przychodzi, bo w tej klasie uruchomiono Wyzwanie.</p>" +
        (d.fussHtml || "") +
        "</div>",
    };
  }

  if (tr) {
    // ★ O-TR: siz an die Lehrkraft (Regel 1), kein Ausrufezeichen. `d.wort` ist
    // „Yarışma" (WORT_TR im Hook) - eingesetzt nur OHNE Endung; wo das Wort
    // gebeugt wird („Yarışmada", „Yarışmayı"), steht es hier fest (Regel 6).
    // Klasse, Name und Zahl nach Doppelpunkt oder vor festem Wort; nach einer
    // Zahl Einzahl („12 öğrenci", „5 karakter"); „%95" (Regel 5); Tempo
    // „dakikada 142 vuruş" (§2.2); Rang = „Sıralama" (§2.3).
    var openLineTr = d.appUrl
      ? '<p><a href="' + escLeer(d.appUrl) + '/meine-klasse?app=tippen">Sınıfa git</a></p>'
      : "";
    return {
      subject: d.wort + " - " + d.className + " (" + niveau + ")",
      html:
        '<div lang="tr">' +
        "<p>Merhaba" + (d.teacherName ? " " + escLeer(d.teacherName) : "") + ",</p>" +
        "<p>Sınıf: <b>" + escLeer(d.className) + "</b>. " + d.wort + " " +
        (d.alleFertig ? "tamamlandı - tüm öğrenciler yazmayı bitirdi" : "sona erdi") + ".</p>" +
        "<p>" +
        "Kullanılan tuşlar: <b>" + escLeer(niveau) + "</b> · " +
        "Metin " + ((Number(d.textNr) || 0) + 1) +
        (Number(d.startZeile) > 0 ? ", satır " + (Number(d.startZeile) + 1) + " ve sonrası" : ", toplam 15") +
        " · " +
        "Yarışma süresi: " + d.dauerMin + " dakika · " +
        "Başlangıç: " + escLeer(fmtZeit(d.startMs)) + zeitZusatz +
        (d.zuschlag > 0 ? " · Ek süre: %" + d.zuschlag : "") +
        (frei
          ? " · Tür: Serbest yazma - metinde kalan her hata " + d.fehlerGewicht + " karakter değerindedir"
          : "") +
        "</p>" +
        "<p>Katılan öğrenci: " + d.angetreten + ", toplam " + d.anzahlKinder + "." +
        (d.angetreten
          ? " Ortalama hız: <b>dakikada " + d.schnittA + " vuruş</b>, doğruluk: " + escLeer(schnittG) + "."
          : "") +
        "</p>" +
        '<table style="border-collapse:collapse;font-size:14px">' +
        '<thead><tr style="text-align:left">' +
        th("Sıralama", true) + th("Ad") + th("Puan", true) + th("Sesli okuma") +
        th("Vuruş/dk", true) + th("Doğruluk", true) + th("Karakter", true) +
        th(frei ? "Metinde kalan hata" : "Hata", true) + th("Henüz oturmamış tuşlar") +
        "</tr></thead><tbody>" + rows + "</tbody></table>" +
        '<p style="color:#666;font-size:13px"><b>Sıralama nasıl belirlenir:</b> ' +
        "doğruluk hızdan daha çok sayılır - bir yanlış tuş " + d.fehlerGewicht + " karakter " +
        "değerindedir, iki kat hız ise iki kat sayılmaz (karekök; karşılaştırma ölçüsü: dakikada " +
        d.bezugstempo + " vuruş). " +
        "<b>%100, BU Yarışmadaki en iyi sonuçtur</b> - bu bir not değil, yalnızca bir sıralamadır. " +
        "Çok az yazan öğrenci sıralamaya girmez (alt sınır: " + d.mindZeichen + " karakter): bu kadar " +
        "kısa bir metinde tek bir yanlış tuş sonucu bir yüzde puan kaydırır, bu da yalnızca rastlantıdır." +
        (mitKlammer
          ? " Vuruş sayısının yanında parantez içindeki değer, ek süreyle hesaplanan değerdir - " +
            "yalnızca sesli okuma süresinin ölçülmediği yerlerde geçerlidir."
          : "") +
        "</p>" +
        '<p style="color:#666;font-size:13px"><b>Sesli okuma:</b> Yarışma sırasında program, sesli ' +
        "okumayı kendisi için açmış olan öğrencilere - alıştırmalarda olduğu gibi - sesli okur. " +
        "Yarışma süresinden yalnızca okuma sesini beklerken geçen süre düşülür; ses konuşurken " +
        "yazmaya devam eden öğrencilerden bir şey düşülmez.</p>" +
        KLEIN + "\"Henüz oturmamış tuşlar\", bu Yarışmada en az üç kez gelen ve doğruluğu %90 " +
        "sınırının altında kalan tuşlardır - parantez içinde yanlış tuş oranı. Yalnızca bu " +
        "Yarışmayı anlatır, öğrencinin genel ilerlemesini değil.</p>" +
        openLineTr +
        KLEIN + "Bu e-postayı, bu sınıfta bir Yarışma başlatıldığı için alıyorsunuz.</p>" +
        (d.fussHtml || "") +
        "</div>",
    };
  }

  if (cs) {
    // ★ O-CS: vy an die Lehrkraft (Regel 1), kein Ausrufezeichen, „Dobrý den,"
    // ohne Namen (kein Vokativ, Regel 12). `d.wort` ist „Výzva" (WORT_CS im
    // Hook) - eingesetzt nur im Nominativ; die gebeugten Formen („ve Výzvě",
    // „této Výzvy") stehen hier fest. Klasse mit Kopfwort („ve třídě 5A"),
    // Zahlen nach Doppelpunkt, „9 ze 12" über `zZeCs`, Mehrzahl über `csForm`;
    // die Zeilen mit Zahlen ohne Schlusspunkt (Falle 4). Tempo „úhozů/min"
    // (Regel 6), Rang = „pořadí" (§2.3), „95 %" mit U+00A0.
    var openLineCs = d.appUrl
      ? '<p><a href="' + escLeer(d.appUrl) + '/meine-klasse?app=tippen">Otevřít třídu</a></p>'
      : "";
    var znakyCs = function (n) {
      return csForm(Number(n), "# znak", "# znaky", "# znaku", "# znaků");
    };
    var uhozyCs = function (n) {
      return csForm(Number(n), "# úhoz za minutu", "# úhozy za minutu", "# úhozu za minutu", "# úhozů za minutu");
    };
    var anzahlCs = Number(d.anzahlKinder) || 0;
    return {
      subject: d.wort + " - " + d.className + " (" + niveau + ")",
      html:
        '<div lang="cs">' +
        "<p>Dobrý den,</p>" +
        "<p>" + d.wort + " ve třídě <b>" + escLeer(d.className) + "</b> skončila - " +
        (d.alleFertig ? "všichni žáci dopsali" : "čas vypršel") + ".</p>" +
        "<p>" +
        "Použité klávesy: <b>" + escLeer(niveau) + "</b> · " +
        "Text " + ((Number(d.textNr) || 0) + 1) +
        (Number(d.startZeile) > 0 ? ", od řádku " + (Number(d.startZeile) + 1) : "/15") +
        " · " +
        "Čas: " + d.dauerMin + " min · " +
        "Začátek: " + escLeer(fmtZeit(d.startMs)) + zeitZusatz +
        (d.zuschlag > 0 ? " · Čas navíc: " + d.zuschlag + "\u00a0%" : "") +
        (frei
          ? " · Druh: Volné psaní - chyba, která zůstane v textu, se počítá jako " + znakyCs(d.fehlerGewicht)
          : "") +
        "</p>" +
        "<p>Účast ve Výzvě: " + d.angetreten + " " + zZeCs(anzahlCs) + " " + anzahlCs +
        (d.angetreten
          ? "<br>Průměrná rychlost: <b>" + d.schnittA + " úhozů/min</b><br>Průměrná přesnost: " + escLeer(schnittG)
          : "") +
        "</p>" +
        '<table style="border-collapse:collapse;font-size:14px">' +
        '<thead><tr style="text-align:left">' +
        th("Pořadí", true) + th("Jméno") + th("Skóre", true) + th("Předčítání") +
        th("Úhozů/min", true) + th("Přesnost", true) + th("Znaky", true) +
        th(frei ? "Neopravené chyby" : "Chyby", true) + th("Nejisté klávesy") +
        "</tr></thead><tbody>" + rows + "</tbody></table>" +
        '<p style="color:#666;font-size:13px"><b>Jak se počítá pořadí:</b> ' +
        "přesnost má větší váhu než rychlost - jeden překlep váží tolik jako " +
        znakyCs(d.fehlerGewicht) + " a dvojnásobná rychlost se nepočítá dvojnásobně " +
        "(druhá odmocnina, vztažná hodnota: " + uhozyCs(d.bezugstempo) + "). " +
        "<b>100\u00a0% má nejlepší výsledek TÉTO Výzvy</b> - není to známka, jen pořadí. " +
        "Pořadí nedostane nikdo, kdo napíše příliš málo (hranice: " + znakyCs(d.mindZeichen) +
        "): u tak krátkého textu posune jeden překlep výsledek o celý procentní bod, a to je " +
        "jen šum." +
        (mitKlammer
          ? " Číslo v závorce vedle úhozů je hodnota s časem navíc - platí jen tam, kde se " +
            "neměřil čas předčítání."
          : "") +
        "</p>" +
        '<p style="color:#666;font-size:13px"><b>Předčítání:</b> Během Výzvy aplikace předčítá ' +
        "těm žákům, kteří mají předčítání zapnuté - stejně jako při cvičení. Od času Výzvy se " +
        "odečítá jen čekání na hlas; kdo píše dál, zatímco hlas mluví, tomu se nic neodečítá.</p>" +
        KLEIN + "„Nejisté klávesy“ jsou klávesy, které se v této Výzvě objevily aspoň třikrát a " +
        "jejich přesnost zůstala pod 90\u00a0% - v závorce podíl překlepů. Týkají se jen této " +
        "Výzvy, ne celkového pokroku žáků.</p>" +
        openLineCs +
        KLEIN + "Tento e-mail přichází, protože v této třídě proběhla Výzva.</p>" +
        (d.fussHtml || "") +
        "</div>",
    };
  }

  // --- Deutsch: wörtlich aus tt_schreibprobe_mail.pb.js (Stand vor EN9) ---
  var openLine = d.appUrl
    ? '<p><a href="' + escLeer(d.appUrl) + '/meine-klasse?app=tippen">Zur Klasse</a></p>'
    : "";
  var WORT = d.wort;
  return {
    subject: WORT + " - " + d.className + " (" + niveau + ")",
    html:
      "<p>Guten Tag" + (d.teacherName ? " " + escLeer(d.teacherName) : "") + ",</p>" +
      "<p>die " + WORT + " Ihrer Klasse <b>" + escLeer(d.className) + "</b> ist " +
      (d.alleFertig ? "geschrieben - alle Kinder sind fertig" : "vorbei") + ".</p>" +
      "<p>" +
      "Niveau: <b>" + escLeer(niveau) + "</b> · " +
      "Text " + ((Number(d.textNr) || 0) + 1) +
      (Number(d.startZeile) > 0 ? ", ab Zeile " + (Number(d.startZeile) + 1) : " von 15") +
      " · " +
      "Prüfungszeit " + d.dauerMin + " Minuten · " +
      "Start " + escLeer(fmtZeit(d.startMs)) + zeitZusatz +
      (d.zuschlag > 0 ? " · Zeitzuschlag " + d.zuschlag + " %" : "") +
      (frei
        ? " · Art: Freies Schreiben - ein stehender Fehler zählt wie " + d.fehlerGewicht + " Zeichen"
        : "") +
      "</p>" +
      "<p>" + d.angetreten + " von " + d.anzahlKinder + " Kindern haben geschrieben" +
      (d.angetreten
        ? " - im Schnitt <b>" + d.schnittA + " Anschläge je Minute</b> bei " + escLeer(schnittG) + " Treffsicherheit."
        : ".") +
      "</p>" +
      '<table style="border-collapse:collapse;font-size:14px">' +
      '<thead><tr style="text-align:left">' +
      '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Rang</th>' +
      '<th style="padding:6px 8px;border-bottom:2px solid #ccc">Name</th>' +
      '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Leistungswert</th>' +
      '<th style="padding:6px 8px;border-bottom:2px solid #ccc">Vorlesen</th>' +
      '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Anschläge/min</th>' +
      '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Treffsicherheit</th>' +
      '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">Zeichen</th>' +
      '<th style="padding:6px 8px;border-bottom:2px solid #ccc;text-align:right">' +
      (frei ? "Stehengebliebene Fehler" : "Fehler") + "</th>" +
      '<th style="padding:6px 8px;border-bottom:2px solid #ccc">Wacklige Tasten</th>' +
      "</tr></thead><tbody>" + rows + "</tbody></table>" +
      '<p style="color:#666;font-size:13px"><b>Wie der Rang zustande kommt:</b> ' +
      "Gewertet wird Treffsicherheit VOR Tempo - ein Fehlgriff wiegt so viel wie " +
      d.fehlerGewicht + " Zeichen, und doppeltes Tempo zaehlt nicht doppelt " +
      "(Wurzel, Bezug " + d.bezugstempo + " Anschlaege je Minute). " +
      "<b>100 % hat das beste Ergebnis DIESER Runde</b> - das ist keine Note, " +
      "sondern eine Reihenfolge. Wer unter " + d.mindZeichen +
      " Zeichen geschrieben hat, bekommt keinen Rang: Dort entscheidet ein " +
      "einzelner Fehlgriff ueber einen Prozentpunkt, und das ist Rauschen." +
      // Die Klammer gibt es nur bei alten Runden mit Zeitzuschlag (bis 10.09.2026).
      (mitKlammer
        ? " Steht neben den Anschlaegen eine Zahl in Klammern, ist das der Wert mit " +
          "Zeitzuschlag - er greift nur, wo keine Vorlesezeit gemessen wurde."
        : "") +
      "</p>" +
      '<p style="color:#666;font-size:13px"><b>Vorlesen:</b> In der ' + WORT +
      " liest die App den Kindern vor, die ihr eigenes Vorlesen eingeschaltet " +
      "haben - genau wie beim Üben. Von der Prüfungszeit wird nur die Wartezeit " +
      "auf die Stimme abgezogen; wer weitertippt, während die Stimme spricht, " +
      "dem wird nichts abgezogen.</p>" +
      '<p style="color:#666;font-size:12px">„Wacklige Tasten" sind die Tasten, ' +
      "die in dieser " + WORT + " mindestens dreimal dran waren und dabei unter " +
      "90 % Treffsicherheit blieben - in Klammern der Anteil der Fehlgriffe. " +
      "Sie sagen etwas über DIESE Probe, nicht über den Lernstand.</p>" +
      openLine +
      '<p style="color:#666;font-size:12px">Sie erhalten diese Mail, weil Sie ' +
      "für diese Klasse eine " + WORT + " gestartet haben.</p>" +
      (d.fussHtml || ""),
  };
}

// ── 6. Die Konto-Mails englisch (Passwort, Bestätigung, Adresswechsel) ─────
//
// Die DEUTSCHEN Fassungen sind PocketBases Mail-Vorlagen der Sammlungen
// `tt_teachers`/`tt_pupils` (setup.mjs, „Mail-Templates"). PocketBase kennt je
// Sammlung nur EINE Vorlage - darum ersetzt `tt_mail_sprache.pb.js` Betreff
// und Text kurz vor dem Versand, wenn das Konto englisch ist. Den Link mit
// dem Token nimmt es aus der fertigen deutschen Mail (`linkAus`) - so bleibt
// er Zeichen für Zeichen derselbe.
//
// `art`: "passwort" | "bestaetigung" | "adresse"; `sammlung`: "tt_teachers"
// (Lehrkraft) | "tt_pupils" (selbstlernend). `null`, wenn es die Kombination
// nicht gibt (dann bleibt die deutsche Mail).

/** Der erste Link einer fertigen Mail (`href`), `&amp;` wieder als `&`. */
function linkAus(html) {
  var m = /href="([^"]+)"/.exec(String(html || ""));
  return m ? m[1].replace(/&amp;/g, "&") : "";
}

var KONTO_MAILS_EN = {
  tt_teachers: {
    passwort: {
      subject: "Reset your password for the Sensorik learning apps",
      vor: "Here's how to choose a new password for your teacher account:",
      linkWort: "Choose a new password",
      nach: "",
      klein: "The link is valid for 4 weeks. If you didn't ask for this, you can simply ignore this email.",
    },
    bestaetigung: {
      subject: "Please confirm your email address (Sensorik)",
      vor: "Please confirm that this email address belongs to you:",
      linkWort: "Confirm email address",
      nach:
        "Only then can we reach you - for example when you reset your password, or " +
        "with the weekly report for your class.",
      klein: "If you didn't sign up, you can ignore this email.",
    },
    adresse: {
      subject: "Confirm your new email address (Sensorik)",
      vor: "You'd like to switch your teacher account to this address. Confirm the change here:",
      linkWort: "Confirm the change of address",
      nach: "",
      klein:
        "For security, you'll be asked for your password. If you didn't ask for this, " +
        "do nothing - then everything stays as it is.",
    },
  },
  tt_pupils: {
    passwort: {
      subject: "Reset the password for your Sensorik account",
      vor: "Here's how to choose a new password:",
      linkWort: "Choose a new password",
      nach: "",
      klein: "The link is valid for 4 weeks. If you didn't ask for this, you can ignore this email.",
    },
    bestaetigung: {
      subject: "Please confirm your email address (Sensorik)",
      vor: "Please confirm that this email address belongs to you:",
      linkWort: "Confirm email address",
      nach: "After that you'll get your weekly report on Mondays - but only in weeks when you've practised.",
      klein: "You can practise without confirming, too. If you didn't sign up, just ignore this email.",
    },
    adresse: {
      subject: "Confirm your new email address (Sensorik)",
      vor: "You'd like to switch your Sensorik account to this address. Confirm the change here:",
      linkWort: "Confirm the change of address",
      nach: "",
      klein:
        "For security, you'll be asked for your password. If you didn't ask for this, " +
        "do nothing - then everything stays as it is.",
    },
  },
};

function kontoMailEn(art, sammlung, link) {
  var t = KONTO_MAILS_EN[sammlung] && KONTO_MAILS_EN[sammlung][art];
  if (!t || !link) return null;
  return {
    subject: t.subject,
    html:
      '<div lang="en">' +
      "<p>Hello,</p>" +
      "<p>" + t.vor + "</p>" +
      '<p><a href="' + esc(link) + '">' + t.linkWort + "</a></p>" +
      (t.nach ? "<p>" + t.nach + "</p>" : "") +
      KLEIN + t.klein + "</p>" +
      "</div>",
  };
}

// ★ E11c (26.09.2026): dieselben drei Konto-Mails französisch - Lehrkraft
// „vous", selbstlernendes Konto „tu".
var KONTO_MAILS_FR = {
  tt_teachers: {
    passwort: {
      subject: "Réinitialiser votre mot de passe pour les applications Sensorik",
      vor: "Voici comment choisir un nouveau mot de passe pour votre compte enseignant :",
      linkWort: "Choisir un nouveau mot de passe",
      nach: "",
      klein:
        "Le lien est valable 4 semaines. Si vous n'avez rien demandé, vous pouvez simplement " +
        "ignorer cet e-mail.",
    },
    bestaetigung: {
      subject: "Veuillez confirmer votre adresse e-mail (Sensorik)",
      vor: "Veuillez confirmer que cette adresse e-mail est bien la vôtre :",
      linkWort: "Confirmer l'adresse e-mail",
      nach:
        "C'est seulement ensuite que nous pouvons vous joindre - par exemple pour " +
        "réinitialiser votre mot de passe ou pour le bilan hebdomadaire de votre classe.",
      klein: "Si cette inscription ne vient pas de vous, vous pouvez ignorer cet e-mail.",
    },
    adresse: {
      subject: "Confirmez votre nouvelle adresse e-mail (Sensorik)",
      vor: "Vous souhaitez passer votre compte enseignant à cette adresse. Confirmez le changement ici :",
      linkWort: "Confirmer le changement d'adresse",
      nach: "",
      klein:
        "Par sécurité, votre mot de passe vous sera demandé. Si vous n'avez rien demandé, " +
        "ne faites rien - tout reste alors comme avant.",
    },
  },
  tt_pupils: {
    passwort: {
      subject: "Réinitialiser le mot de passe de ton compte Sensorik",
      vor: "Voici comment choisir un nouveau mot de passe :",
      linkWort: "Choisir un nouveau mot de passe",
      nach: "",
      klein: "Le lien est valable 4 semaines. Si tu n'as rien demandé, tu peux ignorer cet e-mail.",
    },
    bestaetigung: {
      subject: "Confirme ton adresse e-mail (Sensorik)",
      vor: "Confirme que cette adresse e-mail est bien la tienne :",
      linkWort: "Confirmer l'adresse e-mail",
      nach:
        "Ensuite, tu recevras ton bilan de la semaine le lundi - mais seulement les semaines " +
        "avec de l'entrainement.",
      klein:
        "Tu peux aussi t'entrainer sans confirmer. Si cette inscription ne vient pas de toi, " +
        "ignore simplement cet e-mail.",
    },
    adresse: {
      subject: "Confirme ta nouvelle adresse e-mail (Sensorik)",
      vor: "Tu veux passer ton compte Sensorik à cette adresse. Confirme le changement ici :",
      linkWort: "Confirmer le changement d'adresse",
      nach: "",
      klein:
        "Par sécurité, ton mot de passe te sera demandé. Si tu n'as rien demandé, ne fais " +
        "rien - tout reste alors comme avant.",
    },
  },
};

function kontoMailFr(art, sammlung, link) {
  var t = KONTO_MAILS_FR[sammlung] && KONTO_MAILS_FR[sammlung][art];
  if (!t || !link) return null;
  return {
    subject: t.subject,
    html:
      '<div lang="fr">' +
      "<p>Bonjour,</p>" +
      "<p>" + t.vor + "</p>" +
      '<p><a href="' + esc(link) + '">' + t.linkWort + "</a></p>" +
      (t.nach ? "<p>" + t.nach + "</p>" : "") +
      KLEIN + t.klein + "</p>" +
      "</div>",
  };
}

// ★ ES-M (27.09.2026): dieselben drei Konto-Mails spanisch - Lehrkraft
// „usted", selbstlernendes Konto „tú". *Restablecer la contraseña*,
// *correo electrónico*, *enlace* (nie *clic*).
var KONTO_MAILS_ES = {
  tt_teachers: {
    passwort: {
      subject: "Restablecer su contraseña de los programas de aprendizaje Sensorik",
      vor: "Así puede elegir una contraseña nueva para su cuenta de docente:",
      linkWort: "Elegir una contraseña nueva",
      nach: "",
      klein: "El enlace es válido durante 4 semanas. Si no lo ha pedido, puede ignorar este correo.",
    },
    bestaetigung: {
      subject: "Confirme su correo electrónico (Sensorik)",
      vor: "Confirme que este correo electrónico es suyo:",
      linkWort: "Confirmar el correo electrónico",
      nach:
        "Solo así podemos ponernos en contacto con usted - por ejemplo, para restablecer " +
        "la contraseña o con el resumen semanal de su clase.",
      klein: "Si no se ha registrado usted, puede ignorar este correo.",
    },
    adresse: {
      subject: "Confirme su nuevo correo electrónico (Sensorik)",
      vor:
        "Ha solicitado cambiar el correo electrónico de su cuenta de docente por esta dirección. " +
        "Confírmelo aquí:",
      linkWort: "Confirmar el cambio de dirección",
      nach: "",
      klein:
        "Por seguridad, se le pedirá la contraseña. Si no lo ha pedido, no haga nada - " +
        "así todo sigue como está.",
    },
  },
  tt_pupils: {
    passwort: {
      subject: "Restablecer la contraseña de tu cuenta de Sensorik",
      vor: "Así puedes elegir una contraseña nueva:",
      linkWort: "Elegir una contraseña nueva",
      nach: "",
      klein: "El enlace es válido durante 4 semanas. Si no lo has pedido, puedes ignorar este correo.",
    },
    bestaetigung: {
      subject: "Confirma tu correo electrónico (Sensorik)",
      vor: "Confirma que este correo electrónico es tuyo:",
      linkWort: "Confirmar el correo electrónico",
      nach: "Después recibirás tu resumen semanal los lunes - pero solo en las semanas en que hayas practicado.",
      klein:
        "También puedes practicar sin confirmar. Si no te has registrado, ignora este correo.",
    },
    adresse: {
      subject: "Confirma tu nuevo correo electrónico (Sensorik)",
      vor: "Has pedido cambiar el correo electrónico de tu cuenta de Sensorik por esta dirección. Confírmalo aquí:",
      linkWort: "Confirmar el cambio de dirección",
      nach: "",
      klein:
        "Por seguridad, se te pedirá la contraseña. Si no lo has pedido, no hagas nada - " +
        "así todo sigue como está.",
    },
  },
};

function kontoMailEs(art, sammlung, link) {
  var t = KONTO_MAILS_ES[sammlung] && KONTO_MAILS_ES[sammlung][art];
  if (!t || !link) return null;
  return {
    subject: t.subject,
    html:
      '<div lang="es">' +
      "<p>Hola:</p>" +
      "<p>" + t.vor + "</p>" +
      '<p><a href="' + esc(link) + '">' + t.linkWort + "</a></p>" +
      (t.nach ? "<p>" + t.nach + "</p>" : "") +
      KLEIN + t.klein + "</p>" +
      "</div>",
  };
}

// ★ O-IT (02.10.2026): dieselben drei Konto-Mails italienisch - Lehrkraft
// neutral (Infinitiv, nie „Lei"), selbstlernendes Konto „tu". *Reimpostare la
// password*, *indirizzo email*, *link* (nie *clicca*).
var KONTO_MAILS_IT = {
  tt_teachers: {
    passwort: {
      subject: "Reimpostare la password dei programmi di apprendimento Sensorik",
      vor: "Ecco come scegliere una password nuova per l'account da insegnante:",
      linkWort: "Scegli una password nuova",
      nach: "",
      klein: "Il link vale 4 settimane. Se non è stato richiesto, basta ignorare questa email.",
    },
    bestaetigung: {
      subject: "Confermare l'indirizzo email (Sensorik)",
      vor: "Confermare che questo indirizzo email è quello giusto:",
      linkWort: "Conferma l'indirizzo email",
      nach:
        "Solo così possiamo mandare email - per esempio per reimpostare la password o con il " +
        "resoconto settimanale della classe.",
      klein: "Se la registrazione non è stata fatta da chi legge, basta ignorare questa email.",
    },
    adresse: {
      subject: "Confermare il nuovo indirizzo email (Sensorik)",
      vor: "È stato chiesto di passare l'account da insegnante a questo indirizzo. Confermare il cambio qui:",
      linkWort: "Conferma il cambio di indirizzo",
      nach: "",
      klein:
        "Per sicurezza verrà chiesta la password. Se non è stato richiesto, non fare niente - " +
        "così tutto resta com'è.",
    },
  },
  tt_pupils: {
    passwort: {
      subject: "Reimposta la password del tuo account Sensorik",
      vor: "Ecco come scegliere una password nuova:",
      linkWort: "Scegli una password nuova",
      nach: "",
      klein: "Il link vale 4 settimane. Se non l'hai chiesto tu, puoi ignorare questa email.",
    },
    bestaetigung: {
      subject: "Conferma il tuo indirizzo email (Sensorik)",
      vor: "Conferma che questo indirizzo email è tuo:",
      linkWort: "Conferma l'indirizzo email",
      nach: "Poi riceverai il tuo resoconto settimanale il lunedì - ma solo nelle settimane in cui hai fatto esercizio.",
      klein: "Puoi esercitarti anche senza confermare. Se la registrazione non l'hai fatta tu, ignora questa email.",
    },
    adresse: {
      subject: "Conferma il tuo nuovo indirizzo email (Sensorik)",
      vor: "Hai chiesto di passare il tuo account Sensorik a questo indirizzo. Conferma il cambio qui:",
      linkWort: "Conferma il cambio di indirizzo",
      nach: "",
      klein:
        "Per sicurezza ti verrà chiesta la password. Se non l'hai chiesto tu, non fare niente - " +
        "così tutto resta com'è.",
    },
  },
};

function kontoMailIt(art, sammlung, link) {
  var t = KONTO_MAILS_IT[sammlung] && KONTO_MAILS_IT[sammlung][art];
  if (!t || !link) return null;
  return {
    subject: t.subject,
    html:
      '<div lang="it">' +
      "<p>" + (sammlung === "tt_pupils" ? "Ciao," : "Buongiorno,") + "</p>" +
      "<p>" + t.vor + "</p>" +
      '<p><a href="' + esc(link) + '">' + t.linkWort + "</a></p>" +
      (t.nach ? "<p>" + t.nach + "</p>" : "") +
      KLEIN + t.klein + "</p>" +
      "</div>",
  };
}

// ★ O-PL (02.10.2026): dieselben drei Konto-Mails polnisch - ty für alle
// (Lehrkraft UND selbstlernendes Konto, Regel 1), Ty/Cię/Ciebie/Twój gross
// (Mail an eine Person), „Dzień dobry,". *Ustaw nowe hasło*, *adres e-mail*,
// *link* - kein „kliknij", sondern „otwórz link" (Falle 7). Kein Geschlecht:
// „Jeśli wiadomość nie jest przeznaczona dla Ciebie" statt „Jeśli nie
// prosiłeś/prosiłaś" (Regel 2).
var KONTO_MAILS_PL = {
  tt_teachers: {
    passwort: {
      subject: "Ustaw nowe hasło - programy do nauki Sensorik",
      vor: "Otwórz ten link, aby ustawić nowe hasło do konta dla nauczycieli:",
      linkWort: "Ustaw nowe hasło",
      nach: "",
      klein:
        "Link jest ważny 4 tygodnie. Jeśli wiadomość nie jest przeznaczona dla Ciebie, " +
        "wystarczy ją zignorować.",
    },
    bestaetigung: {
      subject: "Potwierdź adres e-mail (Sensorik)",
      vor: "Potwierdź, że ten adres e-mail należy do Ciebie:",
      linkWort: "Potwierdź adres e-mail",
      nach:
        "Dopiero wtedy możemy wysyłać wiadomości - na przykład link do nowego hasła albo " +
        "podsumowanie tygodnia dla klasy.",
      klein: "Jeśli wiadomość nie jest przeznaczona dla Ciebie, wystarczy ją zignorować.",
    },
    adresse: {
      subject: "Potwierdź nowy adres e-mail (Sensorik)",
      vor: "Konto dla nauczycieli ma zostać przeniesione na ten adres. Potwierdź zmianę tutaj:",
      linkWort: "Potwierdź zmianę adresu",
      nach: "",
      klein:
        "Ze względów bezpieczeństwa pojawi się prośba o hasło. Jeśli wiadomość nie jest " +
        "przeznaczona dla Ciebie, nic nie rób - wtedy wszystko zostanie bez zmian.",
    },
  },
  tt_pupils: {
    passwort: {
      subject: "Ustaw nowe hasło do swojego konta Sensorik",
      vor: "Otwórz ten link, aby ustawić nowe hasło:",
      linkWort: "Ustaw nowe hasło",
      nach: "",
      klein:
        "Link jest ważny 4 tygodnie. Jeśli wiadomość nie jest przeznaczona dla Ciebie, " +
        "możesz ją zignorować.",
    },
    bestaetigung: {
      subject: "Potwierdź swój adres e-mail (Sensorik)",
      vor: "Potwierdź, że ten adres e-mail należy do Ciebie:",
      linkWort: "Potwierdź adres e-mail",
      // „w każdy poniedziałek" - Präposition + Akkusativ wie in WOCHENTAG_AM_PL (tt_wochenziel_lib).
      nach:
        "Potem w każdy poniedziałek dostaniesz podsumowanie tygodnia - ale tylko za tygodnie " +
        "z ćwiczeniami.",
      klein:
        "Możesz ćwiczyć także bez potwierdzenia. Jeśli wiadomość nie jest przeznaczona dla " +
        "Ciebie, zignoruj ją.",
    },
    adresse: {
      subject: "Potwierdź swój nowy adres e-mail (Sensorik)",
      vor: "Twoje konto Sensorik ma zostać przeniesione na ten adres. Potwierdź zmianę tutaj:",
      linkWort: "Potwierdź zmianę adresu",
      nach: "",
      klein:
        "Ze względów bezpieczeństwa pojawi się prośba o Twoje hasło. Jeśli wiadomość nie jest " +
        "przeznaczona dla Ciebie, nic nie rób - wtedy wszystko zostanie bez zmian.",
    },
  },
};

function kontoMailPl(art, sammlung, link) {
  var t = KONTO_MAILS_PL[sammlung] && KONTO_MAILS_PL[sammlung][art];
  if (!t || !link) return null;
  return {
    subject: t.subject,
    html:
      '<div lang="pl">' +
      "<p>Dzień dobry,</p>" +
      "<p>" + t.vor + "</p>" +
      '<p><a href="' + esc(link) + '">' + t.linkWort + "</a></p>" +
      (t.nach ? "<p>" + t.nach + "</p>" : "") +
      KLEIN + t.klein + "</p>" +
      "</div>",
  };
}

// ★ O-TR (02.10.2026): dieselben drei Konto-Mails türkisch - Lehrkraft siz mit
// -(y)In (nie „-InIz"), selbstlernendes Konto sen (Glossar Regel 1),
// „Merhaba,". *Yeni şifre belirle*, *e-posta adresi*, *bağlantı* - kein
// „tıklayın", sondern „bağlantıyı açın" (Regel 8). Knopf/Link als blosser
// Stamm („Yeni şifre belirle") in beiden Welten.
var KONTO_MAILS_TR = {
  tt_teachers: {
    passwort: {
      subject: "Yeni şifre belirleyin - Sensorik öğrenme programları",
      vor: "Öğretmen hesabınız için yeni bir şifre belirlemek üzere bu bağlantıyı açın:",
      linkWort: "Yeni şifre belirle",
      nach: "",
      klein:
        "Bağlantı 4 hafta geçerlidir. Bu isteği siz yapmadıysanız bu e-postayı dikkate " +
        "almayabilirsiniz.",
    },
    bestaetigung: {
      subject: "E-posta adresinizi onaylayın (Sensorik)",
      vor: "Bu e-posta adresinin size ait olduğunu onaylayın:",
      linkWort: "E-posta adresini onayla",
      nach:
        "Ancak bundan sonra size e-posta gönderebiliriz - örneğin yeni şifre bağlantısı veya " +
        "sınıfın haftalık raporu.",
      klein: "Bu isteği siz yapmadıysanız bu e-postayı dikkate almayabilirsiniz.",
    },
    adresse: {
      subject: "Yeni e-posta adresinizi onaylayın (Sensorik)",
      vor: "Öğretmen hesabınız bu adrese taşınacak. Değişikliği buradan onaylayın:",
      linkWort: "Adres değişikliğini onayla",
      nach: "",
      klein:
        "Güvenlik için şifreniz sorulacak. Bu isteği siz yapmadıysanız hiçbir şey yapmayın - " +
        "o zaman her şey olduğu gibi kalır.",
    },
  },
  tt_pupils: {
    passwort: {
      subject: "Sensorik hesabın için yeni şifre belirle",
      vor: "Yeni bir şifre belirlemek için bu bağlantıyı aç:",
      linkWort: "Yeni şifre belirle",
      nach: "",
      klein:
        "Bağlantı 4 hafta geçerlidir. Bu isteği sen yapmadıysan bu e-postayı dikkate alma.",
    },
    bestaetigung: {
      subject: "E-posta adresini onayla (Sensorik)",
      vor: "Bu e-posta adresinin sana ait olduğunu onayla:",
      linkWort: "E-posta adresini onayla",
      // „her pazartesi" klein - kein bestimmtes Datum (Glossar Regel 9).
      nach:
        "Sonra her pazartesi haftalık raporunu alırsın - ama yalnızca çalıştığın haftalar için.",
      klein:
        "Onaylamadan da çalışabilirsin. Bu isteği sen yapmadıysan bu e-postayı dikkate alma.",
    },
    adresse: {
      subject: "Yeni e-posta adresini onayla (Sensorik)",
      vor: "Sensorik hesabın bu adrese taşınacak. Değişikliği buradan onayla:",
      linkWort: "Adres değişikliğini onayla",
      nach: "",
      klein:
        "Güvenlik için şifren sorulacak. Bu isteği sen yapmadıysan hiçbir şey yapma - o zaman " +
        "her şey olduğu gibi kalır.",
    },
  },
};

function kontoMailTr(art, sammlung, link) {
  var t = KONTO_MAILS_TR[sammlung] && KONTO_MAILS_TR[sammlung][art];
  if (!t || !link) return null;
  return {
    subject: t.subject,
    html:
      '<div lang="tr">' +
      "<p>Merhaba,</p>" +
      "<p>" + t.vor + "</p>" +
      '<p><a href="' + esc(link) + '">' + t.linkWort + "</a></p>" +
      (t.nach ? "<p>" + t.nach + "</p>" : "") +
      KLEIN + t.klein + "</p>" +
      "</div>",
  };
}

// ★ O-CS (03.10.2026): dieselben drei Konto-Mails tschechisch - Lehrkraft vy
// in der Mehrzahlform („Dobrý den,"), selbstlernendes Konto ty („Ahoj,"),
// Glossar Regel 1. *Nastavit nové heslo*, *e-mailová adresa*, *odkaz* - kein
// „klikněte", sondern „otevřete odkaz" (Regel 8). Kein Geschlecht: „Pokud tento
// e-mail není určen vám" statt „Pokud jste o to nežádali", „se zobrazí dotaz na
// heslo" statt „budete požádáni" (Regel 2). Knopf/Link im Infinitiv (Regel 10).
var KONTO_MAILS_CS = {
  tt_teachers: {
    passwort: {
      subject: "Nastavení nového hesla - výukové programy Sensorik",
      vor: "Nové heslo k účtu pro vyučující nastavíte přes tento odkaz:",
      linkWort: "Nastavit nové heslo",
      nach: "",
      klein: "Odkaz platí 4 týdny. Pokud tento e-mail není určen vám, můžete ho ignorovat.",
    },
    bestaetigung: {
      subject: "Potvrďte e-mailovou adresu (Sensorik)",
      vor: "Potvrďte prosím, že tato e-mailová adresa patří vám:",
      linkWort: "Potvrdit e-mailovou adresu",
      nach:
        "Teprve potom vám můžeme posílat e-maily - například odkaz na nové heslo nebo " +
        "týdenní přehled třídy.",
      klein: "Pokud tento e-mail není určen vám, můžete ho ignorovat.",
    },
    adresse: {
      subject: "Potvrďte novou e-mailovou adresu (Sensorik)",
      vor: "Účet pro vyučující se má přesunout na tuto adresu. Změnu potvrďte zde:",
      linkWort: "Potvrdit změnu adresy",
      nach: "",
      klein:
        "Z bezpečnostních důvodů se zobrazí dotaz na heslo. Pokud tento e-mail není určen " +
        "vám, nic nedělejte - pak všechno zůstane, jak je.",
    },
  },
  tt_pupils: {
    passwort: {
      subject: "Nové heslo k tvému účtu Sensorik",
      vor: "Nové heslo nastavíš přes tento odkaz:",
      linkWort: "Nastavit nové heslo",
      nach: "",
      klein: "Odkaz platí 4 týdny. Pokud tento e-mail není určen tobě, můžeš ho ignorovat.",
    },
    bestaetigung: {
      subject: "Potvrď svou e-mailovou adresu (Sensorik)",
      vor: "Potvrď, že tato e-mailová adresa patří tobě:",
      linkWort: "Potvrdit e-mailovou adresu",
      // „každé pondělí" klein - kein bestimmtes Datum (Glossar Regel 9).
      nach: "Potom ti každé pondělí přijde týdenní přehled - ale jen za týdny, kdy cvičíš.",
      klein: "Cvičit můžeš i bez potvrzení. Pokud tento e-mail není určen tobě, nevšímej si ho.",
    },
    adresse: {
      subject: "Potvrď novou e-mailovou adresu (Sensorik)",
      vor: "Tvůj účet Sensorik se má přesunout na tuto adresu. Změnu potvrď zde:",
      linkWort: "Potvrdit změnu adresy",
      nach: "",
      klein:
        "Z bezpečnostních důvodů se zobrazí dotaz na heslo. Pokud tento e-mail není určen " +
        "tobě, nic nedělej - pak všechno zůstane, jak je.",
    },
  },
};

function kontoMailCs(art, sammlung, link) {
  var t = KONTO_MAILS_CS[sammlung] && KONTO_MAILS_CS[sammlung][art];
  if (!t || !link) return null;
  return {
    subject: t.subject,
    html:
      '<div lang="cs">' +
      "<p>" + (sammlung === "tt_pupils" ? "Ahoj," : "Dobrý den,") + "</p>" +
      "<p>" + t.vor + "</p>" +
      '<p><a href="' + esc(link) + '">' + t.linkWort + "</a></p>" +
      (t.nach ? "<p>" + t.nach + "</p>" : "") +
      KLEIN + t.klein + "</p>" +
      "</div>",
  };
}

/**
 * Die Konto-Mail je Sprache - „de" fehlt mit Absicht (dann bleibt PocketBases
 * deutsche Vorlage). ★ ES-M: als Tabelle statt einer Weiche je Sprache.
 */
var KONTO_MAIL_JE_SPRACHE = {
  en: kontoMailEn,
  fr: kontoMailFr,
  es: kontoMailEs,
  it: kontoMailIt,
  pl: kontoMailPl,
  tr: kontoMailTr,
  cs: kontoMailCs,
};

/**
 * Die Konto-Mail in der Sprache des Kontos - `null` für Deutsch (dann bleibt
 * PocketBases deutsche Vorlage) und für jede Kombination, die es nicht gibt.
 * Der eine Weg, den `tt_mail_sprache.pb.js` geht (E11c).
 */
function kontoMailInSprache(sprache, art, sammlung, link) {
  var neun = neunLib(sprache);
  if (neun) return neun.kontoMail(sprache, art, sammlung, link); // ★ O4
  var baue = Object.prototype.hasOwnProperty.call(KONTO_MAIL_JE_SPRACHE, sprache)
    ? KONTO_MAIL_JE_SPRACHE[sprache]
    : null;
  return baue ? baue(art, sammlung, link) : null;
}

// Export nur im require()-Kontext; beim Auto-Laden durch PocketBase gibt es
// kein `module` (sonst „module is not defined").
if (typeof module !== "undefined") {
  module.exports = {
    spracheVon: spracheVon,
    selbstWocheMail: selbstWocheMail,
    loeschWarnungMail: loeschWarnungMail,
    willkommenMail: willkommenMail,
    nachrichtMail: nachrichtMail,
    schreibprobeMail: schreibprobeMail,
    niveauName: niveauName,
    kontoMailEn: kontoMailEn,
    linkAus: linkAus,
    KONTO_MAILS_EN: KONTO_MAILS_EN,
    PROGRAMM_NAMEN_EN: PROGRAMM_NAMEN_EN,
    NIVEAU_NAMEN_EN: NIVEAU_NAMEN_EN,
    datumEn: datumEn,
    // E11c: Französisch
    kontoMailFr: kontoMailFr,
    kontoMailInSprache: kontoMailInSprache,
    KONTO_MAILS_FR: KONTO_MAILS_FR,
    NIVEAU_NAMEN_FR: NIVEAU_NAMEN_FR,
    datumFr: datumFr,
    // ES-M: Spanisch und die eine Liste der Sprachen
    MAIL_SPRACHEN: MAIL_SPRACHEN,
    MAIL_SPRACHEN_OHNE_TEXT: MAIL_SPRACHEN_OHNE_TEXT,
    kontoMailEs: kontoMailEs,
    KONTO_MAILS_ES: KONTO_MAILS_ES,
    NIVEAU_NAMEN_ES: NIVEAU_NAMEN_ES,
    datumEs: datumEs,
    // O-IT: Italienisch
    kontoMailIt: kontoMailIt,
    KONTO_MAILS_IT: KONTO_MAILS_IT,
    NIVEAU_NAMEN_IT: NIVEAU_NAMEN_IT,
    datumIt: datumIt,
    // O-PL: Polnisch
    kontoMailPl: kontoMailPl,
    KONTO_MAILS_PL: KONTO_MAILS_PL,
    NIVEAU_NAMEN_PL: NIVEAU_NAMEN_PL,
    datumPl: datumPl,
    plKategorie: plKategorie,
    plForm: plForm,
    wocheSpannePl: wocheSpannePl,
    // O-TR: Türkisch
    kontoMailTr: kontoMailTr,
    KONTO_MAILS_TR: KONTO_MAILS_TR,
    NIVEAU_NAMEN_TR: NIVEAU_NAMEN_TR,
    datumTr: datumTr,
    wocheSpanneTr: wocheSpanneTr,
    // O-CS: Tschechisch
    kontoMailCs: kontoMailCs,
    KONTO_MAILS_CS: KONTO_MAILS_CS,
    NIVEAU_NAMEN_CS: NIVEAU_NAMEN_CS,
    datumCs: datumCs,
    csKategorie: csKategorie,
    csForm: csForm,
    zZeCs: zZeCs,
    wocheSpanneCs: wocheSpanneCs,
  };
}
