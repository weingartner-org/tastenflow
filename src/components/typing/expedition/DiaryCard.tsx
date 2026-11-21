/**
 * Expeditionstagebuch (Bauplan §4.7, E7) — das Blatt, das VOR JEDER Zone die Reise anhält
 * (Johannes' Auflage): Zonenname + Aufgabe in einem Satz + ein Beispiel. Rein präsentational
 * und bewusst `aria-hidden`: Ansage (Doppelsprech-Regel), Leertaste-Start und Escape-Zurück
 * steuert die Bühne über ihren nativen keydown-Listener und die eine Live-Region (§7 / §2.1
 * der Übergabe — React-onKeyDown feuert im body-Portal nicht). Der geschützte Probe-Schritt
 * beim Erstbesuch (Zeit läuft nicht, kann nicht scheitern) steckt im Spiel-Hook.
 */
import { texte, useBedienSprache } from "@/lib/bedienSprache";

interface DiaryCardProps {
  /** Anzeigename der Zone (aus EXPEDITION_ZONES). */
  zoneName: string;
  /** Aufgabe in einem Satz (texts.ts, je Zielgruppe). */
  task: string;
  /** Ein Beispiel (texts.ts) — nie ein echtes Rätselwort (§7). */
  example: string;
  /** Erstbesuch → Hinweis auf den geschützten Probe-Schritt. */
  firstVisit: boolean;
  /** Position in der Reise (für „Zone i von N"). */
  index: number;
  total: number;
}

/**
 * ★ Das Tagebuch-Blatt in beiden Bedienungssprachen (EN3, 19.09.2026).
 * Deutsch wortgleich wie vorher. Glossar §3.6: *expedition diary*; Leertaste
 * ⇒ *Space bar* ★ (hier als Tastenname auf der Kappe groß).
 */
export const TAGEBUCH_TEXTE = texte({
  de: {
    kopf: (nr: number, gesamt: number) => ["📖 Expeditionstagebuch · Zone ", nr, " von ", gesamt],
    beispiel: "Beispiel: ",
    probe: "🧭 Zum Ausprobieren: Der erste Schritt ist geschützt - hier kann nichts schiefgehen.",
    leertaste: "Leertaste",
    escTaste: "Esc",
    startet: " startet · ",
    beendet: " beendet die Reise",
  },
  en: {
    kopf: (nr: number, gesamt: number) => ["📖 Expedition diary · Zone ", nr, " of ", gesamt],
    beispiel: "Example: ",
    probe: "🧭 Have a go: the first step is protected - nothing can go wrong here.",
    leertaste: "Space bar",
    escTaste: "Esc",
    startet: " starts · ",
    beendet: " ends the journey",
  },
  fr: {
    kopf: (nr: number, gesamt: number) => ["📖 Journal de l'Expédition - Zone ", nr, " sur ", gesamt],
    beispiel: "Exemple : ",
    probe: "🧭 Pour essayer : le premier pas est protégé - rien ne peut mal tourner ici.",
    leertaste: "Espace",
    // ★ E11a-5: die Taste heisst auf französischen Tastaturen „Échap" (Glossar §9.2) -
    // vorher stand für alle drei Sprachen fest „Esc" im JSX.
    escTaste: "Échap",
    startet: " lance - ",
    beendet: " termine le voyage",
  },
  es: {
    kopf: (nr: number, gesamt: number) => ["📖 Diario de la Expedición - Zona ", nr, " de ", gesamt],
    beispiel: "Ejemplo: ",
    probe: "🧭 Para probar: el primer paso está protegido - aquí no puede salir nada mal.",
    leertaste: "Barra espaciadora",
    escTaste: "Esc",
    startet: " empieza - ",
    beendet: " termina el viaje",
  },
  // ★ O-IT (02.10.2026): „diario di spedizione", „tappa" (Glossar §2.3).
  it: {
    kopf: (nr: number, gesamt: number) => ["📖 Diario di spedizione - Tappa ", nr, " di ", gesamt],
    beispiel: "Esempio: ",
    probe: "🧭 Per provare: il primo passo è protetto - qui non può andare storto niente.",
    leertaste: "Barra spaziatrice",
    escTaste: "Esc",
    startet: " inizia - ",
    beendet: " finisce il viaggio",
  },
  // ★ O-PL (02.10.2026): „dziennik wyprawy", „etap" (Glossar §2.3); Kappe „Spacja".
  pl: {
    kopf: (nr: number, gesamt: number) => ["📖 Dziennik wyprawy - Etap ", nr, " z ", gesamt],
    beispiel: "Przykład: ",
    probe: "🧭 Na próbę: pierwszy krok jest chroniony - tu nic nie może pójść źle.",
    leertaste: "Spacja",
    escTaste: "Esc",
    startet: " zaczyna - ",
    beendet: " kończy wyprawę",
  },
  // ★ O-TR (02.10.2026): "keşif günlüğü", "aşama" (Glossar §2.3); "Aşama 2, toplam 6"
  // (Regel 6); Kappe "boşluk çubuğu" (Glossar §2.9), Satzbau "<Taste> başlatır".
  tr: {
    kopf: (nr: number, gesamt: number) => ["📖 Keşif günlüğü - Aşama ", nr, ", toplam ", gesamt],
    beispiel: "Örnek: ",
    probe: "🧭 Denemek için: ilk adım korumalı - burada hiçbir şey ters gidemez.",
    leertaste: "Boşluk çubuğu",
    escTaste: "Esc",
    startet: " başlatır - ",
    beendet: " yolculuğu bitirir",
  },
  // ★ O-CS (03.10.2026): „deník výpravy", „etapa", „Etapa 3/6" (Glossar §2.3, Regel 13);
  // Kappe „Mezerník" (Glossar §2.9), Satzbau „<Taste> spouští".
  cs: {
    kopf: (nr: number, gesamt: number) => ["📖 Deník výpravy - Etapa ", nr, "/", gesamt],
    beispiel: "Příklad: ",
    probe: "🧭 Zkus si to: první krok je chráněný - tady se nic pokazit nemůže.",
    leertaste: "Mezerník",
    escTaste: "Esc",
    startet: " spouští - ",
    beendet: " ukončuje výpravu",
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      kopf: (nr: number, gesamt: number) => ["📖 Дневник на експедицията · Етап ", nr, "/", gesamt],
      beispiel: "Пример: ",
      probe: "🧭 За опитване: първата стъпка е защитена - тук нищо не може да се обърка.",
      leertaste: "Интервал",
      escTaste: "Esc",
      startet: " започва · ",
      beendet: " прекратява пътуването",
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      // Zone = σταθμός (Glossar §2.3 „Etappe (Expedition)").
      kopf: (nr: number, gesamt: number) => ["📖 Ημερολόγιο εξερεύνησης · Σταθμός ", nr, " από ", gesamt],
      beispiel: "Παράδειγμα: ",
      probe: "🧭 Δοκίμασε: το πρώτο βήμα είναι προστατευμένο - εδώ δεν μπορεί να πάει τίποτα στραβά.",
      leertaste: "Πλήκτρο διαστήματος",
      escTaste: "Esc",
      startet: " ξεκινά · ",
      beendet: " τερματίζει το ταξίδι",
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      kopf: (nr: number, gesamt: number) => ["📖 Expedíciós napló · Szakasz: ", nr, "/", gesamt],
      beispiel: "Példa: ",
      probe: "🧭 Próbáld ki: az első lépés védett - itt semmi sem romolhat el.",
      leertaste: "Szóköz",
      escTaste: "Esc",
      startet: ": indítás · ",
      beendet: ": kilépés az expedícióból",
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      // Glossar §2.3: die Zonen der Expedition heißen „etappe" („Etappe 3 van 6").
      kopf: (nr: number, gesamt: number) => ["📖 Expeditiedagboek · Etappe ", nr, " van ", gesamt],
      beispiel: "Voorbeeld: ",
      probe: "🧭 Om uit te proberen: de eerste stap is beschermd - hier kan niets misgaan.",
      leertaste: "Spatiebalk",
      escTaste: "Esc",
      startet: " start · ",
      beendet: " beëindigt de tocht",
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      kopf: (nr: number, gesamt: number) => ["📖 Diário da expedição · Etapa ", nr, " de ", gesamt],
      beispiel: "Exemplo: ",
      probe: "🧭 Para experimentar: o primeiro passo está protegido - aqui nada pode correr mal.",
      leertaste: "Barra de espaço",
      escTaste: "Esc",
      startet: " começa · ",
      beendet: " termina a viagem",
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      // Glossar §2.3: Zone der Expedition = „etapa".
      kopf: (nr: number, gesamt: number) => ["📖 Diário da expedição · Etapa ", nr, " de ", gesamt],
      beispiel: "Exemplo: ",
      probe: "🧭 Para experimentar: o primeiro passo é protegido - aqui nada pode dar errado.",
      leertaste: "Barra de espaço",
      escTaste: "Esc",
      startet: " começa · ",
      beendet: " encerra a viagem",
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      kopf: (nr: number, gesamt: number) => ["📖 Jurnalul expediției · Etapa ", nr, "/", gesamt],
      beispiel: "Exemplu: ",
      probe: "🧭 De încercat: primul pas este protejat - aici nu se poate întâmpla nimic rău.",
      leertaste: "Bara de spațiu",
      escTaste: "Esc",
      startet: " pornește · ",
      beendet: " încheie călătoria",
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      kopf: (nr: number, gesamt: number) => ["📖 Expeditionsdagbok · Etapp ", nr, " av ", gesamt],
      beispiel: "Exempel: ",
      probe: "🧭 Prova: det första steget är skyddat - här kan inget gå fel.",
      leertaste: "Mellanslag",
      escTaste: "Esc",
      startet: " börjar · ",
      beendet: " avslutar resan",
    },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: {
      kopf: (nr: number, gesamt: number) => ["📖 Щоденник експедиції · Зона ", nr, "/", gesamt],
      beispiel: "Приклад: ",
      probe: "🧭 Спробуй: перший крок захищений - тут нічого не може піти не так.",
      leertaste: "Пробіл",
      escTaste: "Esc",
      startet: " починає · ",
      beendet: " завершує подорож",
    },
});

export function DiaryCard({ zoneName, task, example, firstVisit, index, total }: DiaryCardProps) {
  const { sprache } = useBedienSprache();
  const t = TAGEBUCH_TEXTE[sprache];
  return (
    <div className="px-diary" aria-hidden="true">
      <div className="px-diary__page">
        <p className="px-diary__eyebrow">{t.kopf(index + 1, total)}</p>
        <h2 className="px-diary__zone">{zoneName}</h2>
        <p className="px-diary__task">{task}</p>
        <p className="px-diary__example">
          {t.beispiel}
          {example}
        </p>
        {firstVisit && <p className="px-diary__probe">{t.probe}</p>}
        <p className="px-diary__hint">
          <kbd>{t.leertaste}</kbd>
          {t.startet}
          <kbd>{t.escTaste}</kbd>
          {t.beendet}
        </p>
      </div>
    </div>
  );
}
