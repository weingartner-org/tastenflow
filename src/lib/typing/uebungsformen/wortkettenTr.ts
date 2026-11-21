/**
 * ★ TR-W (09.10.2026): Wortketten nach Thema für Weg „tr" - der Baustoff der Form „Hand-Schwerpunkte" (*Sol el, sağ el*, Glossar
 * §2.2; `handschwerpunkte.ts` filtert daraus die Wörter, die sich mit EINER Hand tippen lassen - auf der Tastatur des Kindes, über
 * `fingerForChar`). Neu auf Türkisch zusammengestellt, nicht übersetzt.
 *
 * Türkische Nomen werden nicht grossgeschrieben - wie im Polnischen, Italienischen, Französischen und Spanischen gibt es darum nur
 * die Schwerpunkte „links" und „rechts", nie „umschalt-*". Auf `tr-q` (Türkçe Q) hat die linke Hand nur die Vokale `a e`, die rechte
 * `u ı o i ü ö` - und anders als auf `pl` liegen die türkischen Buchstaben `ç ğ ı ö ş ü` auf EIGENEN Tasten der rechten Hand (kein
 * AltGr): ein Wort wie *kuş*, *kuğu*, *ılık*, *yünlü* ist ehrlich einhändig. Die Themen tragen darum bewusst Wörter, die einhändig sind:
 *  · links: *araba, baba, gece, dere, ders, defter, sebze, gazete, cadde, teras, baca, raf, beste, ses, saz, bere, berber, evet,
 *    cesaret, abece, ezber, zebra*;
 *  · rechts: *okul, kuş, kuğu, kilim, limon, lokum, kimyon, kum, kumul, ılık, oyun, ip, piyon, kulüp, yün, yünlü, kol, hoş, uyku,
 *    uykulu, ninni, mum*.
 * Die Zahlen je Tastatur misst der Wächter `tests/tastenflow-wortspiele-tr.test.ts`; sie stehen im Befund
 * `BEFUND-2026-10-09-TR-WORTSPIELE.md`. (Weg „tr" kennt nur `tr-q`; `tr-f` ist erkannt, aber kein Weg-Layout.)
 *
 * Kein Wort mit `â î û` (Totaste `^`, Platz 31) und keines mit Apostroph. Nichts aus der Sperrliste (`sperrlisteTr.ts`, Kern UND
 * Wortbasis, auch gefaltet) und nichts aus `TR_WORTLISTE_UNERWUENSCHT` - und auch keine Tiernamen, die im Türkischen als
 * Schimpfwort gegen Menschen dienen (*eşek, domuz, öküz, ayı, inek, keçi, maymun, köpek, kaz, tavuk, koyun, sığır, dana, katır,
 * manda, çakal, it, hayvan*) oder einen Körper verspotten (*fil, balina, zürafa*): In einer Wortreihe ohne Zusammenhang stünden sie
 * da wie ein Witz auf Kosten des Kindes. Im Lückentext, mit Zusammenhang, steht *köpek* (es wedelt mit dem Schwanz).
 */
import type { Wortkette } from "./wortkettenThemen";

const ALLE_STUFEN: Wortkette["stufen"] = ["kids", "teens", "erwachsen"];

export const WORTKETTEN_TR: Wortkette[] = [
  {
    thema: "Hayvanlar",
    woerter: ["kedi", "kuş", "balık", "tavşan", "kaplumbağa", "kirpi", "sincap", "kelebek", "arı", "karınca", "penguen", "aslan", "kaplan", "yunus", "ceylan", "kartal", "martı", "leylek", "kuğu", "civciv", "kuzu", "zebra"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Ev",
    woerter: ["ev", "kapı", "pencere", "masa", "sandalye", "yatak", "dolap", "halı", "kilim", "lamba", "ayna", "mutfak", "banyo", "balkon", "teras", "çatı", "baca", "merdiven", "raf", "kanepe"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Okul",
    woerter: ["okul", "sınıf", "ders", "defter", "kitap", "kalem", "silgi", "çanta", "tahta", "tebeşir", "harita", "ödev", "teneffüs", "öğretmen", "öğrenci", "kütüphane", "abece", "ezber", "cetvel"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Sofrada",
    woerter: ["ekmek", "peynir", "zeytin", "çorba", "pilav", "yoğurt", "ayran", "çay", "su", "bal", "reçel", "simit", "börek", "köfte", "lokum", "kimyon", "sebze", "salata", "kaşık", "çatal"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Meyveler ve sebzeler",
    woerter: ["elma", "armut", "üzüm", "kiraz", "çilek", "karpuz", "kavun", "incir", "nar", "limon", "portakal", "mandalina", "kayısı", "fındık", "ceviz", "domates", "biber", "patlıcan", "havuç", "ıspanak"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Deniz kıyısında",
    woerter: ["deniz", "dalga", "kum", "kumsal", "kumul", "vapur", "gemi", "liman", "iskele", "balıkçı", "tekne", "yelken", "plaj", "havlu", "şemsiye", "midye", "istavrit"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Dağda ve yaylada",
    woerter: ["dağ", "tepe", "yayla", "orman", "çam", "kaya", "dere", "şelale", "mağara", "patika", "çoban", "sürü", "kar", "buz", "kızak", "kayak", "bulut"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Hava ve mevsimler",
    woerter: ["güneş", "yağmur", "bulut", "sis", "dolu", "şimşek", "gökkuşağı", "fırtına", "ilkbahar", "yaz", "sonbahar", "kış", "ılık", "serin", "sıcak", "soğuk"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Şehir",
    woerter: ["cadde", "sokak", "park", "köprü", "otobüs", "dolmuş", "tramvay", "metro", "araba", "bisiklet", "çarşı", "pazar", "fırın", "bakkal", "eczane", "hastane", "gazete", "durak"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Oyun ve spor",
    woerter: ["oyun", "top", "gol", "kale", "saklambaç", "uçurtma", "ip", "bilye", "misket", "tavla", "zar", "satranç", "piyon", "yüzme", "koşu", "kayak", "voleybol", "takım", "kulüp"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Müzik",
    woerter: ["şarkı", "türkü", "saz", "bağlama", "davul", "zurna", "kemençe", "kaval", "keman", "piyano", "flüt", "nota", "ritim", "beste", "ses", "koro"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Giysiler",
    woerter: ["gömlek", "etek", "pantolon", "ceket", "kazak", "mont", "bere", "şapka", "atkı", "eldiven", "çorap", "terlik", "ayakkabı", "pijama", "yelek", "kemer", "yün", "yünlü"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Vücut",
    woerter: ["baş", "göz", "kulak", "burun", "ağız", "diş", "dil", "el", "kol", "parmak", "bacak", "ayak", "diz", "omuz", "kalp", "saç", "kaş", "yüz"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Meslekler",
    woerter: ["öğretmen", "doktor", "hemşire", "aşçı", "fırıncı", "çiftçi", "balıkçı", "berber", "terzi", "marangoz", "pilot", "şoför", "itfaiyeci", "postacı", "arıcı", "mimar", "bahçıvan"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Duygular",
    woerter: ["mutlu", "üzgün", "neşeli", "meraklı", "cesur", "sakin", "heyecan", "sevinç", "umut", "sevgi", "dostluk", "hoş", "evet", "tamam", "cesaret", "gülümseme"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Gece ve uyku",
    woerter: ["gece", "ay", "yıldız", "uyku", "uykulu", "rüya", "ninni", "yastık", "yorgan", "pijama", "mum", "lamba", "sessiz", "battaniye", "masal", "yatak"],
    stufen: ALLE_STUFEN,
  },
];
