/**
 * Korpus nur für Lernweg "tr" (Türkisch Q, Tastatur `tr-q`), frühe Sprossen 7-19 - Altersstufe ERWACHSENE (TR-T3,
 * 03.10.2026, Bauplan `BAUPLAN-2026-10-02-VIER-SPRACHEN-IT-PL-TR-CS.md` Etappe T; Befund
 * `BEFUND-2026-10-02-TR-T3-ERWACHSENE-FRUEH.md`). Vorgehen nach dem Piloten TR-T1 (`BEFUND-2026-10-02-TR-T1-KIDS-FRUEH.md`
 * §6), Form nach dem polnischen Zwilling PL-T3.
 *
 * Johannes' Regeln, wörtlich: „keine texte werden übersetzt, Texte aus den regionen, altersgemäß und zeitgemäß"
 * und „die texte sollen einen bezug zum land und sprache haben". ALLES NEU AUF TÜRKISCH VERFASST - keine Text-Datei
 * einer anderen Sprache als Inhalt geöffnet, nichts übersetzt, kein Tatoeba-Satz (darum kein `herkunft`). Tatoeba
 * (nur Originalsätze) diente als WORTLISTE je Sprosse; jede Zeile ist zusätzlich gegen ALLE türkischen Tatoeba-Sätze
 * abgeglichen (10 Entwurfszeilen wie „başarılar dilerim", „sıra bende", „afiyet olsun" standen dort wortgleich und
 * wurden ersetzt oder gestrichen - Befund §2).
 *
 * ZEICHENSATZ wie TR-T1 (`introOrder("tr")` auf `tr-q`):
 *    7  + a  - erster Vokal         8 + ş  - KEINE Erwachsenenzeile (Befund §2: şal, şaka, şafak, kaş, aşk tragen keinen
 *                                            Erwachsenensatz, der nicht Kinderzeile oder Wortsalat wäre)
 *    9-14  + e i n m b r      15 + ı      16-19  + t y o u   (danach ⇧, Punkt, Komma)
 * `minTier` (0 an Sprosse 7, 1 für 9-19) rechnet `minTierFor(text, "tr")`, nicht die Hand.
 *
 * VOR ⇧ NUR KLEINSCHRIFT (Regel D-2: Erwachsene bekommen vor der Umschalttaste keine Grossbuchstaben, auch keine
 * automatischen): keine Satzzeichen, keine Namen, keine Frage. Es fehlen `z ç h g ğ ü v p c ö`: kein „ev", „vergi",
 * „sigorta", „hastane", „ilaç", „eczane", „dilekçe", „imza", „nüfus", „randevu", „kolay gelsin", keine Höflichkeitsform
 * auf „-sınız/-iniz" (`z`). Darum Wortgruppen, wie sie auf Formularen, Rechnungen, Schildern und in Mails stehen
 * („kira bedeli", „medeni durum", „adı soyadı"), und kleine Sätze im Alltagston („kira yine arttı", „trafikte kaldım").
 *
 * KEINE ZEILE VERRÄT DAS GESCHLECHT der Person, die tippt: Türkisch hat kein grammatisches Geschlecht, aber Wörter wie
 * „kocam/karım", „hamile", „gelin/damat", „eltim/bacanak", Bey/Hanım tragen es - keines davon (Wächter mit Gegenprobe).
 * „eşim", „kardeşim", „torunum" sind ohne Geschlecht.
 *
 * ERWACHSENENWELT, sachlich, nie kindlich, nie belehrend:
 *  · Arbeit: işe alım, iş teklifi, iş ilanlarına baktım, ilk maaş, net maaş, maaş bordrosu, esnek mesai, mesai bitti,
 *    stresli iş, boş kadro, yeni stajyer, terfi aldım, istifa kararı, erken emeklilik, karşılıklı anlaşma, teknik destek,
 *    sunum dosyası, yol masrafı, yemek kartı, aile şirketi, kendi işim, yurt dışında iş, akşam mesaisi, insan kaynakları,
 *    iş yeri doktoru.
 *  · Wohnen und Geld: kiralık daire, kira bedeli, kira artışı, aylık kira, kira yine arttı, site aidatı, ortak alan,
 *    kombi bakımı, musluk tamiri, dairede nem, su kesintisi, elektrik faturası, fatura tutarı, konut kredisi,
 *    kredi onaylandı, altı taksit, altın yatırımı, satılık arsa, emlak ilanı, yeni daireye taşındık, kat malikleri, oda
 *    arkadaşı.
 *  · Ämter und Formulare: adı soyadı, kimlik kartı, kimlik numarası, ikamet adresi, medeni durum, yetkili kişi, yakın
 *    akraba, noter onaylı, sıra numarası, kuyrukta bekle, beklemede kal, tutanak tutuldu, resmi duyuru, kamu kurumu,
 *    kayıt bedeli, yaş sınırı, okul kaydı, belediye kreşi.
 *  · Gesundheit (Wortgruppen, keine Anweisung): aile doktoru, yıllık kontrol, tansiyon takibi, kan şekeri, kolesterol
 *    testi, alerji testi, kan alındı, iki dikiş, ameliyat sonrası, mide ekşimesi, mide bulantısı, diş taşı.
 *  · Familie: iki aile, kalabalık aile, yaşlı anne babam, annem emekli oldu, kardeşim nişanlandı, torunum okula başladı.
 *  · Reise und Verkehr: tren bileti, feribot seferi, dolmuşla işe, son durak, trafikte kaldım, otel odası, tek kişilik
 *    oda, termal otel, yol tarifi.
 *  · Wer neu oder nach einer Erblindung tippen lernt (ohne Etikett): boşluk tuşu, dosya ekle, kolay kurulum,
 *    şifre sıfırlama, dosya yedekleme.
 * BEZUG ZU LAND UND SPRACHE, ohne Namen - das DING steht für die Region:
 *  · Marmara: trafikte kaldım (İstanbul), feribot seferi, dolmuşla işe.   · Ege: fuar alanı (İzmir), termal otel.
 *  · Akdeniz: serada domates (Antalya), aşırı nemli.   · İç Anadolu: tarlada kuraklık.   · Karadeniz: fındık fiyatı.
 *  · Doğu Anadolu: kışlık odun.   · Güneydoğu Anadolu: kuru dolma (Gaziantep).
 *  · Die Türkei allgemein: bakkal defteri, oto sanayi, bol bereket (Wunsch der Händler), misafire ikram, aile sofrası,
 *    altın yatırımı, site aidatı, komşu dayanışması, yarıyıl tatili.
 * ★ Merge mit TR-T2 (03.10.2026): zehn Zeilen standen wortgleich oder „fast gleich" in der Jugend-Charge (kask al, keşke
 *   kalsak, ilk dans, meslek lisesi, kısa mesaj, internet kesildi, esnaf lokantası, konser bileti, sosyal medya; iki dakika
 *   dinlen ~ iki dakika) - hier ersetzt bzw. gestrichen, die Regel nicht gelockert; „dil kursu" ⇒ „dil okulu", weil der
 *   TR-T2-Wächter die Form „kursu" selbst belegt (Befund §3c).
 *  · Die Sprache selbst: resmi dil, tatlı dil (Sprichwort „tatlı dil yılanı deliğinden çıkarır"), kendi dilinde, dil okulu.
 * Nie: Atatürk, Staatssymbole, Nationalfeiertage, Religion, Militär, Politik (Glossar §4 Nr. 6/7); kein Bayram.
 * Sperrliste `sperrlisteTr.ts`: Kern UND Wortbasis, auch gefaltet (`ı→i ş→s …`), dazu die unerwünschten Themenwörter
 * (`TR_WORTLISTE_UNERWUENSCHT`: kein „dava", „ceza", „kriz", „sigara").
 *
 * Wächter: `tests/tastenflow-texte-tr-erwachsene-frueh.test.ts` (Sprosse je Zeile AUSGERECHNET, Kleinschrift auch in
 * der Auslieferung, Geschlecht, Wortgrenze 8, Sperrliste, Wortschatz mit Belegen, Regeln aller tr-Zeilen, keine
 * Kopien/Paare/„fast gleich" gegen die ROHE Sammelliste `corpusTr.ts` und alle Korpora, Serien und Prüfungsbanken,
 * Ledger-Schlüssel, jede Zeile eine EIGENE Anker-ID). Nur anhängen - Korpus-Anker im selben Commit
 * (`npx tsx scripts/erzeuge-korpus-anker.mts`).
 */
import type { CorpusItem } from "./corpus";

export const CORPUS_TR_WEG_FRUEH_ERWACHSENE: CorpusItem[] = [
  // ── Sprosse 7 (+a) - nur f j d k s l a: zwei Wortgruppen ─────────────────────────────────────────────────────────
  { text: "lafa dal", kind: "satz", stufen: ["erwachsen"], minTier: 0, nurWeg: "tr" },
  { text: "kasada kal", kind: "satz", stufen: ["erwachsen"], minTier: 0, nurWeg: "tr" },
  // ── Sprosse 9 (+e) - ele al ──────────────────────────────────────────────────────────────────────────────────────
  { text: "ele al", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  // ── Sprosse 10 (+i) - iş, aile, dikiş ────────────────────────────────────────────────────────────────────────────
  { text: "fişi sakla", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "ilk iş", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "iki dikiş", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "iki aile", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "eski ilişki", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "iki şişe", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  // ── Sprosse 11 (+n) - dil, nefes ─────────────────────────────────────────────────────────────────────────────────
  { text: "kendi dilinde", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "elden ele", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "kendi kendine", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "nefes nefese", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  // ── Sprosse 12 (+m) - maaş, mesai, mide ──────────────────────────────────────────────────────────────────────────
  { text: "aile meselesi", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "maaş eksik", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "kendi işim", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "ilk maaş", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "esnek mesai", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "mide ekşimesi", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "akşam mesaisi", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  // ── Sprosse 13 (+b) - banka, bina, bilim ─────────────────────────────────────────────────────────────────────────
  { text: "bankadan mesaj", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "beklemede kal", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "bilimsel makale", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "işe başla", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "eski bina", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "kimse bilmesin", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  // ── Sprosse 14 (+r) - kira, ders, indirim, karar, lira ───────────────────────────────────────────────────────────
  { text: "kira bedeli", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "akşam dersi", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "erken emeklilik", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "kasada indirim", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "misafire ikram", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "kan şekeri", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "kesin karar", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "resmi dil", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "iki bin lira", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "idare eder", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "dairede nem", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "eski arkadaş", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  // ── Sprosse 15 (+ı) - kiralık daire, emekli maaşı, işe alım, kan alındı ──────────────────────────────────────────
  { text: "kiralık daire", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "emekli maaşı", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "işinde başarılar", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "işe alım", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "aşırı nemli", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "karşılıklı anlaşma", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "aklımda kalsın", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "araba bakımı", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "kan alındı", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "emlak ilanı", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "kalabalık aile", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "eski alışkanlık", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "kırsal kesim", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "dar kaldırım", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "kardeşim nişanlandı", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "şifre sıfırlama", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  // ── Sprosse 16 (+t) - kart, taksit, istifa, bilet, aidat ─────────────────────────────────────────────────────────
  { text: "kredi kartı", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "kimlik kartı", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "mesai bitti", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "kira artışı", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "altı taksit", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "istifa kararı", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "iş teklifi", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "tren bileti", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "market fişi", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "aile şirketi", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "teslimat saati", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "teknik destek", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "site aidatı", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "tatlı dil", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "ikamet adresi", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "alerji testi", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "diş taşı", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "trafikte kaldım", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "bakkal defteri", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "mesafeli satış", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "satılık arsa", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "net maaş", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "stresli iş", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "iş ilanlarına baktım", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "terfi aldım", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "kat malikleri", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  // ── Sprosse 17 (+y) - fiyat, belediye, yatırım, yaş, kayıt, yardım ───────────────────────────────────────────────
  { text: "fındık fiyatı", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "belediye kreşi", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "altın yatırımı", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "yaşlı anne babam", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "yeni iş yeri", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "yemek kartı", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "yarım saat", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "yetkili kişi", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "kayıt bedeli", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "yemek tarifi", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "yaş sınırı", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "aylık kira", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "yeni stajyer", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "itfaiye ekibi", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "yardım masası", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "yakın akraba", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "yarıyıl tatili", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "kira yine arttı", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "maaşlar yatırıldı", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "yeni daireye taşındık", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "insan kaynakları", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  // ── Sprosse 18 (+o) - doktor, otel, dosya, noter, sofra, radyo ───────────────────────────────────────────────────
  { text: "ameliyat sonrası", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "tansiyon takibi", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "sabit telefon", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "otel odası", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "dosya ekle", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "kombi bakımı", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "noter onaylı", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "yol masrafı", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "ortak alan", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "son dakika", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "yerel radyo", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "yıllık kontrol", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "boş kadro", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "tek kişilik oda", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "adı soyadı", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "feribot seferi", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "termal otel", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "serada domates", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "sokak lambası", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "yol tarifi", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "oto sanayi", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "kolesterol testi", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "yatak odası", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "doktor beni bekliyor", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "kredi onaylandı", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "bol bereket", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "aile sofrası", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "oda arkadaşı", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "dosya yedekleme", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  // ── Sprosse 19 (+u) - fatura, okul, durum, ulaşım, dolmuş ────────────────────────────────────────────────────────
  { text: "aile doktoru", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "konut kredisi", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "elektrik faturası", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "komşu dayanışması", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "bulaşık makinesi", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "musluk tamiri", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "yurt dışında iş", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "sıra numarası", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "kuyrukta bekle", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "medeni durum", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "ulaşım kartı", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "okul kaydı", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "maaş bordrosu", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "su kesintisi", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "dolmuşla işe", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "torunum okula başladı", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "tarlada kuraklık", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "kışlık odun", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "boşluk tuşu", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "kimlik numarası", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "son durak", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "fatura tutarı", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "sunum dosyası", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "kamu kurumu", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "mide bulantısı", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "fuar alanı", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "kuru dolma", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "resmi duyuru", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "son uyarı", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "kolay kurulum", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "tutanak tutuldu", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "annem emekli oldu", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "iş yeri doktoru", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
  { text: "dil okulu", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "tr" },
];
