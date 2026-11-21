/**
 * Korpus nur für Lernweg "tr" (Türkisch Q, Tastatur `tr-q`), frühe Sprossen 7-19 - Altersstufe Jugendliche (TR-T2,
 * 03.10.2026, Bauplan `BAUPLAN-2026-10-02-VIER-SPRACHEN-IT-PL-TR-CS.md`; Befund `BEFUND-2026-10-02-TR-T2-TEENS-FRUEH.md`).
 * Vorgehen nach dem Piloten TR-T1 (`BEFUND-2026-10-02-TR-T1-KIDS-FRUEH.md` §6), Vorbild für die Jugendstufe: PL-T2.
 *
 * Johannes' Regeln, wörtlich: „keine texte werden übersetzt, Texte aus den regionen, altersgemäß und zeitgemäß"
 * und „die texte sollen einen bezug zum land und sprache haben". ALLES NEU AUF TÜRKISCH VERFASST - keine Text-Datei
 * einer anderen Sprache als Inhalt geöffnet, nichts übersetzt, kein Tatoeba-Satz (darum kein `herkunft`). Tatoeba
 * (nur Originalsätze) diente als WORTLISTE je Sprosse; jede Zeile ist zusätzlich gegen ALLE türkischen Tatoeba-Sätze
 * (Originale UND Übersetzungen) abgeglichen - vier Entwurfszeilen standen dort wortgleich und wurden ersetzt (Befund §2).
 *
 * ZEICHENSATZ wie TR-T1 (`introOrder("tr")` auf `tr-q`): 7 a · 8 ş · 9 e · 10 i · 11 n · 12 m · 13 b · 14 r · 15 ı ·
 * 16 t · 17 y · 18 o · 19 u (danach ⇧, Punkt, Komma). `minTier` rechnet `minTierFor(text, "tr")`, nicht die Hand.
 *
 * VOR ⇧: alles klein, keine Satzzeichen, keine Frage, keine Namen (Orte, Vereine, Feste kommen nach ⇧). Es fehlen noch
 * `z ç h g ğ ü v p c ö`: kein „ve", „maç", „gol", „müzik", „takım kaptanı", „vapur", „deniz", „yüzme" - der Fussball
 * spricht darum über „derbi", „ofsayt", „berabere", „iki farkla", die Fähre heisst „feribot", die Musik „nakarat",
 * „bateri", „darbuka", „aksak ritim". Jede Zeile ist eine Wortgruppe („kantin sırası") oder ein kleiner Satz
 * („yarı finale kaldık"), nie Wortsalat; Endungen nach Vokalharmonie und Angleichung (Wächter rechnet nach).
 *
 * JUGEND 11-16, natürlich, nicht kindlich, nicht belehrend: Sport (auch Frauenfussball, Tischtennis, Halbmarathon),
 * Musik (Chor, Schlagzeug, Darbuka, Arabesk beim Vater), Technik ohne Moralkeule (Sprachnachricht, Akku leer, Internet
 * weg, dunkler Modus, Bildschirmsperre, Coding, Robotik-Team), Freundschaft („kanka" - geschlechtsneutral, Jugendsprache),
 * Schule nach türkischem System (fen lisesi, meslek lisesi, karnede takdir, test kitabı, ders kırk dakika, kantin).
 *
 * BEZUG ZU LAND UND SPRACHE ohne Namen - das Ding trägt die Region:
 *  · Marmara: feribotla adaya, adada bisiklet, iskelede selfi, liseli kafile iskelede, kaykayla iskeleye, metroda kalabalık.
 *  · Ege: yelken yarışı, midye dolma, kafede felsefe.
 *  · Akdeniz: derin dalış, dalış kursu, tekne turu, kumsalda futbol.
 *  · İç Anadolu: kaya oteli, yeraltı kenti.
 *  · Karadeniz: yaylada şenlik, sisli yayla.
 *  · Doğu Anadolu: kayak takımı.
 *  · Güneydoğu Anadolu: meyan şerbeti, darbuka ritmi.
 *  · Musik und Sprache des Landes: aksak ritim (9/8), babam arabesk dinler, esnaf lokantası.
 * Nie: Atatürk, Staatssymbole, Nationalfeiertage, Religion, Militär, Bayram; keine Rangliste gegen jemanden.
 *
 * Wächter: `tests/tastenflow-texte-tr-teens-frueh.test.ts`. Nur anhängen - Korpus-Anker im selben Commit
 * (`npx tsx scripts/erzeuge-korpus-anker.mts`).
 */
import type { CorpusItem } from "./corpus";

export const CORPUS_TR_WEG_FRUEH_TEENS: CorpusItem[] = [
  // ── Sprosse 7 (+a) - nur f j d k s l a ────────────────────────────────────────
  { text: "kafa salla", kind: "satz", stufen: ["teens"], minTier: 0, nurWeg: "tr" },
  { text: "kask al", kind: "satz", stufen: ["teens"], minTier: 0, nurWeg: "tr" },
  // ── Sprosse 8 (+ş) ─────────────────────────────────────────────────────────────
  { text: "fal da şaka", kind: "satz", stufen: ["teens"], minTier: 0, nurWeg: "tr" },
  { text: "saf aşk", kind: "satz", stufen: ["teens"], minTier: 0, nurWeg: "tr" },
  // ── Sprosse 9 (+e) ─────────────────────────────────────────────────────────────
  { text: "keşke kalsak", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "el salla", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "kafede felsefe", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "kalede kal", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  // ── Sprosse 10 (+i) ────────────────────────────────────────────────────────────
  { text: "iki dakika", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "elli like", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "liseli kafile iskelede", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "klişe laf", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "ilk aşk", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "ikisi de klas", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "iskelede selfi", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  // ── Sprosse 11 (+n) ────────────────────────────────────────────────────────────
  { text: "efsane final", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "şans seninle", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "inan kendine", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "lisede şenlik", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "fen lisesi", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "ilk dans", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "ne fena", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "en sakin kafe", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  // ── Sprosse 12 (+m) ────────────────────────────────────────────────────────────
  { text: "sesli mesaj", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "meslek lisesi", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "şimdi sende", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "eski film afişi", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "selam kankam", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "kankam akşam kafede", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  // ── Sprosse 13 (+b) ────────────────────────────────────────────────────────────
  { text: "bilim ekibi", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "baksana kanka", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "beş bin kişi", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "beleş film", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "keşke bilsen", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "ben dans bilmem", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  // ── Sprosse 14 (+r) ────────────────────────────────────────────────────────────
  { text: "iki iki berabere", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "rakibin kalesinde", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "iki farkla", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "ekran kilidi", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "kask indirimde", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "ek ders", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "babam arabesk dinler", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "bilişim dersi", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "bambaşka bir an", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "arkadaşlarla sinema", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "ilk sefer", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  // ── Sprosse 15 (+ı) ────────────────────────────────────────────────────────────
  { text: "derbi akşamı", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "ders kırk dakika", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "sıradaki şarkı", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "kısa film", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "kafası karışık", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "finalde başarılar", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "kısa mesaj", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "sakın bırakma", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "sınıf başkanı", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "kankama alkış", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "adım adım ileri", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "aklım sende", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "derin dalış", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  // ── Sprosse 16 (+t) ────────────────────────────────────────────────────────────
  { text: "takım arkadaşım", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "internet kesildi", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "şarjım bitti", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "antrenman saat altıda", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "ilk sette fark attık", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "aksak ritim", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "istek şarkı", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "adada bisiklet", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "test kitabı", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "bateri seti", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "karnede takdir", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "kantin sırası", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "selam millet", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "misafir takım", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "reklamlar bitsin", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "masa tenisi", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "kankama mesaj attım", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "nakarat efsane", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  // ── Sprosse 17 (+y) ────────────────────────────────────────────────────────────
  { text: "kafa kafaya", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "finalde karşı karşıya", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "yarı finale kaldık", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "yeni sınıf yeni arkadaş", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "bisiklet yarışı", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "yelken yarışı", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "yayın saat yedide", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "yetenek yarışması", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "en yakın arkadaşım", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "beyin fırtınası", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "kaykayla iskeleye", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "taraftarlar ayakta", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "yeraltı kenti", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "yaylada şenlik", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "sisli yayla", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "kayak takımı", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "meyan şerbeti", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  // ── Sprosse 18 (+o) ────────────────────────────────────────────────────────────
  { text: "konser bileti", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "yeni rekor", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "ofsayt yok", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "karanlık mod", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "sosyal medya", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "robot takımı", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "kodlama dersi", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "son dakikada beraberlik", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "boş ders", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "modern dans", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "feribotla adaya", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "midye dolma", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "kaya oteli", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "yarı maraton", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "basketbol antrenmanı", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "doksan dakika", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "esnaf lokantası", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "metroda kalabalık", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "koroda solo bende", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "nota defteri", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "yeni forma", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "eski dost", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  // ── Sprosse 19 (+u) - die letzte vor ⇧ ─────────────────────────────────────────
  { text: "korku filmi", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "mutlu son", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "okul takımı finalde", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "sokak basketbolu", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "bateri kursu", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "dalış kursu", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "darbuka ritmi", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "okul korosu", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "kutu oyunu", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "kelime oyunu", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "sunum sırası bende", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "tekne turu", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "akşam koşusu", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "kulaklıkla koşu", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "şarj kablosu", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "yarın okul yok", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "kumsalda futbol", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "kadın futbolu", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "on numara", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "dolu dolu bir yıl", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "ufak bir mola", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "telefonlar kutuya", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "okul radyosu", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
  { text: "umut dolu", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "tr" },
];
