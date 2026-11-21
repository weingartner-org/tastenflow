/**
 * Korpus nur für Lernweg "tr" (Türkisch Q, Tastatur `tr-q`), frühe Sprossen 7-19 - Altersstufe Kids (TR-T1,
 * 03.10.2026, Bauplan `BAUPLAN-2026-10-02-VIER-SPRACHEN-IT-PL-TR-CS.md`; Befund
 * `BEFUND-2026-10-02-TR-T1-KIDS-FRUEH.md`). Der PILOT der neun türkischen Text-Chargen: das Vorgehen steht im
 * Befund §6 (Vorbild: IT-T1, `corpusItWegFruehKids.ts`).
 *
 * Johannes' Regeln, wörtlich: „keine texte werden übersetzt, Texte aus den regionen, altersgemäß und zeitgemäß"
 * und „die texte sollen einen bezug zum land und sprache haben". ALLES NEU AUF TÜRKISCH VERFASST - keine Text-Datei
 * einer anderen Sprache als Inhalt geöffnet, nichts übersetzt, kein Tatoeba-Satz (darum kein `herkunft`). Tatoeba
 * (nur Originalsätze) diente als WORTLISTE je Sprosse; jede Zeile ist zusätzlich gegen ALLE türkischen
 * Tatoeba-Sätze abgeglichen (13 Zeilen des Entwurfs wie „iyi akşamlar", „dikkat et", „erken kalk" standen dort
 * wortgleich und wurden ersetzt - Befund §2).
 *
 * ZEICHENSATZ (`lernweg.ts` `TR_LETTER_ORDER`; „Sprosse" = Anzahl gelernter Einheiten von `introOrder("tr")`, vor ⇧
 * dasselbe wie die Zahl der Buchstaben):
 *    7  + a  - erster Vokal (da, al, kal, sal, ada, dal, sakla)
 *    8  + ş  - achte Heimtaste (şal, şaka, şafak)
 *    9  + e     10 + i     11 + n     12 + m     13 + b     14 + r
 *   15  + ı  - fünf Sprossen nach `i`: `ı` und `i` sind zwei Buchstaben auf zwei Tasten, eine Zeile mit `ı` gibt es
 *              erst hier (ılık/ilik, kır/kir sind verschiedene Wörter)
 *   16  + t     17 + y     18 + o
 *   19  + u  (danach ⇧, Punkt, Komma)
 * Nur EINE Tastatur (`tr-q`); `tr-f` bekommt später einen eigenen Weg. `minTier` (0 bis Sprosse 8, 1 für 9-19)
 * rechnet `minTierFor(text, "tr")`, nicht die Hand.
 *
 * VOR ⇧ GIBT ES KEINE GROSSBUCHSTABEN UND KEINE SATZZEICHEN: jede Zeile ist klein, ohne Punkt und Komma, ohne Frage,
 * darum ohne Namen (Orte, Personen, Feste kommen nach ⇧; Name + Endung mit Apostroph erst an Sprosse 30). Vor ⇧
 * fehlen noch `z ç h g ğ ü v p c ö`: KEIN „ve" (und), „çok", „için", „hiç", „gel", „güzel", „var", „deniz",
 * „yaz", „çocuk" - „und" heisst darum „ile" (oder die Endung -la/-le), Wortpaare stehen nebeneinander
 * („defter kalem al"). Türkische Wörter sind lang und tragen Endungen: eine Zeile hat 1-4 Wörter.
 *
 * JEDE ZEILE ist ENTWEDER eine kleine Wortgruppe aus echten Wörtern („nar ekşisi") ODER ein grammatisch richtiger
 * kleiner Satz („ayı kışın uyur") - nie Wortsalat (Leitfaden Falle 26). Jede Endung folgt der Vokalharmonie und der
 * Angleichung (-da/-de/-ta/-te: „adada", „kalede", „taşta", „mutfakta"; -lı/-li/-lu: „fıstıklı", „bademli",
 * „limonlu"). Wenige Zeilen, wo die Buchstaben wenig hergeben: an Sprosse 7 gibt es nur den Vokal „a" (5 Zeilen),
 * an Sprosse 8 dazu nur `ş` (4 Zeilen).
 *
 * BEZUG ZU LAND UND SPRACHE, soweit die Buchstaben es erlauben - alle sieben Regionen, nicht nur İstanbul/Ankara
 * (ohne Namen: das DING steht für die Region):
 *  · Marmara: lale, balık ekmek, martı simit istedi, susamlı simit, akide şekeri, bir kutu lokum, kuşlara yem at,
 *    fırında kestane, mermer masa (Marmara heisst „Marmor"), bostanda domates.
 *  · Ege: ekmekle menemen, kumru ile ayran, lokma tatlısı, oyalı mendil, teknenin yanında yunuslar, tekne limanda,
 *    bal kaymak (Afyon).
 *  · Akdeniz: limonlu dondurma (Kahramanmaraş), defne sabunu (Hatay), tantuni ile turşu (Mersin), nar ekşisi.
 *  · İç Anadolu: minik minik mantı, etli ekmek, şafakta balonlar, kışlık erişte, eski kilim.
 *  · Karadeniz: dalda fındık, yayla yemyeşil, yaylada kuymak, tulum sesi, sarı mısır, ormanda ayı, leblebi bende.
 *  · Doğu Anadolu: bir kardan adam, ilk kar, karda kayak, okul yolunda kar, kuru kayısı, dut kurusu, ayı kışın uyur.
 *  · Güneydoğu Anadolu: fıstıklı katmer, bakır sini, taş konak, tandırda ekmek.
 *  · Die Sprache selbst: „kır ile kir" (ı und i sind zwei Buchstaben), „tekerleme tekrarla", „babaannem neşeli" / „anneanne ile dede" (zwei Wörter
 *    für die Grossmutter), „ay dede", die Spiele „elim sende" und „sen ebesin".
 * Kinderalltag ohne alte Rollen: „babam mutfakta", „dedemle turşu kurduk", „annemle dama", „babana yardım et".
 * Nie: Atatürk, Staatssymbole, Nationalfeiertage, Religion, Militär (Glossar §4 Nr. 6/7); keine Bayram-Zeile.
 * Sperrliste `sperrlisteTr.ts`: Kern UND Wortbasis, auch gefaltet (`ı→i ş→s …`), dazu die unerwünschten Themenwörter
 * (`TR_WORTLISTE_UNERWUENSCHT`) - frühe Kinderzeilen tragen keinen Zusammenhang, der ein Doppelsinn-Wort hielte.
 *
 * Wächter: `tests/tastenflow-texte-tr-kids-frueh.test.ts` (Sprosse je Zeile AUSGERECHNET, Kleinschreibung,
 * Wortgrenze 8, Sperrliste, Wortbasis, Regeln aller tr-Zeilen, keine Kopien/Paare, Ledger-Schlüssel, jede Einheit hat
 * an ihrer Sprosse eine Zeile). Nur anhängen - Korpus-Anker im selben Commit (`npx tsx scripts/erzeuge-korpus-anker.mts`).
 */
import type { CorpusItem } from "./corpus";

export const CORPUS_TR_WEG_FRUEH_KIDS: CorpusItem[] = [
  // ── Sprosse 7 (+a) - nur f j d k s l a: kleine Wortgruppen und Befehle ────────
  { text: "sal adada", kind: "satz", stufen: ["kids"], minTier: 0, nurWeg: "tr" },
  { text: "adada kal", kind: "satz", stufen: ["kids"], minTier: 0, nurWeg: "tr" },
  { text: "al da sakla", kind: "satz", stufen: ["kids"], minTier: 0, nurWeg: "tr" },
  { text: "ak sakal", kind: "satz", stufen: ["kids"], minTier: 0, nurWeg: "tr" },
  { text: "dalda kal", kind: "satz", stufen: ["kids"], minTier: 0, nurWeg: "tr" },
  // ── Sprosse 8 (+ş) - die achte Heimtaste: şal, şaka, şafak ─────────────────
  { text: "şafakla kalk", kind: "satz", stufen: ["kids"], minTier: 0, nurWeg: "tr" },
  { text: "ak şal", kind: "satz", stufen: ["kids"], minTier: 0, nurWeg: "tr" },
  { text: "şal da al", kind: "satz", stufen: ["kids"], minTier: 0, nurWeg: "tr" },
  { text: "şaka", kind: "satz", stufen: ["kids"], minTier: 0, nurWeg: "tr" },
  // ── Sprosse 9 (+e) - dede, kale, lale (İstanbul) ────────────────────────────
  { text: "dede kalede", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "sade kek", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "el ele", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "ak lale", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "kalede şafak", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "kek de al", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  // ── Sprosse 10 (+i) - ile, iki, kedi, dilek ─────────────────────────────────
  { text: "iki kedi", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "eski kale", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "dede ile kedi", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "kedi dalda", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "ilk dilek", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "dilek dile", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "kedi sesi", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  // ── Sprosse 11 (+n) - anne, nine, ninni, fidan dikmek ──────────────────────
  { text: "ninni dinle", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "neşeli inek", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "fidan dik", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "sakin sakin nefes al", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "inek ile dana", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "sen de kal", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "aslan sakin", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "anneanne ile dede", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "dedene seslen", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "kalan kek senin", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  // ── Sprosse 12 (+m) - menemen (Ege), kilim, „elim sende" (Fangspiel) ───────
  { text: "ekmekle menemen", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "elim sende", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "minik kedim", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "kalemlik masada", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "eski kilim", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "annene selam", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "şimdi kalk", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "minik menekşe", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "akşam masal dinle", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "sinemada film", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "limanda akşam", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "annemle dama", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "kilimde kedi", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  // ── Sprosse 13 (+b) - „sen ebesin" (Fangspiel), leblebi (Çorum), babaanne ──
  { text: "sen ebesin", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "beş kelebek", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "babaannem neşeli", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "bebek benim", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "dede bana bak", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "leblebi bende", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "basamak basamak", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "beş dakika bekle", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "beni de al", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "benim kalemim", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "bademli kek", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  // ── Sprosse 14 (+r) - „bir" ist da; Schnee im Osten, Marmor, Süsses vom Markt ─
  { text: "bir kardan adam", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "nar ekşisi", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "iki arkadaş", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "renk renk kalem", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "resim dersi", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "renkli kilim", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "mermer masa", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "ekşi erik", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "akide şekeri", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "elma şekeri", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "kardeşim erken kalkar", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "ilk kar", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "dereler serin", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  // ── Sprosse 15 (+ı) - ışık, kış, balık ekmek (İstanbul), fındık (Karadeniz) ─
  { text: "kışın kar kalın", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "sınıf kalabalık", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "sarı ışık", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "balık ekmek", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "sarı mısır", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "sakin ırmak", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "kısa masal", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "akıllı kedi", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "kalın kaban", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "ışıl ışıl liman", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "fırından ekmek al", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "dalda fındık", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "salı akşamı", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "şarkı dinle", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "bakır sini", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  // „kır ile kir" (Feld und Schmutz): das Paar, an dem man ı und i HÖRT - bewusst nicht „ı ile i …" am Zeilenanfang,
  // denn die Auto-Grossschreibung vor ⇧ machte daraus „I ile i" und der Unterschied wäre unsichtbar.
  { text: "kır ile kir", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  // ── Sprosse 16 (+t) - simit und martı, mantı (Kayseri), katmer (Gaziantep), etli ekmek (Konya) ─
  { text: "martı simit istedi", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "minik minik mantı", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "fıstıklı katmer", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "kartal taşta", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "tandırda ekmek", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "tarlada mısır", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "ders bitti", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "saat tam altı", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "tekne limanda", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "makasla dikkatli kes", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "bisiklete bin", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "defter kalem al", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "masal anlat", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "matematik dersi", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "kışlık erişte", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "fırında kestane", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "kabak tatlısı", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "etli ekmek", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "tekerleme tekrarla", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  // ── Sprosse 17 (+y) - yayla (Karadeniz), kayısı (Malatya), kayak (Erzurum), „ay dede" ─
  { text: "yayla yemyeşil", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "kayısı tatlı", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "bir bardak ayran", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "karda kayak", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "kaydıraktan kay", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "leylek tek ayakta", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "iyi akşamlar dede", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "yarın yine kar", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "ben yedi yaşındayım", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "yeşil elma", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "yeni defter", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "erken yat", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "babana yardım et", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "yediye kadar say", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "ay dede", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "bal kaymak", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "yaşasın kar", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "dayım kayıkta", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  // ── Sprosse 18 (+o) - Kapadokya, lokma (İzmir), oya, taş konak (Mardin), kolonya ─
  { text: "şafakta balonlar", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "lokma tatlısı", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "limon kolonyası", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "oyalı mendil", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "taş konak", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "sokakta oyna", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "ormanda ayı", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "on dakika", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "mor menekşe", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "ayranla tost", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "boya kalemi", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "kol kola", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "oltayla balık", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "bostanda domates", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "on iki ay", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "orman serin", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  // ── Sprosse 19 (+u) - okul, kuş, su; die meisten Zeilen: hier üben Kinder bis ⇧ am längsten ─
  { text: "dik yokuş", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "kuşlara yem at", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "uyku saati", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "ayı kışın uyur", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "limonlu dondurma", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "bir kutu lokum", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "kumru ile ayran", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "yaylada kuymak", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "sulu armut", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "dut kurusu", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "kuru kayısı", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "kumdan kale", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "sokakta futbol", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "kuru fasulye", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "babam mutfakta", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "teknenin yanında yunuslar", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "tulum sesi", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "kurabiye kokusu", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "susamlı simit", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "şiir oku", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "defterini unutma", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "fidanı sula", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "bulutlar kayıyor", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "rafadan yumurta", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "dedemle turşu kurduk", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "okul yolunda kar", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "defne sabunu", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
  { text: "tantuni ile turşu", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "tr" },
];
