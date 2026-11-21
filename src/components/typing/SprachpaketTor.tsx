/**
 * ★★★ DAS TOR VOR DEM ÜBEN - erst die Sprachpakete, dann die Übung (28.09.2026).
 *
 * Seit Tastenflow die Texte je Sprache nachlädt (`lib/typing/sprachpakete.ts`),
 * darf nichts, was Texte braucht, vor seinen Paketen anlaufen: Eine Übung aus
 * einer halb geladenen Sprache wäre eine falsche Übung (oder gar eine aus einer
 * anderen Sprache). Dieses Tor zeigt seinen Inhalt erst, wenn alle verlangten
 * Pakete da sind.
 *
 * Was ein Mensch davon merkt:
 *  - WARTEN: dieselbe ruhige Statusanzeige wie beim Nachladen einer Seite
 *    (`WarteAnzeige`, `role="status"`), kein Fokus-Sprung, in der
 *    Bedienungssprache. Ist das Paket schon da (der Normalfall nach dem ersten
 *    Mal), gibt es gar kein Warten - der Inhalt steht sofort.
 *  - FOKUS DANACH: War der Fokus während des Wartens verloren (er stand im
 *    Inhalt, der dem Warten weichen musste, oder nirgends), führt
 *    `fokusNachWarten` ihn dorthin, wo es weitergeht - vor dem Üben ist das
 *    das Übungsfeld. Der Inhalt setzt seinen Fokus danach wie immer selbst
 *    (seine Effekte laufen NACH diesem).
 *  - FEHLER (Netz weg): ein Satz und „Neu laden", wie bei einer Seite, die
 *    sich nicht laden liess (`NachladeFehlerAnzeige`) - nie ein leerer
 *    Bildschirm, nie eine Übung aus einer anderen Sprache.
 */
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import type { Lang } from "@/lib/typing/account";
import {
  ALLE_SPRACHPAKETE,
  abonniereSprachpakete,
  ladeSprachpakete,
  sprachpaketStand,
  sprachpaketeGeladen,
} from "@/lib/typing/sprachpakete";
import { NachladeFehlerAnzeige, WarteAnzeige } from "@/lib/seiteNachladen";
import type { BedienSprache } from "@/lib/bedienSprache";

const FEHLER_TEXT: Record<BedienSprache, { satz: string; knopf: string }> = {
  de: {
    satz: "Die Übungstexte ließen sich gerade nicht laden - vielleicht war die Verbindung kurz weg.",
    knopf: "Neu laden",
  },
  en: {
    satz: "The practice texts could not be loaded just now - perhaps the connection dropped for a moment.",
    knopf: "Reload",
  },
  fr: {
    satz: "Les textes d'entrainement n'ont pas pu être chargés - la connexion a peut-être été coupée un instant.",
    knopf: "Recharger",
  },
  es: {
    satz: "No se pudieron cargar los textos de práctica - quizá la conexión se cortó un momento.",
    knopf: "Volver a cargar",
  },
  // ★ O-IT (02.10.2026).
  it: {
    satz: "Non è stato possibile caricare i testi di esercizio - forse la connessione si è interrotta per un attimo.",
    knopf: "Ricarica",
  },
  // ★ O-PL (02.10.2026): -no-Form, ohne Geschlecht (Glossar Regel 2); „Odśwież" (Regel 12).
  pl: {
    satz: "Nie udało się teraz wczytać tekstów do ćwiczeń - może połączenie na chwilę się zerwało.",
    knopf: "Odśwież",
  },
  // ★ O-TR (02.10.2026): unpersönlich (Passiv), Knopf als blosser Stamm (Glossar Regel 1, 10).
  tr: {
    satz: "Alıştırma metinleri şu an yüklenemedi - bağlantı bir anlığına kopmuş olabilir.",
    knopf: "Yenile",
  },
  // ★ O-CS (03.10.2026): „se nepodařilo" - ohne Geschlecht (Glossar Regel 2); Knopf im Infinitiv (Regel 10).
  cs: {
    satz: "Texty na cvičení se teď nepodařilo načíst - možná na chvíli vypadlo připojení.",
    knopf: "Načíst znovu",
  },
  // ★ O2-COMP (30.10.2026): bg eigene Fassung.
  bg: {
      satz: "Текстовете за упражнения не успяха да се заредят - може би връзката е прекъснала за момент.",
      knopf: "Зареди отново",
    },
  // ★ O2-COMP (30.10.2026): el eigene Fassung.
  el: {
      satz: "Δεν ήταν δυνατή η φόρτωση των κειμένων εξάσκησης αυτή τη στιγμή - ίσως η σύνδεση διακόπηκε για λίγο.",
      knopf: "Ανανέωση",
    },
  // ★ O2-COMP (30.10.2026): hu eigene Fassung.
  hu: {
      satz: "A gyakorlószövegeket most nem sikerült betölteni - talán egy pillanatra megszakadt a kapcsolat.",
      knopf: "Újratöltés",
    },
  // ★ O2-COMP (30.10.2026): nl eigene Fassung.
  nl: {
      satz: "De oefenteksten konden net niet worden geladen - misschien was de verbinding even weg.",
      knopf: "Opnieuw laden",
    },
  // ★ O2-COMP (30.10.2026): pt eigene Fassung.
  pt: {
      satz: "Não foi possível carregar os textos de prática agora - talvez a ligação tenha falhado por um momento.",
      knopf: "Tentar outra vez",
    },
  // ★ O2-COMP (30.10.2026): br eigene Fassung.
  br: {
      satz: "Não foi possível carregar os textos de prática agora - talvez a conexão tenha caído por um momento.",
      knopf: "Recarregar",
    },
  // ★ O2-COMP (30.10.2026): ro eigene Fassung.
  ro: {
      satz: "Textele de exersat nu s-au putut încărca acum - poate conexiunea a căzut pentru scurt timp.",
      knopf: "Reîncărcați",
    },
  // ★ O2-COMP (30.10.2026): sv eigene Fassung.
  sv: {
      satz: "Det gick inte att läsa in övningstexterna just nu - kanske var anslutningen borta en stund.",
      knopf: "Läs in igen",
    },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: {
      satz: "Тексти для вправ зараз не вдалося завантажити - можливо, на мить зник зв'язок.",
      knopf: "Оновити",
    },
};

/** Zeichnet neu, sobald ein Sprachpaket dazukommt. */
export function useSprachpaketStand(): number {
  return useSyncExternalStore(abonniereSprachpakete, sprachpaketStand, sprachpaketStand);
}

export interface SprachpaketTorProps {
  /** Die Sprachen, die der Inhalt braucht (meist `sprachPaketeFuer(weg, sprache)`). */
  sprachen: readonly Lang[];
  /**
   * Nach dem Laden von `sprachen` gefragt: Braucht der Inhalt doch ALLE
   * Pakete? (Eine Statistik, deren Fortschritt eine Serie aus einer anderen
   * Sprache nennt.) Dann wird weiter gewartet, bis alle da sind.
   */
  alleWenn?: () => boolean;
  /** Wohin der Fokus nach einem Warten geht, wenn er verloren war. */
  fokusNachWarten?: () => void;
  children: ReactNode;
}

export function SprachpaketTor({ sprachen, alleWenn, fokusNachWarten, children }: SprachpaketTorProps) {
  useSprachpaketStand();
  const basisDa = sprachpaketeGeladen(sprachen);
  const brauchtAlle = basisDa && !!alleWenn && !sprachpaketeGeladen(ALLE_SPRACHPAKETE) && alleWenn();
  const noetig = brauchtAlle ? ALLE_SPRACHPAKETE : sprachen;
  const bereit = sprachpaketeGeladen(noetig);
  const schluessel = noetig.join(",");

  const [fehler, setFehler] = useState<string | null>(null);
  useEffect(() => {
    if (bereit) return;
    let aktiv = true;
    ladeSprachpakete(noetig).catch(() => {
      if (aktiv) setFehler(schluessel);
    });
    return () => {
      aktiv = false;
    };
    // `noetig` steckt in `schluessel`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schluessel, bereit]);

  const gewartet = useRef(false);
  if (!bereit) {
    if (fehler === schluessel) return <NachladeFehlerAnzeige texte={FEHLER_TEXT} />;
    return <Warten gewartet={gewartet} />;
  }
  return (
    <>
      <NachDemWarten gewartet={gewartet} fokus={fokusNachWarten} />
      {children}
    </>
  );
}

function Warten({ gewartet }: { gewartet: { current: boolean } }) {
  useEffect(() => {
    gewartet.current = true;
  }, [gewartet]);
  return <WarteAnzeige />;
}

/**
 * Steht VOR dem Inhalt: Seine Effekte laufen vor denen des Inhalts - wer
 * seinen Fokus selbst setzt (das Übungsfeld), hat das letzte Wort.
 */
function NachDemWarten({
  gewartet,
  fokus,
}: {
  gewartet: { current: boolean };
  fokus?: () => void;
}) {
  useEffect(() => {
    if (!gewartet.current) return;
    gewartet.current = false;
    const aktiv = typeof document !== "undefined" ? document.activeElement : null;
    const verloren = !aktiv || aktiv === document.body;
    if (verloren) fokus?.();
  });
  return null;
}
