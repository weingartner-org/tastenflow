/**
 * „Steigerung im Verlauf" für den Tipptrainer — zeigt Kind UND Lehrkraft, wie
 * sich Tempo, Treffsicherheit und Leistungsstufe über die Zeit verbessern
 * (Wunsch #2). Die Zahlen (Differenzen) sind die Hauptaussage und auch für
 * Screenreader klar; die kleine Tempo-Kurve ist eine optische Zugabe.
 */
import { mehrzahl } from "@/lib/bedienSprache";
import {
  LEVEL_MAX,
  RoundResult,
  computeImprovement,
  fmtPercent,
  steigerungHinweis,
} from "@/lib/typing";
import { texte, useBedienSprache, type BedienSprache } from "@/lib/bedienSprache";
import { Hinweisflaeche } from "./Zeigerhinweis";
import { prozentMitZeichen } from "@/lib/typing/sprachRegister";

function fmtDeltaCpm(d: number): string {
  const r = Math.round(d);
  return (r >= 0 ? "+" : "") + r;
}
function fmtDeltaPct(d: number, sprache: BedienSprache = "de"): string {
  const r = Math.round(d * 100);
  // ★ EN3: englisch ohne Leerzeichen vor dem Prozentzeichen (Glossar §1.2).
  // ★ E11a-5: Tabelle je Sprache statt Weiche - französisch „+3 %" mit
  // Leerzeichen (Bauplan §9.1), wie im Deutschen.
  // ★ O-TR (02.10.2026): Vorzeichen vor das Zeichen, Betrag dahinter - Türkisch
  // "+%3"/"-%3" (`prozentMitZeichen`), alle anderen Byte für Byte wie vorher.
  return (r >= 0 ? "+" : "-") + prozentMitZeichen(Math.abs(r), PROZENT_JE_SPRACHE[sprache], sprache);
}

const PROZENT_JE_SPRACHE: Record<BedienSprache, string> = {
  de: " %",
  en: "%",
  fr: " %",
  // ★ ES-O (27.09.2026): RAE - „95 %" mit Leerzeichen.
  es: " %",
  it: "%", // ★ O-IT (02.10.2026): „95%" ohne Leerzeichen (Glossar Regel 5).
  pl: "%", // ★ O-PL (02.10.2026): „95%" ohne Leerzeichen (Intl und PWN, Glossar Regel 5).
  tr: "%", // ★ O-TR (02.10.2026): "%95" - die Stellung setzt `prozentMitZeichen` (Glossar Regel 5).
  cs: " %", // ★ O-CS (03.10.2026): „95 %" - das geschützte Leerzeichen setzt `prozentMitZeichen` (Glossar Regel 5).
  // ★ O2-COMP (30.10.2026): die neun Sprachen mit eigener Fassung.
  bg: "%",
  el: "%",
  hu: "%",
  nl: "%",
  pt: "%",
  br: "%",
  ro: " %",
  sv: " %",
  uk: "%",
};

/**
 * „Steigerung im Verlauf" in beiden Bedienungssprachen (EN3, 19.09.2026).
 * Deutsch wortgleich wie vorher (Teil-Listen, wo JSX mehrere Textknoten
 * hatte). Glossar §3.2: *progress over time*, *speed*, *accuracy*,
 * Leistungsstufe ⇒ *difficulty level* (nur die Lehrkraft sieht sie; *level*
 * allein ist die Spielstufe ★). Den Hinweis zur Kurve liefert
 * `steigerungHinweis` (EN5).
 */
const TREND_TEXTE = texte({
  de: {
    titel: "Steigerung im Verlauf",
    stand: (tempo: string, treffer: string) => `Tempo ${tempo}, Treffsicherheit ${treffer}`,
    keinStand: "noch keine Steigerung",
    stufe: (stufe: number, max: number) => ["· Leistungsstufe ", stufe, " / ", max],
    tempoName: (von: number, bis: number, delta: string) =>
      `Tempo ${von} auf ${bis} Anschläge pro Minute, ${delta}`,
    tempoKopf: "Tempo (Anschl./Min)",
    trefferName: (von: string, bis: string, delta: string) =>
      `Treffsicherheit ${von} auf ${bis}, ${delta}`,
    trefferKopf: "Treffsicherheit",
    stufeName: (von: number, bis: number, delta: string) => `Leistungsstufe ${von} auf ${bis}, ${delta}`,
    stufeKopf: "Stufe",
    ueberRunden: (runden: number, bestes: number) => [
      "Tempo über ",
      runden,
      " Runden · bestes ",
      bestes,
      "/Min",
    ],
    leer: (selbst: boolean, name: string) => [
      selbst ? "Du" : name || "Diese Person",
      " ",
      selbst ? "siehst" : "sieht",
      " die Steigerung, sobald ein paar Runden geübt sind.",
    ],
  },
  en: {
    titel: "Progress over time",
    stand: (tempo: string, treffer: string) => `Speed ${tempo}, accuracy ${treffer}`,
    keinStand: "not enough rounds yet",
    stufe: (stufe: number, max: number) => ["· Difficulty level ", stufe, " / ", max],
    tempoName: (von: number, bis: number, delta: string) =>
      `Speed from ${von} to ${bis} keystrokes per minute, ${delta}`,
    tempoKopf: "Speed (keystrokes/min)",
    trefferName: (von: string, bis: string, delta: string) =>
      `Accuracy from ${von} to ${bis}, ${delta}`,
    trefferKopf: "Accuracy",
    stufeName: (von: number, bis: number, delta: string) =>
      `Difficulty level from ${von} to ${bis}, ${delta}`,
    stufeKopf: "Difficulty level",
    ueberRunden: (runden: number, bestes: number) => [
      "Speed over ",
      runden,
      " rounds · best ",
      bestes,
      "/min",
    ],
    leer: (selbst: boolean, name: string) =>
      selbst
        ? ["You'll see your progress here once you've practised a few rounds."]
        : ["Progress will show here once ", name || "this person", " has practised a few rounds."],
  },
  fr: {
    titel: "Progrès dans le temps",
    stand: (tempo: string, treffer: string) => `Vitesse ${tempo}, précision ${treffer}`,
    keinStand: "pas encore de progrès",
    stufe: (stufe: number, max: number) => ["- Niveau ", stufe, " / ", max],
    tempoName: (von: number, bis: number, delta: string) =>
      `Vitesse de ${von} à ${bis} frappes par minute, ${delta}`,
    tempoKopf: "Vitesse (frappes/min)",
    trefferName: (von: string, bis: string, delta: string) =>
      `Précision de ${von} à ${bis}, ${delta}`,
    trefferKopf: "Précision",
    stufeName: (von: number, bis: number, delta: string) => `Niveau de ${von} à ${bis}, ${delta}`,
    stufeKopf: "Niveau",
    ueberRunden: (runden: number, bestes: number) => [
      "Vitesse sur ",
      runden,
      " séries - meilleure ",
      bestes,
      "/min",
    ],
    leer: (selbst: boolean, name: string) => [
      selbst ? "Tu" : name || "Cette personne",
      " ",
      selbst ? "verras" : "verra",
      " les progrès dès que quelques séries auront été faites.",
    ],
  },
  // ★ ES-O (27.09.2026): `selbst` = tú, sonst über die Person (Lehrkraft).
  es: {
    titel: "Progreso en el tiempo",
    stand: (tempo: string, treffer: string) => `Velocidad ${tempo}, precisión ${treffer}`,
    keinStand: "todavía sin progreso",
    stufe: (stufe: number, max: number) => ["- Nivel ", stufe, " / ", max],
    tempoName: (von: number, bis: number, delta: string) =>
      `Velocidad de ${von} a ${bis} pulsaciones por minuto, ${delta}`,
    tempoKopf: "Velocidad (pulsaciones por minuto)",
    trefferName: (von: string, bis: string, delta: string) =>
      `Precisión de ${von} a ${bis}, ${delta}`,
    trefferKopf: "Precisión",
    stufeName: (von: number, bis: number, delta: string) => `Nivel de ${von} a ${bis}, ${delta}`,
    stufeKopf: "Nivel",
    ueberRunden: (runden: number, bestes: number) => [
      "Velocidad en ",
      runden,
      " series - la mejor ",
      bestes,
      "/min",
    ],
    leer: (selbst: boolean, name: string) => [
      selbst ? "Verás" : name ? `${name} verá` : "Esta persona verá",
      " ",
      "",
      "el progreso en cuanto haya unas cuantas series hechas.",
    ],
  },
  it: {
    titel: "Progressi nel tempo",
    stand: (tempo: string, treffer: string) => `Velocità ${tempo}, precisione ${treffer}`,
    keinStand: "ancora nessun progresso",
    stufe: (stufe: number, max: number) => ["- Livello ", stufe, " / ", max],
    tempoName: (von: number, bis: number, delta: string) =>
      `Velocità da ${von} a ${bis} battute al minuto, ${delta}`,
    tempoKopf: "Velocità (battute al minuto)",
    trefferName: (von: string, bis: string, delta: string) =>
      `Precisione da ${von} a ${bis}, ${delta}`,
    trefferKopf: "Precisione",
    stufeName: (von: number, bis: number, delta: string) => `Livello da ${von} a ${bis}, ${delta}`,
    stufeKopf: "Livello",
    ueberRunden: (runden: number, bestes: number) => [
      "Velocità in ",
      runden,
      " giri - la migliore ",
      bestes,
      "/min",
    ],
    leer: (selbst: boolean, name: string) => [
      selbst ? "Vedrai" : name ? `${name} vedrà` : "Questa persona vedrà",
      " ",
      "",
      "i progressi appena ci saranno alcuni giri fatti.",
    ],
  },
  // ★ O-PL (02.10.2026): Zahlen nach Doppelpunkt (Glossar §2.10a: „od 120 do
  // 150" ohne gebeugtes Hauptwort dahinter); Leistungsstufe ⇒ poziom trudności
  // (§2.2); der leere Satz spricht über die Sache, nicht über die Person.
  pl: {
    titel: "Postępy w czasie",
    stand: (tempo: string, treffer: string) => `Tempo ${tempo}, dokładność ${treffer}`,
    keinStand: "na razie za mało rund",
    stufe: (stufe: number, max: number) => ["- Poziom trudności ", stufe, " / ", max],
    tempoName: (von: number, bis: number, delta: string) =>
      `Tempo (uderzenia na minutę): od ${von} do ${bis}, ${delta}`,
    tempoKopf: "Tempo (uderzenia/min)",
    trefferName: (von: string, bis: string, delta: string) =>
      `Dokładność: od ${von} do ${bis}, ${delta}`,
    trefferKopf: "Dokładność",
    stufeName: (von: number, bis: number, delta: string) =>
      `Poziom trudności: od ${von} do ${bis}, ${delta}`,
    stufeKopf: "Poziom trudności",
    ueberRunden: (runden: number, bestes: number) => [
      "Rundy: ",
      runden,
      " - najlepsze tempo ",
      bestes,
      "/min",
    ],
    leer: (selbst: boolean) =>
      selbst
        ? ["Twoje postępy pojawią się tu po kilku rundach ćwiczeń."]
        : ["Postępy pojawią się tu po kilku rundach ćwiczeń."],
  },
  // ★ O-TR (02.10.2026): Zahlen hinter Doppelpunkt bzw. "ilk"/"son", nie mit
  // Endung (Glossar Regel 6); nie "3 / 12" - "(en çok 50)" wie "2 yıldız (en çok 3)";
  // Leistungsstufe ⇒ zorluk seviyesi (§2.2); Kind sen, Lehrkraft-Satz über die Sache.
  tr: {
    titel: "Zaman içindeki ilerleme",
    stand: (tempo: string, treffer: string) => `Hız ${tempo}, doğruluk ${treffer}`,
    keinStand: "henüz yeterli tur yok",
    stufe: (stufe: number, max: number) => ["- Zorluk seviyesi ", stufe, " (en çok ", max, ")"],
    tempoName: (von: number, bis: number, delta: string) =>
      `Hız (dakikada vuruş): ilk ${von}, son ${bis}, ${delta}`,
    tempoKopf: "Hız (Vuruş/dk)",
    trefferName: (von: string, bis: string, delta: string) =>
      `Doğruluk: ilk ${von}, son ${bis}, ${delta}`,
    trefferKopf: "Doğruluk",
    stufeName: (von: number, bis: number, delta: string) =>
      `Zorluk seviyesi: ilk ${von}, son ${bis}, ${delta}`,
    stufeKopf: "Zorluk seviyesi",
    ueberRunden: (runden: number, bestes: number) => [
      "Tur: ",
      runden,
      " - en iyi hız: ",
      bestes,
      " vuruş/dk",
    ],
    leer: (selbst: boolean) =>
      selbst
        ? ["Birkaç tur çalıştıktan sonra ilerlemeni burada görürsün."]
        : ["Birkaç tur çalışıldıktan sonra ilerleme burada görünür."],
  },
  // ★ O-CS (03.10.2026): Zahlen nach Doppelpunkt bzw. „od ... do ..." (ändern sich
  // vor keiner Zahl, Glossar §2.11); Stufe mit Schrägstrich „12/50" (Regel 13);
  // Leistungsstufe ⇒ úroveň obtížnosti (§2.2); Kind ty, sonst über die Sache.
  cs: {
    titel: "Pokrok v čase",
    stand: (tempo: string, treffer: string) => `Rychlost ${tempo}, přesnost ${treffer}`,
    keinStand: "zatím málo kol",
    stufe: (stufe: number, max: number) => ["- Úroveň obtížnosti ", stufe, "/", max],
    tempoName: (von: number, bis: number, delta: string) =>
      `Rychlost (úhozy za minutu): od ${von} do ${bis}, ${delta}`,
    tempoKopf: "Rychlost (úhozů/min)",
    trefferName: (von: string, bis: string, delta: string) =>
      `Přesnost: od ${von} do ${bis}, ${delta}`,
    trefferKopf: "Přesnost",
    stufeName: (von: number, bis: number, delta: string) =>
      `Úroveň obtížnosti: od ${von} do ${bis}, ${delta}`,
    stufeKopf: "Úroveň obtížnosti",
    ueberRunden: (runden: number, bestes: number) => [
      "Kola: ",
      runden,
      " - nejlepší rychlost: ",
      bestes,
      " úhozů/min",
    ],
    leer: (selbst: boolean) =>
      selbst
        ? ["Svůj pokrok tu uvidíš po několika kolech cvičení."]
        : ["Pokrok se tu ukáže po několika kolech cvičení."],
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      titel: "Развитие във времето",
      stand: (tempo: string, treffer: string) => `Скорост ${tempo}, точност ${treffer}`,
      keinStand: "още няма достатъчно кръгове",
      stufe: (stufe: number, max: number) => ["· Ниво на трудност ", stufe, " / ", max],
      tempoName: (von: number, bis: number, delta: string) =>
        `Скорост от ${von} на ${mehrzahl(bis, "bg", { one: (z) => `${z} знак`, other: (z) => `${z} знака` })} в минута, ${delta}`,
      tempoKopf: "Скорост (знаци/мин)",
      trefferName: (von: string, bis: string, delta: string) =>
        `Точност от ${von} на ${bis}, ${delta}`,
      trefferKopf: "Точност",
      stufeName: (von: number, bis: number, delta: string) =>
        `Ниво на трудност от ${von} на ${bis}, ${delta}`,
      stufeKopf: "Ниво на трудност",
      ueberRunden: (runden: number, bestes: number) => [
        "Скорост за ",
        runden,
        runden === 1 ? " кръг" : " кръга",
        " · най-добра ",
        bestes,
        "/мин",
      ],
      leer: (selbst: boolean, name: string) =>
        selbst
          ? ["Развитието ти ще се вижда тук, щом направиш няколко кръга."]
          : ["Развитието ще се вижда тук, щом ", name || "този човек", " направи няколко кръга."],
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      titel: "Εξέλιξη στον χρόνο",
      stand: (tempo: string, treffer: string) => `Ταχύτητα ${tempo}, ακρίβεια ${treffer}`,
      keinStand: "δεν υπάρχουν ακόμα αρκετοί γύροι",
      stufe: (stufe: number, max: number) => ["· Επίπεδο δυσκολίας ", stufe, " από ", max],
      tempoName: (von: number, bis: number, delta: string) =>
        `Ταχύτητα από ${von} ως ${bis} πατήματα ανά λεπτό, ${delta}`,
      tempoKopf: "Ταχύτητα (πατήματα/λεπτό)",
      trefferName: (von: string, bis: string, delta: string) =>
        `Ακρίβεια από ${von} ως ${bis}, ${delta}`,
      trefferKopf: "Ακρίβεια",
      stufeName: (von: number, bis: number, delta: string) =>
        `Επίπεδο δυσκολίας από ${von} ως ${bis}, ${delta}`,
      stufeKopf: "Επίπεδο δυσκολίας",
      ueberRunden: (runden: number, bestes: number) => [
        "Ταχύτητα ανά γύρο (γύροι: ",
        runden,
        ") · καλύτερη ",
        bestes,
        "/λεπτό",
      ],
      // Name nur nach Doppelpunkt (Glossar Regel 12).
      leer: (selbst: boolean, name: string) =>
        selbst
          ? ["Θα δεις την εξέλιξή σου εδώ μόλις κάνεις μερικούς γύρους εξάσκησης."]
          : name
            ? ["Άτομο: ", name, ". Η εξέλιξη θα φαίνεται εδώ μετά από μερικούς γύρους εξάσκησης."]
            : ["Η εξέλιξη θα φαίνεται εδώ μετά από μερικούς γύρους εξάσκησης."],
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      titel: "Fejlődés az időben",
      stand: (tempo: string, treffer: string) => `Sebesség: ${tempo}, pontosság: ${treffer}`,
      keinStand: "még nincs elég kör",
      stufe: (stufe: number, max: number) => ["· Nehézségi szint: ", stufe, "/", max],
      tempoName: (von: number, bis: number, delta: string) =>
        `Sebesség korábban ${von}, most ${bis} leütés percenként, ${delta}`,
      tempoKopf: "Sebesség (leütés/perc)",
      trefferName: (von: string, bis: string, delta: string) =>
        `Pontosság korábban ${von}, most ${bis}, ${delta}`,
      trefferKopf: "Pontosság",
      stufeName: (von: number, bis: number, delta: string) =>
        `Nehézségi szint korábban ${von}, most ${bis}, ${delta}`,
      stufeKopf: "Nehézségi szint",
      ueberRunden: (runden: number, bestes: number) => [
        "Sebesség, körök: ",
        runden,
        " · legjobb: ",
        bestes,
        "/perc",
      ],
      leer: (selbst: boolean, name: string) =>
        selbst
          ? ["Itt látod a fejlődésedet, amint gyakoroltál néhány kört."]
          : ["A fejlődés itt jelenik meg, amint ", name || "ez a tanuló", " gyakorolt néhány kört."],
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      titel: "Verloop",
      stand: (tempo: string, treffer: string) => `Snelheid ${tempo}, nauwkeurigheid ${treffer}`,
      keinStand: "nog niet genoeg rondes",
      stufe: (stufe: number, max: number) => ["· Moeilijkheidsniveau ", stufe, " / ", max],
      tempoName: (von: number, bis: number, delta: string) =>
        `Snelheid van ${von} naar ${bis} aanslagen per minuut, ${delta}`,
      tempoKopf: "Snelheid (aanslagen/min)",
      trefferName: (von: string, bis: string, delta: string) =>
        `Nauwkeurigheid van ${von} naar ${bis}, ${delta}`,
      trefferKopf: "Nauwkeurigheid",
      stufeName: (von: number, bis: number, delta: string) =>
        `Moeilijkheidsniveau van ${von} naar ${bis}, ${delta}`,
      stufeKopf: "Moeilijkheidsniveau",
      ueberRunden: (runden: number, bestes: number) => [
        "Snelheid over ",
        runden,
        " rondes · beste ",
        bestes,
        "/min",
      ],
      leer: (selbst: boolean, name: string) =>
        selbst
          ? ["Je ziet je verloop hier zodra je een paar rondes hebt geoefend."]
          : ["Het verloop verschijnt hier zodra ", name || "deze persoon", " een paar rondes heeft geoefend."],
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      titel: "Evolução ao longo do tempo",
      stand: (tempo: string, treffer: string) => `Velocidade ${tempo}, precisão ${treffer}`,
      keinStand: "ainda não há rondas suficientes",
      stufe: (stufe: number, max: number) => ["· Nível de dificuldade ", stufe, " de ", max],
      tempoName: (von: number, bis: number, delta: string) =>
        `Velocidade de ${von} para ${bis} toques por minuto, ${delta}`,
      tempoKopf: "Velocidade (toques/min)",
      trefferName: (von: string, bis: string, delta: string) =>
        `Precisão de ${von} para ${bis}, ${delta}`,
      trefferKopf: "Precisão",
      stufeName: (von: number, bis: number, delta: string) =>
        `Nível de dificuldade de ${von} para ${bis}, ${delta}`,
      stufeKopf: "Nível de dificuldade",
      ueberRunden: (runden: number, bestes: number) => [
        "Velocidade ao longo de ",
        runden,
        " rondas · melhor ",
        bestes,
        "/min",
      ],
      leer: (selbst: boolean, name: string) =>
        selbst
          ? ["Vais ver aqui a tua evolução depois de praticares algumas rondas."]
          : ["A evolução aparece aqui quando ", name || "esta pessoa", " tiver praticado algumas rondas."],
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      titel: "Evolução",
      stand: (tempo: string, treffer: string) => `Velocidade ${tempo}, precisão ${treffer}`,
      keinStand: "ainda não há rodadas suficientes",
      stufe: (stufe: number, max: number) => ["· Nível de dificuldade ", stufe, " / ", max],
      tempoName: (von: number, bis: number, delta: string) =>
        `Velocidade de ${von} para ${bis} toques por minuto, ${delta}`,
      tempoKopf: "Velocidade (toques/min)",
      trefferName: (von: string, bis: string, delta: string) =>
        `Precisão de ${von} para ${bis}, ${delta}`,
      trefferKopf: "Precisão",
      stufeName: (von: number, bis: number, delta: string) =>
        `Nível de dificuldade de ${von} para ${bis}, ${delta}`,
      stufeKopf: "Nível de dificuldade",
      ueberRunden: (runden: number, bestes: number) => [
        "Velocidade em ",
        runden,
        " rodadas · melhor ",
        bestes,
        "/min",
      ],
      // Glossar Regel 12: Name ohne Artikel.
      leer: (selbst: boolean, name: string) =>
        selbst
          ? ["Sua evolução aparece aqui depois de algumas rodadas de prática."]
          : ["A evolução aparece aqui depois que ", name || "esta pessoa", " praticar algumas rodadas."],
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      titel: "Evoluție în timp",
      stand: (tempo: string, treffer: string) => `Viteză ${tempo}, precizie ${treffer}`,
      keinStand: "încă prea puține runde",
      stufe: (stufe: number, max: number) => ["· Nivel de dificultate ", stufe, "/", max],
      // Doppelpunkt-Form: so braucht die Zahl kein „de" (Glossar Regel 13).
      tempoName: (von: number, bis: number, delta: string) =>
        `Viteză (caractere pe minut): de la ${von} la ${bis}, ${delta}`,
      tempoKopf: "Viteză (car./min)",
      trefferName: (von: string, bis: string, delta: string) =>
        `Precizie: de la ${von} la ${bis}, ${delta}`,
      trefferKopf: "Precizie",
      stufeName: (von: number, bis: number, delta: string) =>
        `Nivel de dificultate: de la ${von} la ${bis}, ${delta}`,
      stufeKopf: "Nivel de dificultate",
      ueberRunden: (runden: number, bestes: number) => [
        "Viteza - runde: ",
        runden,
        " · cea mai bună: ",
        bestes,
        " car./min",
      ],
      leer: (selbst: boolean, name: string) =>
        selbst
          ? ["Evoluția ta apare aici după ce exersezi câteva runde."]
          : ["Evoluția apare aici după ce ", name || "această persoană", " exersează câteva runde."],
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      titel: "Utveckling över tid",
      stand: (tempo: string, treffer: string) => `Hastighet ${tempo}, träffsäkerhet ${treffer}`,
      keinStand: "inte tillräckligt många omgångar än",
      stufe: (stufe: number, max: number) => ["· Svårighetsnivå ", stufe, " / ", max],
      tempoName: (von: number, bis: number, delta: string) =>
        `Hastighet från ${von} till ${bis} anslag per minut, ${delta}`,
      tempoKopf: "Hastighet (anslag/min)",
      trefferName: (von: string, bis: string, delta: string) =>
        `Träffsäkerhet från ${von} till ${bis}, ${delta}`,
      trefferKopf: "Träffsäkerhet",
      stufeName: (von: number, bis: number, delta: string) =>
        `Svårighetsnivå från ${von} till ${bis}, ${delta}`,
      stufeKopf: "Svårighetsnivå",
      ueberRunden: (runden: number, bestes: number) => [
        "Hastighet över ",
        runden,
        " omgångar · bästa ",
        bestes,
        "/min",
      ],
      leer: (selbst: boolean, name: string) =>
        selbst
          ? ["Här ser du din utveckling när du har övat några omgångar."]
          : ["Utvecklingen visas här när ", name || "eleven", " har övat några omgångar."],
    },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: {
      titel: "Зміни з часом",
      stand: (tempo: string, treffer: string) => `Швидкість ${tempo}, точність ${treffer}`,
      keinStand: "ще замало раундів",
      stufe: (stufe: number, max: number) => ["· Рівень складності ", stufe, " / ", max],
      // Nach „до" steht der Genitiv: „до 21 знака", sonst „до 22 / 120 знаків".
      tempoName: (von: number, bis: number, delta: string) =>
        `Швидкість від ${von} до ${mehrzahl(bis, "uk", {
          one: (z) => `${z} знака`,
          few: (z) => `${z} знаків`,
          many: (z) => `${z} знаків`,
          other: (z) => `${z} знака`,
        })} за хвилину, ${delta}`,
      tempoKopf: "Швидкість (знаків/хв)",
      trefferName: (von: string, bis: string, delta: string) =>
        `Точність від ${von} до ${bis}, ${delta}`,
      trefferKopf: "Точність",
      stufeName: (von: number, bis: number, delta: string) =>
        `Рівень складності від ${von} до ${bis}, ${delta}`,
      stufeKopf: "Рівень складності",
      ueberRunden: (runden: number, bestes: number) => [
        "Швидкість за ",
        runden,
        " ",
        mehrzahl(runden, "uk", {
          one: () => "раунд",
          few: () => "раунди",
          many: () => "раундів",
          other: () => "раунду",
        }),
        " · найкраща ",
        bestes,
        "/хв",
      ],
      leer: (selbst: boolean, name: string) =>
        selbst
          ? ["Твої зміни з'являться тут, щойно ти пройдеш кілька раундів."]
          : ["Зміни з'являться тут, щойно ", name || "ця особа", " пройде кілька раундів."],
    },
});

/** Kompakte Tempo-Kurve (Anschläge/Min je Runde). Rein dekorativ (aria-hidden). */
function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return null;
  const W = 160;
  const H = 36;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * (W - 2) + 1;
      const y = H - 2 - ((v - min) / span) * (H - 4);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-9 w-full"
      preserveAspectRatio="none"
      aria-hidden
      focusable="false"
    >
      <polyline
        points={pts}
        fill="none"
        stroke="rgb(var(--c-accent))"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LevelTrend({
  rounds,
  level,
  selfView = false,
  showLevel = true,
  name,
  flach = false,
}: {
  rounds: RoundResult[] | undefined;
  level: number;
  selfView?: boolean;
  /**
   * Der Name der lernenden Person - er steht in der Lehrkraft-Sicht anstelle
   * einer Gruppenbezeichnung (G3, 01.09.2026). Fehlt er, bleibt der neutrale
   * Ersatz stehen.
   */
  name?: string;
  /** Leistungsstufe anzeigen? In der eigenen Sicht aus (nur die Lehrkraft sieht sie). */
  showLevel?: boolean;
  /**
   * ★ R6 (11.09.2026): ohne eigenen Rahmen, mit Haarlinie und 36-px-Kopf - in
   * der aufgeklappten Zeile eines Kindes bei der Lehrkraft. Begründung bei
   * `WeeklyGoalStats` (dieselbe Eigenschaft). Die eigene Statistik des Kindes
   * behält den Kasten.
   */
  flach?: boolean;
}) {
  const rs = rounds ?? [];
  const imp = computeImprovement(rs);
  const { sprache } = useBedienSprache();
  const t = TREND_TEXTE[sprache];
  const hinweis = steigerungHinweis(selfView ? "du" : "Sie", sprache);
  // ★ Der Stand in der Zusammenfassung (C3, 11.09.2026): Wer den Kasten
  // zugeklappt sieht, soll ohne Aufklappen wissen, ob und wie sich Tempo und
  // Treffsicherheit verändert haben - genau wie beim Wochenziel-Kasten.
  const stand = imp
    ? t.stand(fmtDeltaCpm(imp.cpmDelta), fmtDeltaPct(imp.accDelta, sprache))
    : t.keinStand;

  return (
    /*
      ⚠️ Ein `<details>`, kein selbstgebauter Aufklapper (C3), zugeklappt -
      Vorbild: der Wochenziel-Kasten (`WeeklyGoalStats`, dort wiederum die
      Klasse in `TastenflowReiter.tsx`).
    */
    <details
      className={
        // ★ R6 (11.09.2026): `flach` - Haarlinie statt Rahmen, wie `WeeklyGoalStats`.
        flach
          ? "group border-t border-hairline pt-1"
          : "group rounded-xl border border-hairline bg-surface-raised p-3"
      }
    >
      <summary
        className={
          "flex cursor-pointer list-none flex-wrap gap-2 text-sm font-semibold text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent " +
          (flach ? "min-h-9 content-center items-center" : "items-baseline")
        }
      >
        <span aria-hidden="true" className="text-ink-muted transition group-open:rotate-90">
          ▸
        </span>
        {/*
          B7 (Johannes, 11.09.2026): Der Hinweis, dass die Kurve nicht nur
          steigt, hängt an der Überschrift selbst - dort liest man ihn, bevor
          man sich über eine sinkende Kurve wundert.
        */}
        {/*
          ★★★ DIE ÜBERSCHRIFT BLEIBT (Prüfung E4, 11.09.2026) - dieselbe
          Begründung wie beim Wochenziel-Kasten: Ohne `h3` wäre „Steigerung im
          Verlauf" für die Screenreader-Taste „h" nicht mehr vorhanden. Eine
          Überschrift in der `<summary>` ist erlaubt und nimmt der
          Zusammenfassung ihre „zu"/„auf"-Ansage nicht.
        */}
        <h3 className="m-0 text-sm font-semibold text-ink">
          <Hinweisflaeche hilfe={hinweis} className="inline-flex">
            {t.titel}
          </Hinweisflaeche>
        </h3>
        <span className="font-normal text-ink-muted">· {stand}</span>
        {showLevel && (
          <span className="font-normal text-ink-muted">
            {t.stufe(Math.min(level, LEVEL_MAX), LEVEL_MAX)}
          </span>
        )}
      </summary>

      <div className="mt-2">
        {imp ? (
          <>
            <div
              className={
                "grid grid-cols-2 gap-2 " + (showLevel ? "sm:grid-cols-3" : "")
              }
            >
              <div
                className="rounded-lg bg-surface-sunken px-3 py-2"
                role="group"
                aria-label={t.tempoName(Math.round(imp.cpmStart), Math.round(imp.cpmNow), fmtDeltaCpm(imp.cpmDelta))}
              >
                <p className="m-0 text-sm text-ink-muted" aria-hidden="true">{t.tempoKopf}</p>
                <p className="m-0 font-semibold text-ink" aria-hidden="true">
                  {Math.round(imp.cpmStart)} → {Math.round(imp.cpmNow)}{" "}
                  <span
                    className={
                      imp.cpmDelta >= 0 ? "text-success" : "text-danger"
                    }
                  >
                    ({fmtDeltaCpm(imp.cpmDelta)})
                  </span>
                </p>
              </div>
              <div
                className="rounded-lg bg-surface-sunken px-3 py-2"
                role="group"
                aria-label={t.trefferName(fmtPercent(imp.accStart, sprache), fmtPercent(imp.accNow, sprache), fmtDeltaPct(imp.accDelta, sprache))}
              >
                <p className="m-0 text-sm text-ink-muted" aria-hidden="true">{t.trefferKopf}</p>
                <p className="m-0 font-semibold text-ink" aria-hidden="true">
                  {fmtPercent(imp.accStart, sprache)} → {fmtPercent(imp.accNow, sprache)}{" "}
                  <span
                    className={
                      imp.accDelta >= 0 ? "text-success" : "text-danger"
                    }
                  >
                    ({fmtDeltaPct(imp.accDelta, sprache)})
                  </span>
                </p>
              </div>
              {showLevel && (
                <div
                  className="rounded-lg bg-surface-sunken px-3 py-2"
                  role="group"
                  aria-label={t.stufeName(
                    imp.levelStart,
                    imp.levelNow,
                    `${imp.levelNow - imp.levelStart >= 0 ? "+" : ""}${imp.levelNow - imp.levelStart}`,
                  )}
                >
                  <p className="m-0 text-sm text-ink-muted" aria-hidden="true">{t.stufeKopf}</p>
                  <p className="m-0 font-semibold text-ink" aria-hidden="true">
                    {imp.levelStart} → {imp.levelNow}{" "}
                    <span
                      className={
                        imp.levelNow >= imp.levelStart ? "text-success" : "text-danger"
                      }
                    >
                      ({imp.levelNow - imp.levelStart >= 0 ? "+" : ""}
                      {imp.levelNow - imp.levelStart})
                    </span>
                  </p>
                </div>
              )}
            </div>
            <div className="mt-2">
              <Sparkline values={rs.map((r) => r.cpm)} />
              <p className="m-0 text-sm text-ink-muted">
                {t.ueberRunden(imp.rounds, Math.round(imp.bestCpm))}
              </p>
              {/* B7: derselbe Hinweis noch einmal, als Satz - für die
                  Braillezeile, die keinen Mouseover kennt. */}
              <p className="m-0 mt-1 text-sm text-ink-muted">{hinweis}</p>
            </div>
          </>
        ) : (
          <p className="m-0 text-sm text-ink-muted">{t.leer(selfView, name?.trim() ?? "")}</p>
        )}
      </div>
    </details>
  );
}
