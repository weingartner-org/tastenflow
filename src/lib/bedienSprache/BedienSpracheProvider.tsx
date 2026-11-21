/**
 * ★★ DIE BEDIENUNGSSPRACHE FÜR REACT - Provider + `useBedienSprache()`.
 *
 * ★★★ OHNE PROVIDER GILT DEUTSCH. `AppKopfzeile`, `StandZeile` und die übrigen
 * gemeinsamen oder mitbenutzten Bauteile fragen die Sprache über den Haken ab;
 * die anderen Apps bekommen keinen (aktiven) Provider und merken darum nichts.
 *
 * ★★★ SEIT EN0 (18.09.2026) HÄNGT DER PROVIDER EINMAL FÜR DIE GANZE APP - in
 * `Root` (`src/App.tsx`) über `TastenflowSprachBereich`
 * (`src/features/public/TastenflowSprachBereich.tsx`). Dort steht auch, welche
 * Adressen zu Tastenflow gehören. Bis dahin hing er in `TippenTrainerPage`;
 * jede Navigation hätte ihn dort neu aufgebaut (`Root` hängt
 * `key={location.key}` an die Seite), und keine andere Seite kannte die Sprache.
 * ⇒ `aktiv`: Auf allen Adressen, die NICHT zu Tastenflow gehören, liefert er
 *   genau den Wert „ohne Provider" und fasst `<html>` nicht an - die anderen
 *   Apps bleiben Zeichen für Zeichen, wie sie waren.
 *
 * ★★★ SEIT 19.09.2026 FÜR JEDEN - ohne Probe-Schalter. Auf jeder
 * Tastenflow-Adresse gilt die Sprache aus `anfangsSprache` (`sprache.ts`):
 * gemerkte Wahl, sonst Deutsch auf einem Gerät, das Tastenflow schon kennt,
 * sonst die Sprache des Browsers. Was dabei herauskommt, wird gemerkt, sobald
 * zum ersten Mal eine Tastenflow-Adresse offen ist.
 *
 * ★★ `<html lang>` FOLGT DER BEDIENUNG, solange eine Tastenflow-Adresse offen
 * ist - eine Sprachausgabe liest sonst englische Knöpfe mit deutscher
 * Aussprache. Beim Verlassen kommt der alte Wert zurück: Die übrige Plattform
 * ist deutsch, und ein SPA-Wechsel lädt `index.html` nicht neu.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useAnnounce } from "@/lib/a11y";
import {
  adressWahlLesen,
  anfangsSprache,
  browserSprachen,
  geraetKenntTastenflow,
  gespeicherteWahlRoh,
  GERUEST_SPRACHEN_BEDIENUNG,
  oberflaechenSprache,
  wahlMerken,
  type AktiveBedienSprache,
  type BedienSprache,
  type NeueSprachenAn,
} from "./sprache";

/** Wer auf den Druck auf den Sprachschalter hört - siehe {@link useBeimSprachSchalter}. */
type SchalterHorcher = (neu: AktiveBedienSprache) => void;

export interface BedienSpracheWert {
  /**
   * Die Sprache der Bedienung - ohne (aktiven) Provider immer „de". ★ E2b
   * (25.09.2026): bleibt BEWUSST {@link AktiveBedienSprache} („de"/„en") - auf
   * {@link oberflaechenSprache} abgebildet, auch wenn die WIRKLICHE Auswahl
   * „fr" ist ({@link spracheGewaehlt}). Die ~90 bestehenden Aufrufstellen
   * dieses Hakens bleiben dadurch unverändert (siehe `sprache.ts`).
   */
  sprache: AktiveBedienSprache;
  /** Umschalten und merken - OHNE Ansage und ohne die Übungssprache mitzunehmen. */
  setzeSprache: (sprache: BedienSprache) => void;
  /**
   * Gilt die Bedienungssprache hier? `true` auf jeder Tastenflow-Adresse,
   * `false` ohne Provider und auf den Adressen der anderen Apps. Nur wenn sie
   * gilt, trägt ein Bauteil seine Sprache ins DOM (`lang`) und spricht mit der
   * Stimme der Bedienung - sonst bleibt es Zeichen für Zeichen, wie es in den
   * anderen Apps immer war.
   */
  bereichAktiv: boolean;
  /**
   * DER SPRACHSCHALTER: umstellen, merken und es in der NEUEN Sprache sagen -
   * über die Stimme der App (`sprich`, falls der Provider eine bekommen hat)
   * UND die Live-Region (`announce`) nebeneinander (Regel 03.09.): Wer Vorlesen
   * aus hat und einen Screenreader benutzt, bekommt es über die Live-Region.
   * Der Fokus bleibt, wo er ist - auf dem Schalter. Danach hören alle, die sich
   * mit {@link useBeimSprachSchalter} angemeldet haben (die Übungsseite zieht
   * dort die Übungssprache nach) - MIT der oberflächen-sicheren Sprache
   * ({@link oberflaechenSprache}), auch wenn `neu` hier „fr" war (E2b).
   */
  wechsle: (neu: BedienSprache) => void;
  /**
   * Beim Sprachschalter anmelden; zurück kommt die Abmeldung. Lieber über
   * {@link useBeimSprachSchalter}.
   */
  beimSchalter: (horcher: SchalterHorcher) => () => void;
  /**
   * ★★ E2b (25.09.2026, Bauplan D9/§9.3): die TATSÄCHLICH gewählte
   * Bedienungssprache - kann „fr" sein, wenn der Probe-Schalter des
   * französischen Lehrgangs an ist UND die Person „fr" gewählt hat (oder ihr
   * Gerät/Browser sie erkannt hat, {@link erkenneBedienSprache}). NUR für den
   * Sprachwähler selbst (`AppKopfzeile.tsx`), der die aktive Sprache zeigen
   * und die Wahl entgegennehmen muss - jeder andere Verbraucher benutzt
   * weiterhin `sprache` (oben).
   */
  spracheGewaehlt: BedienSprache;
  /**
   * ★ E2b: welche Sprachen der Sprachwähler hier anbietet - `["de", "en"]`
   * ohne den französischen Schalter (heutiges Verhalten, Byte für Byte),
   * `["de", "en", "fr"]` mit ihm (`franzoesischAn`-Eigenschaft des
   * Providers). `AppKopfzeile` übernimmt das in ihre eigene `sprachen`-
   * Eigenschaft, wenn keine App sie selbst hereinreicht.
   *
   * ★ ES-F2: entsprechend `["de", "en", "es"]` bzw. `["de", "en", "fr", "es"]`
   * mit dem spanischen Schalter (`spanischAn`-Eigenschaft des Providers).
   */
  spracheOptionen: readonly BedienSprache[];
}

/** ★ E2b: die zwei Vorgabe-Sprachen - stabile Referenz für `useMemo`-Vergleiche. */
const SPRACHEN_DE_EN: readonly BedienSprache[] = ["de", "en"];

const KEINE_NEUEN: NeueSprachenAn = {};

/** Eine gemerkte it/pl/tr/cs-Wahl zählt nur mit dem Schalter ihrer Sprache (sonst: keine Wahl). */
function nurWennAn(wahl: BedienSprache | null, neueAn: NeueSprachenAn): BedienSprache | null {
  if (wahl === "it" || wahl === "pl" || wahl === "tr" || wahl === "cs") return neueAn[wahl] ? wahl : null;
  // ★ G2-NEUN (25.10.2026): ebenso jede der neun Sprachen des Gerüsts (Vorgabe aus).
  if (wahl !== null && (GERUEST_SPRACHEN_BEDIENUNG as readonly string[]).includes(wahl)) {
    return neueAn[wahl as keyof NeueSprachenAn] ? wahl : null;
  }
  return wahl;
}

const OHNE_PROVIDER: BedienSpracheWert = {
  sprache: "de",
  setzeSprache: () => {},
  bereichAktiv: false,
  wechsle: () => {},
  beimSchalter: () => () => {},
  spracheGewaehlt: "de",
  spracheOptionen: SPRACHEN_DE_EN,
};

/**
 * Der Satz nach dem Umschalten - in der Sprache, in die gewechselt wurde.
 * Steht hier und nicht bei einer Seite: Jede Tastenflow-Seite mit Kopfzeile
 * hat denselben Schalter und sagt darum denselben Satz.
 */
export const SPRACHE_GEWECHSELT: Record<BedienSprache, string> = {
  de: "Schalter und Menüs sind jetzt auf Deutsch.",
  en: "Buttons and menus are now in English.",
  // ★ E11a-5 (26.09.2026): die Oberfläche IST jetzt französisch - der Satz
  // auch (bis dahin englisch, weil die Oberfläche auf Englisch zurückfiel).
  fr: "Les boutons et les menus sont maintenant en français.",
  // ★ ES-O (27.09.2026): die Oberfläche ist jetzt spanisch - der Satz auch.
  es: "Los botones y los menús están ahora en español.",
  // ★ O-IT (02.10.2026): die Oberfläche ist jetzt italienisch - der Satz auch.
  it: "I pulsanti e i menu ora sono in italiano.",
  // ★ O-PL (02.10.2026): die Oberfläche ist jetzt polnisch - der Satz auch.
  pl: "Przyciski i menu są teraz po polsku.",
  // ★ O-TR (02.10.2026): die Oberfläche ist jetzt türkisch - der Satz auch.
  tr: "Düğmeler ve menüler artık Türkçe.",
  // ★ O-CS (03.10.2026): die Oberfläche ist jetzt tschechisch - der Satz auch.
  cs: "Tlačítka a nabídky jsou teď česky.",
  bg: "Бутоните и менютата вече са на български.",
  el: "Τα κουμπιά και τα μενού είναι τώρα στα Ελληνικά.",
  hu: "A gombok és a menük mostantól magyar nyelvűek.",
  nl: "Knoppen en menu's zijn nu in het Nederlands.",
  pt: "Os botões e menus estão agora em português.",
  br: "Botões e menus agora estão em português do Brasil.",
  ro: "Butoanele și meniurile sunt acum în limba română.",
  sv: "Knappar och menyer är nu på svenska.",
  uk: "Кнопки й меню тепер українською мовою.",
};

const BedienSpracheKontext = createContext<BedienSpracheWert>(OHNE_PROVIDER);

export interface BedienSpracheProviderProps {
  children: ReactNode;
  /**
   * Gehört die offene Adresse zu Tastenflow? Nur dann gilt die Bedienungssprache.
   * Vorgabe `true` (ein Provider, der eingehängt wird, meint es so) - `Root`
   * reicht den Wert je Adresse herein.
   */
  aktiv?: boolean;
  /**
   * Die Stimme für die Ansage des Sprachschalters, in der Zielsprache.
   * ⚠️ Hereingereicht statt hier eingebunden: `lib/bedienSprache` hängt an der
   * gemeinsamen `AppKopfzeile`; eine eigene Stimme hier zöge die Sprachausgabe
   * von Tastenflow in alle Apps.
   *
   * ★ E2b: der Parameter ist {@link BedienSprache} (kann „fr" sein) - die
   * Ansage bekommt die WIRKLICHE Zielsprache, nicht die oberflächen-sichere
   * (`SPRACHE_GEWECHSELT` unten kennt schon einen Satz für „fr").
   */
  sprich?: (satz: string, sprache: BedienSprache) => void;
  /**
   * ★ EN9 (19.09.2026): Nach jedem Umschalten über den Schalter aufgerufen -
   * Tastenflow merkt sich dort die Sprache am angemeldeten Konto, damit seine
   * Mails in ihr kommen. Aus demselben Grund wie `sprich` hereingereicht: Ein
   * Backend hier zöge Tastenflows Konten in alle Apps, die die Kopfzeile teilen.
   *
   * ★ E2b: {@link BedienSprache} - siehe `sprich`.
   */
  beimWechsel?: (neu: BedienSprache) => void;
  /**
   * ★★ E2b (25.09.2026, Bauplan D9/§9.3): ist der Probe-Schalter des
   * französischen Lehrgangs an (`franzoesischLehrgangProbeAn()`,
   * `lib/typing/lernweg.ts`)? Vorgabe `false` - ohne ihn bietet der
   * Sprachwähler wie bisher nur Deutsch/Englisch, und `?bedienung=fr` sowie
   * eine französische Browser-Sprache erreichen „fr" nicht (F16).
   *
   * ⚠️ Hereingereicht statt hier importiert: `lib/bedienSprache` bleibt ohne
   * Abhängigkeit von `lib/typing` (Kopf-Doku) - `TastenflowSprachBereich.tsx`
   * liest den Schalter und reicht ihn herein.
   */
  franzoesischAn?: boolean;
  /**
   * ★ ES-F2 (27.09.2026): derselbe Gedanke wie `franzoesischAn`, für den
   * spanischen Lehrgang (`spanischLehrgangProbeAn()`, `lib/typing/lernweg.ts`).
   * Vorgabe `false`.
   */
  spanischAn?: boolean;
  /**
   * ★ 10.10.2026 (Freigabe): welche der vier neuen Sprachen (it/pl/tr/cs) der
   * Sprachwähler anbietet - je nach `…LehrgangProbeAn()` der Sprache.
   */
  neueAn?: NeueSprachenAn;
}

export function BedienSpracheProvider({
  children,
  aktiv = true,
  sprich,
  beimWechsel,
  franzoesischAn = false,
  spanischAn = false,
  neueAn = KEINE_NEUEN,
}: BedienSpracheProviderProps) {
  // Genau EINMAL beim Einhängen gelesen: Der Adress-Zusatz steht nur in der
  // ersten Adresse, und eine Sprache, die mitten im Üben von selbst kippt,
  // wäre ein Schalter, den niemand gedrückt hat.
  // ★ Seit EN0 hängt der Provider in `Root` - „beim Einhängen" heisst also
  // „beim Laden der App", und das ist genau der Augenblick, in dem der
  // Adress-Zusatz noch in der Adresse steht - und in dem noch kein Teil von
  // Tastenflow einen Merker schreiben konnte (`geraetKenntTastenflow`).
  //
  // ★ E2b (25.09.2026): DER ROHZUSTAND - jetzt {@link BedienSprache}, kann
  // „fr" sein. `gespeicherteWahlRoh` (statt der engen `gespeicherteWahl`)
  // erkennt eine gemerkte „fr"-Wahl auch dann, wenn `franzoesischAn` gerade
  // (wieder) aus ist - eine einmal gemerkte Sprache springt nie zurück,
  // dieselbe Regel wie beim Lernweg (D2).
  const [spracheRoh, setSpracheRoh] = useState<BedienSprache>(() =>
    anfangsSprache({
      // ★ 10.10.2026: eine gemerkte it/pl/tr/cs-Wahl gilt NUR, solange der Lehrgang
      // der Sprache an ist - mit dem Not-Aus (`?<sprache>-lehrgang=0`) bleibt die
      // Oberfläche nicht in einer Sprache stehen, deren Übungsstoff nicht mehr kommt.
      gespeichert: nurWennAn(
        adressWahlLesen(undefined, undefined, franzoesischAn, spanischAn, neueAn) ?? gespeicherteWahlRoh(),
        neueAn,
      ),
      bekanntesGeraet: geraetKenntTastenflow(),
      sprachen: browserSprachen(),
      franzoesischAn,
      spanischAn,
    }),
  );
  // ★ E2b: die oberflächen-sichere Sprache - siehe `sprache.ts`. Alles, was
  // bisher `sprache` aus diesem Provider las, bekommt UNVERÄNDERT „de"/„en".
  const sprache = oberflaechenSprache(spracheRoh);
  // Die Liste in fester Reihenfolge: de, en, fr, es, it, pl, tr, cs - je nach Schalter.
  // ★ G2-NEUN (25.10.2026): dazu die neun Sprachen des Gerüsts, je nur mit ihrem Schalter (Vorgabe aus), in der
  // Reihenfolge des Registers. Ein Schlüssel aus den Schaltern hält `useMemo` stabil.
  const neueSchluessel = (["it", "pl", "tr", "cs", ...GERUEST_SPRACHEN_BEDIENUNG] as const).filter((k) => !!neueAn[k]).join(",");
  const spracheOptionen = useMemo<readonly BedienSprache[]>(() => {
    if (!franzoesischAn && !spanischAn && !neueSchluessel) return SPRACHEN_DE_EN;
    const l: BedienSprache[] = ["de", "en"];
    if (franzoesischAn) l.push("fr");
    if (spanischAn) l.push("es");
    if (neueSchluessel) l.push(...(neueSchluessel.split(",") as BedienSprache[]));
    return l;
  }, [franzoesischAn, spanischAn, neueSchluessel]);
  const announce = useAnnounce();
  const sprichRef = useRef(sprich);
  sprichRef.current = sprich;
  const beimWechselRef = useRef(beimWechsel);
  beimWechselRef.current = beimWechsel;
  const horcher = useRef(new Set<SchalterHorcher>());

  /*
   * ★★ DIE WAHL BEIM ERSTEN BESUCH MERKEN (19.09.2026) - damit sie stabil
   * bleibt: Ein bekanntes Gerät bleibt Deutsch, auch wenn morgen ein neuer
   * Merker fehlt; ein neues bleibt bei der erkannten Sprache, auch wenn es
   * dann selbst Merker hat. Erst auf einer Tastenflow-Adresse - der Speicher
   * der anderen Apps bleibt unberührt.
   */
  useEffect(() => {
    if (aktiv && gespeicherteWahlRoh() === null) wahlMerken(spracheRoh);
  }, [aktiv, spracheRoh]);

  const setzeSprache = useCallback((neu: BedienSprache) => {
    setSpracheRoh(neu);
    wahlMerken(neu);
  }, []);

  const wechsle = useCallback(
    (neu: BedienSprache) => {
      setzeSprache(neu);
      const satz = SPRACHE_GEWECHSELT[neu];
      // ★ E2b: Ansage und Konto-Merker bekommen die WIRKLICHE Zielsprache
      // (auch „fr"); die Live-Region UND jeder Horcher ({@link
      // useBeimSprachSchalter}) bekommen die oberflächen-sichere - eine
      // Übungssprache „fr" gibt es noch nicht (E11).
      sprichRef.current?.(satz, neu);
      announce(satz);
      beimWechselRef.current?.(neu);
      const sicher = oberflaechenSprache(neu);
      for (const h of [...horcher.current]) h(sicher);
    },
    [setzeSprache, announce],
  );

  const beimSchalter = useCallback((h: SchalterHorcher) => {
    horcher.current.add(h);
    return () => {
      horcher.current.delete(h);
    };
  }, []);

  /*
   * ★★★★★ E11a-5 (26.09.2026): eingetreten - `oberflaechenSprache` reicht
   * „fr" durch, `<html lang="fr">` steht, sobald „fr" gewählt ist. Das ist
   * jetzt RICHTIG, weil die Oberfläche selbst französisch ist; Inhalte, die
   * bewusst in einer anderen Sprache bleiben (Übungszeile, Namen der anderen
   * Apps), tragen ihr eigenes `lang`.
   *
   * ★★★ E2b (25.09.2026, Bauplan Auftrag Punkt 5): `<html lang>` FOLGT DER
   * OBERFLÄCHEN-SICHEREN SPRACHE (`sprache`), NICHT DER ROHEN AUSWAHL
   * (`spracheRoh`) - DIE REGEL: das `lang`-Attribut darf nur dort stehen, wo
   * auch wirklich Text in dieser Sprache steht. Solange `texte()` für „fr"
   * auf Englisch zurückfällt (bis E11 echte französische Texte bringt), ist
   * der angezeigte Text ENGLISCH, auch wenn die Person „fr" gewählt hat -
   * `<html lang="fr">` liesse eine Sprachausgabe englische Knopfbeschriftungen
   * mit französischer Aussprache lesen (dieselbe Falle wie beim Tab-Titel,
   * EN10). Sobald E11 echte „fr"-Texte liefert, wird `oberflaechenSprache`
   * dort selbst „fr" durchreichen (siehe `sprache.ts`) - diese Zeile ändert
   * sich dann von selbst mit.
   */
  useEffect(() => {
    if (!aktiv) return;
    const html = document.documentElement;
    const vorher = html.getAttribute("lang");
    // ★ SPRACHEN-9 (30.10.2026, mit Johannes' Ja): die interne Kennung „br" ist kein Sprach-Tag - `lang="br"` hiesse Bretonisch, und
    // NVDA/JAWS läsen Brasilianisch-Portugiesisch mit der falschen Sprache. Alle anderen Kennungen sind gültige Tags.
    html.setAttribute("lang", sprache === "br" ? "pt-BR" : sprache);
    return () => {
      if (vorher === null) html.removeAttribute("lang");
      else html.setAttribute("lang", vorher);
    };
  }, [aktiv, sprache]);

  const wert = useMemo<BedienSpracheWert>(
    // ⚠️ Nicht aktiv ⇒ GENAU der Wert ohne Provider (dasselbe Objekt): Eine
    // fremde App soll nicht einmal an `bereichAktiv` erkennen können, dass es
    // ihn gibt.
    () =>
      aktiv
        ? {
            sprache,
            setzeSprache,
            bereichAktiv: true,
            wechsle,
            beimSchalter,
            spracheGewaehlt: spracheRoh,
            spracheOptionen,
          }
        : OHNE_PROVIDER,
    [aktiv, sprache, setzeSprache, wechsle, beimSchalter, spracheRoh, spracheOptionen],
  );
  return (
    <BedienSpracheKontext.Provider value={wert}>{children}</BedienSpracheKontext.Provider>
  );
}

/**
 * ★ 06.11.2026 (Bauplan Sprachen-Apps §1c, gemeinsamer Teil): eine FESTE
 * Bedienungssprache für einen Teilbaum - für die öffentlichen Seiten (Sims,
 * Hörbuch-Studio), die ihre Sprache selbst wählen (`lib/simSprache.tsx`, nur mit
 * `?sprachen-sims=1`). Kopfzeile, Melden, Fusszeile und Hilfe lesen dann diese
 * Sprache. Merkt nichts, schaltet nichts, kennt keinen Tastenflow-Schalter -
 * `setzeSprache`/`wechsle` tun nichts - außer die App reicht `onWechsel` herein (dann stellt der Sprachwähler der Kopfzeile ihre Sprache um).
 */
export function FesteBedienSprache({
  sprache,
  children,
  onWechsel,
  optionen,
}: {
  sprache: BedienSprache;
  children: ReactNode;
  /** ★ 10.11.2026: Wer den Sprachwähler der Kopfzeile drückt - die App stellt um (Klangpunkte, Punktgenau, Plus). */
  onWechsel?: (neu: BedienSprache) => void;
  /** Welche Sprachen die Kopfzeile anbietet (Vorgabe: Deutsch und Englisch). */
  optionen?: readonly BedienSprache[];
}) {
  const wert = useMemo<BedienSpracheWert>(
    () => ({
      ...OHNE_PROVIDER,
      sprache,
      spracheGewaehlt: sprache,
      bereichAktiv: true,
      ...(onWechsel ? { wechsle: onWechsel, setzeSprache: onWechsel } : {}),
      ...(optionen ? { spracheOptionen: optionen } : {}),
    }),
    [sprache, onWechsel, optionen],
  );
  return <BedienSpracheKontext.Provider value={wert}>{children}</BedienSpracheKontext.Provider>;
}

/** Die Bedienungssprache - ohne (aktiven) Provider `{ sprache: "de", bereichAktiv: false }`. */
export function useBedienSprache(): BedienSpracheWert {
  return useContext(BedienSpracheKontext);
}

/**
 * ★★ WER DEN SPRACHSCHALTER DRÜCKT, BEKOMMT DIE ÜBUNGSSPRACHE MIT (Johannes
 * 19.09.2026): *„wer englische Oberfläche einstellt, hat automatisch sofort
 * englische Texte, kann aber auch auf deutsche Texte einstellen"*.
 *
 * Ruft `horcher` bei jedem Druck auf den Schalter - NUR dann: nicht bei der
 * Erkennung beim ersten Besuch, nicht beim Einhängen, nicht über
 * `setzeSprache`. Eine Übungssprache, die ein Konto schon hat, darf nur eine
 * ausdrückliche Handlung ändern.
 *
 * ★ Über einen Ref: Die Anmeldung überlebt jedes Rendern, und der Horcher liest
 * trotzdem den Zustand des Augenblicks (Konto, Sperre der Lehrkraft).
 */
export function useBeimSprachSchalter(horcher: (neu: AktiveBedienSprache) => void): void {
  const { beimSchalter } = useBedienSprache();
  const ref = useRef(horcher);
  ref.current = horcher;
  useEffect(() => beimSchalter((neu) => ref.current(neu)), [beimSchalter]);
}
