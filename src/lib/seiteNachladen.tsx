/**
 * ★★★ SEITEN ERST LADEN, WENN IHRE ADRESSE AUFGERUFEN WIRD (28.09.2026)
 * ============================================================================
 * Auftrag Johannes: *„wenn spanisch geändert wird muss sich französisch nicht
 * neu laden!"* - bis dahin steckten alle Programme in EINER Datei (12,3 MB),
 * und jeder Deploy liess jeden Besucher alles neu laden. Jetzt lädt `App.tsx`
 * jede Seite über `faul(...)`: Wer Tastenflow öffnet, bekommt Tastenflow, nicht
 * »Im Griff«, Punktgenau und die Uni-Welt dazu. Die Aufteilung der Dateien
 * selbst steht in `scripts/buendel-aufteilung.ts`.
 *
 * Was sich für Menschen NICHT ändern darf, und wie es gehalten wird:
 *  - FOKUS: `FocusOnRouteChange` setzt den Fokus auf `#seitentitel`, sobald
 *    sich die Adresse ändert. Muss die Seite erst nachgeladen werden, gibt es
 *    in diesem Augenblick noch keinen Titel - der Fokus ginge verloren. Darum
 *    holt `NachDemLaden` genau diesen Schritt nach, und NUR wenn wirklich
 *    gewartet wurde (sonst stähle es bei `?reiter=`-Wechseln den Fokus, die
 *    die Seite neu einhängen, ohne dass sich der Pfad ändert). Es steht VOR
 *    der Seite, damit Seiten, die ihren Fokus selbst setzen (die
 *    Übungszeile), wie bisher das letzte Wort haben.
 *  - WARTEN: nur eine ruhige Statusanzeige (`role="status"`), kein Fokus, in
 *    der Bedienungssprache.
 *  - ALTE TABS: siehe `nachladeFehlerAbfangen` unten.
 */
import {
  Component,
  Suspense,
  lazy,
  useEffect,
  useRef,
  type ComponentProps,
  type ComponentType,
  type MutableRefObject,
  type ReactNode,
} from "react";
import { fokusAufSeitentitel } from "@/lib/a11y";
import { useBedienSprache, type BedienSprache } from "@/lib/bedienSprache";

const WARTE_TEXT: Record<BedienSprache, string> = {
  de: "Wird geladen …",
  en: "Loading …",
  fr: "Chargement …",
  es: "Cargando …",
  it: "Caricamento in corso...",
  // ★ O-PL (02.10.2026).
  pl: "Wczytywanie...",
  // ★ O-TR (02.10.2026): "Açılıyor..." statt "Yükleniyor..." - "yükle" heisst
  // auch hochladen und installieren (Glossar Regel 10, §4 Nr. 8).
  tr: "Açılıyor...",
  // ★ O-CS (03.10.2026): wie `EigenerTextQuelle.tsx` ("Načítání...").
  cs: "Načítání...",
  bg: "Зареждане...",
  el: "Φόρτωση...",
  hu: "Betöltés...",
  nl: "Laden...",
  pt: "A carregar...",
  br: "Carregando...",
  ro: "Se încarcă...",
  sv: "Läser in...",
  uk: "Завантаження...",
};

function Warten({ gewartet }: { gewartet: MutableRefObject<boolean> }) {
  useEffect(() => {
    gewartet.current = true;
  }, [gewartet]);
  return <WarteAnzeige />;
}

/**
 * Die ruhige Statusanzeige beim Warten - auch für die Sprachpakete
 * (`components/typing/SprachpaketTor.tsx`, 28.09.2026): kein Fokus, kein
 * Aufblitzen, der Satz in der Bedienungssprache.
 */
export function WarteAnzeige() {
  const { sprache } = useBedienSprache();
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 py-16 text-ink-muted"
      role="status"
      aria-live="polite"
    >
      <span
        className="h-8 w-8 rounded-full border-[3px] border-hairline border-t-accent animate-spin motion-reduce:animate-none"
        aria-hidden="true"
      />
      <span>{WARTE_TEXT[sprache] ?? WARTE_TEXT.de}</span>
    </div>
  );
}

const FEHLER_TEXT: Record<BedienSprache, { satz: string; knopf: string }> = {
  de: {
    satz: "Diese Seite ließ sich gerade nicht laden - vielleicht war die Verbindung kurz weg.",
    knopf: "Neu laden",
  },
  en: {
    satz: "This page could not be loaded just now - perhaps the connection dropped for a moment.",
    knopf: "Reload",
  },
  fr: {
    satz: "Cette page n'a pas pu être chargée - la connexion a peut-être été coupée un instant.",
    knopf: "Recharger",
  },
  es: {
    satz: "No se pudo cargar esta página - quizá la conexión se cortó un momento.",
    knopf: "Volver a cargar",
  },
  // ★ O-IT (02.10.2026).
  it: {
    satz: "Non è stato possibile caricare questa pagina - forse la connessione si è interrotta per un attimo.",
    knopf: "Ricarica",
  },
  // ★ O-PL (02.10.2026).
  pl: {
    satz: "Nie udało się teraz wczytać tej strony - może połączenie na chwilę zniknęło.",
    knopf: "Odśwież",
  },
  // ★ O-TR (02.10.2026): "açılamadı" wie oben (nicht "yüklenemedi"); Knopf "Yenile".
  tr: {
    satz: "Bu sayfa şu an açılamadı - bağlantı bir anlığına kesilmiş olabilir.",
    knopf: "Yenile",
  },
  // ★ O-CS (03.10.2026): "se nepodařilo" - unpersönlich; Knopf "Obnovit" (Glossar Regel 10).
  cs: {
    satz: "Tuto stránku se teď nepodařilo načíst - možná na chvíli vypadlo připojení.",
    knopf: "Obnovit",
  },
  bg: {
    satz: "Тази страница не можа да се зареди - може би връзката прекъсна за малко.",
    knopf: "Обнови",
  },
  el: {
    satz: "Δεν ήταν δυνατή η φόρτωση αυτής της σελίδας μόλις τώρα - ίσως η σύνδεση χάθηκε για λίγο.",
    knopf: "Ανανέωση",
  },
  hu: {
    satz: "Ezt az oldalt most nem sikerült betölteni - talán egy pillanatra megszakadt a kapcsolat.",
    knopf: "Újratöltés",
  },
  nl: {
    satz: "Deze pagina kon nu niet worden geladen - misschien was de verbinding even weg.",
    knopf: "Opnieuw laden",
  },
  pt: {
    satz: "Não foi possível carregar esta página - talvez a ligação tenha falhado por momentos.",
    knopf: "Atualizar",
  },
  br: {
    satz: "Não foi possível carregar esta página agora - talvez a conexão tenha caído por um momento.",
    knopf: "Recarregar",
  },
  ro: {
    satz: "Această pagină nu s-a putut încărca acum - poate conexiunea s-a întrerupt pentru scurt timp.",
    knopf: "Reîmprospătați",
  },
  sv: {
    satz: "Det gick inte att läsa in sidan just nu - kanske bröts anslutningen en kort stund.",
    knopf: "Läs in igen",
  },
  uk: {
    satz: "Цю сторінку зараз не вдалося завантажити - можливо, на мить зникло з'єднання.",
    knopf: "Оновити",
  },
};

/**
 * ★ Was steht da, wenn das Nachladen trotzdem scheitert (28.09.2026)?
 * Ohne diese Fangstelle wäre der Bildschirm LEER - die ganze App ausgehängt,
 * für eine Sprachausgabe gar nichts. Jetzt: ein Satz und ein Knopf. Der Fokus
 * geht auf den Satz (die Sprachausgabe liest ihn), der Knopf folgt mit Tab.
 * Bewusst KEIN Live-Bereich: die Braillezeile springt nicht.
 */
export function NachladeFehlerAnzeige({
  texte = FEHLER_TEXT,
}: {
  /** Eigener Wortlaut je Bedienungssprache (Sprachpakete: „Die Übungstexte …"). */
  texte?: Record<BedienSprache, { satz: string; knopf: string }>;
} = {}) {
  const { sprache } = useBedienSprache();
  const t = texte[sprache] ?? texte.de;
  const satz = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    satz.current?.focus({ preventScroll: true });
  }, []);
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-16 text-center text-ink">
      <p ref={satz} tabIndex={-1} className="m-0 text-lg">
        {t.satz}
      </p>
      <button type="button" className="btn-primary" onClick={() => window.location.reload()}>
        {t.knopf}
      </button>
    </div>
  );
}

class NachladeFangstelle extends Component<{ children: ReactNode }, { fehler: boolean }> {
  state = { fehler: false };
  static getDerivedStateFromError() {
    return { fehler: true };
  }
  render() {
    return this.state.fehler ? <NachladeFehlerAnzeige /> : this.props.children;
  }
}

function NachDemLaden({ gewartet }: { gewartet: MutableRefObject<boolean> }) {
  useEffect(() => {
    if (!gewartet.current) return;
    gewartet.current = false;
    fokusAufSeitentitel();
  }, [gewartet]);
  return null;
}

/** Eine nachgeladene Seite - dazu `vorladen()`, um ihre Datei früh anzufordern. */
export type FaulGeladen<T extends ComponentType<any>> = ComponentType<ComponentProps<T>> & {
  vorladen: () => Promise<unknown>;
};

/**
 * Eine Seite, die erst beim ersten Aufruf ihrer Adresse geladen wird.
 *
 *   const MeineSeite = faul(() => import("@/features/x/MeineSeite").then((m) => ({ default: m.MeineSeite })));
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function faul<T extends ComponentType<any>>(
  laden: () => Promise<{ default: T }>,
): FaulGeladen<T> {
  const Seite = lazy(laden);
  function Nachgeladen(props: ComponentProps<T>) {
    const gewartet = useRef(false);
    return (
      <NachladeFangstelle>
        <Suspense fallback={<Warten gewartet={gewartet} />}>
          <NachDemLaden gewartet={gewartet} />
          <Seite {...props} />
        </Suspense>
      </NachladeFangstelle>
    );
  }
  return Object.assign(Nachgeladen, { vorladen: laden });
}

/**
 * Die Datei der Seite schon anfordern, während die App noch startet (Anmeldung
 * prüfen) - sonst käme sie erst danach, eins nach dem anderen.
 */
export function vorladen(elemente: readonly unknown[]): void {
  for (const e of elemente) {
    const typ = (e as { type?: { vorladen?: () => Promise<unknown> } } | null)?.type;
    if (typeof typ?.vorladen === "function") void typ.vorladen().catch(() => {});
  }
}

/**
 * ★★ EIN TAB, DER VOR EINEM DEPLOY OFFEN WAR.
 *
 * Er kennt noch die alten Dateinamen. Der Deploy lädt `assets/` zwar additiv
 * hoch (alte Dateien bleiben liegen), aber wenn eine Datei doch nicht mehr da
 * ist oder das Netz kurz weg war, scheitert das Nachladen einer Seite. Vite
 * meldet das als Ereignis `vite:preloadError`. Dann EINMAL neu laden - die
 * neue index.html kennt die neuen Namen.
 *
 * ⚠️ Nur einmal je 30 Sekunden (Merker in `sessionStorage`): Scheitert es auch
 *    nach dem Neuladen (Server weg, kein Netz), darf das keine Endlosschleife
 *    werden - dann bleibt der Fehler stehen, wie er ohne diese Hilfe stünde.
 */
export const NACHLADE_MERKER = "sensorik:nachladen-neu-geladen";
const SPERRE_MS = 30_000;

export function nachladeFehlerAbfangen(
  fenster: Pick<Window, "addEventListener" | "sessionStorage"> & {
    location: Pick<Location, "reload">;
  } = window,
  jetzt: () => number = () => Date.now(),
): void {
  fenster.addEventListener("vite:preloadError", (ereignis) => {
    let zuletzt = 0;
    try {
      zuletzt = Number(fenster.sessionStorage.getItem(NACHLADE_MERKER) ?? 0);
    } catch {
      /* kein sessionStorage (privater Modus) - dann gilt „noch nie" */
    }
    if (jetzt() - zuletzt < SPERRE_MS) return; // schon versucht: Fehler stehen lassen
    try {
      fenster.sessionStorage.setItem(NACHLADE_MERKER, String(jetzt()));
    } catch {
      // Ohne Merker gäbe es keinen Schutz gegen die Schleife - dann lieber
      // gar nicht neu laden.
      return;
    }
    ereignis.preventDefault();
    fenster.location.reload();
  });
}
