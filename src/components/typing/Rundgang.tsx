/**
 * ★★★ DIE RUNDGÄNGE VON TASTENFLOW (Z4, 19.09.2026) - die Oberfläche.
 * ============================================================================
 *
 * Johannes, 19.09.2026: *„Sie brauchen eine Einführung mit Bereichserklärungen
 * genau wie bei ‚Mit anderen Augen sehen'. Bei Lehrkräften ist die Erklärung
 * der ganzen neuen Oberfläche wichtig!"*
 *
 * Darum DERSELBE Baustein wie in den Simulationen (`SimEinfuehrung.tsx`): Der
 * Schirm wird abgedunkelt, EIN Bereich bleibt hell, daneben steht ein kurzer
 * Text mit „Weiter" und „Überspringen". Er holt den Fokus nicht. Was hier
 * dazukommt, reicht er über seine (optionalen) Eigenschaften herein - die
 * sieben Simulationen merken davon nichts.
 *
 * WANN ein Rundgang von selbst kommt, entscheidet `lib/typing/rundgang.ts`;
 * die Texte stehen in `lib/typing/rundgangTexte.ts`. Hier steht nur WO:
 *  · {@link RundgangUeben} - eingehängt in `TippenTrainerPage`;
 *  · {@link RundgangMeineKlassen} - eingehängt in `MeineKlassePage`;
 *  · die Knöpfe, die ihn zurückholen: {@link RundgangNochmalKnopf} (Hilfe der
 *    Kinder), {@link RundgangLehrkraftKnoepfe} (Hilfe der Lehrkraft auf der
 *    Übungsseite), {@link RundgangMeineKlassenKnopf} (Hilfe zu „Meine
 *    Klassen"). Dazu der Knopf in „Was gibt's Neues" (`NeuigkeitenFenster`).
 *
 * ── TASTATUR UND SPRACHAUSGABE ──────────────────────────────────────────────
 *  · Der Fokus bleibt, wo er ist. Auf der ÜBUNGSSEITE darf aber kein Anschlag
 *    das Üben starten, solange ein Schritt offen ist: Eingabe- und Leertaste =
 *    Weiter, Escape = Rundgang beenden (danach, wie immer bei Escape, der
 *    Fokus in die Eingabezeile), alles andere zählt nicht (`tasten="uebung"`).
 *  · Jeder Schritt wird EINMAL angesagt - über einen eigenen Live-Bereich, der
 *    schon steht, bevor der erste Text kommt, und mit der Vorlese-Stimme
 *    (`speakUi` über `useBedienStimme`: spricht nur bei „Vorlesen an"; neben
 *    einem Live-Bereich nie `speakUiAlways`, sonst zwei Stimmen).
 *  · ⚠️ Ein Live-Bereich ist auf der Braillezeile eine BLITZMELDUNG
 *    ([[reference_live_region_ist_braille_blitzmeldung]]). Der Schritt-Text
 *    ist darum das EINZIGE, was er je trägt - und nur beim Schrittwechsel.
 *  · Jeder Schritt NENNT seinen Bereich im Text; der Leuchtrahmen allein sagt
 *    einem Screenreader nichts.
 *  · Ein Fenster (`[role="dialog"][aria-modal="true"]`) hat Vorrang: Solange
 *    eines offen ist (Hilfe, Spendenaufruf, „Was gibt's Neues" …), tritt der
 *    Rundgang zurück und fängt keine Taste ab; danach steht er wieder da, beim
 *    selben Schritt.
 *  · Kontrastmodus: Der Rahmen trägt `data-einfuehrung-rahmen` - `index.css`
 *    zeichnet ihn dort dick in `Highlight`.
 */
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useInRouterContext, useNavigate } from "react-router-dom";
import {
  SimEinfuehrung,
  einfuehrungGesehen,
  einfuehrungMerken,
  type EinfuehrungBeschriftung,
  type EinfuehrungEnde,
  type EinfuehrungSchritt,
  type EinfuehrungTasten,
} from "@/components/SimEinfuehrung";
import { Tipp } from "@/components/Tipp";
import { useTypingAuth } from "@/components/typing/useTypingAuth";
import { useBedienStimme } from "@/components/typing/useBedienStimme";
import { useBedienSprache, type BedienSprache } from "@/lib/bedienSprache";
import { wahlText } from "@/lib/typing/wahltaste";
import {
  anredeFuer,
  focusPracticeField,
  loadProgress,
  skinForStufe,
  typingBackend,
  type Anrede,
  type Stufe,
  type TypingAccount,
} from "@/lib/typing";
import { einrichtungFertig, hatSchonGeuebt } from "@/lib/typing/einrichtung";
import { hierIstTastenflow, meineKlasseHref } from "@/lib/adressen";
import {
  ALLE_RUNDGAENGE,
  RUNDGANG_KINDER_UND_ZUGAENGE,
  RUNDGANG_MEINE_KLASSEN,
  RUNDGANG_UEBEN,
  fuerKontoNachzutragen,
  rundgangLehrkraftEntscheiden,
  rundgangUebenEntscheiden,
  useRundgangWunsch,
  type RundgangSchluessel,
} from "@/lib/typing/rundgang";
import {
  RUNDGANG_TEXTE,
  type RundgangTon,
  type RundgangWer,
} from "@/lib/typing/rundgangTexte";

// ─────────────────────────────────────────────────────────────────────────────
// Bausteine
// ─────────────────────────────────────────────────────────────────────────────

/** Ein Schritt, wie ihn die Rundgänge hier beschreiben: Bereich + Name + Satz. */
export type RundgangSchritt = {
  ziel: () => HTMLElement | null | undefined;
  /** Der Name des Bereichs - steht fett vor dem Satz und in der Ansage. */
  name: string;
  text: string;
};

const q = (selektor: string) => () =>
  typeof document === "undefined" ? null : document.querySelector<HTMLElement>(selektor);

/** „Name:" - ausser der Name endet schon mit einem Satzzeichen („Los geht's!"). */
function kopf(name: string): string {
  return /[.!?:]$/.test(name) ? name : `${name}:`;
}

/** Der ganze Schritt als EIN Satz - für Live-Bereich und Vorlese-Stimme. */
export function rundgangSatz(s: Pick<RundgangSchritt, "name" | "text">): string {
  return `${kopf(s.name)} ${s.text}`;
}

/** Ist gerade ein Fenster offen, das Vorrang hat? */
function fensterOffen(): boolean {
  return (
    typeof document !== "undefined" &&
    !!document.querySelector('[role="dialog"][aria-modal="true"]')
  );
}

/**
 * Beobachtet die Seite, solange `aktiv`: Ist ein Fenster offen? Steht das
 * Element da, an dem der Rundgang beginnt? Ein Beobachter statt eines
 * Zeitgebers - er schläft, solange sich nichts ändert, und ist nach dem
 * Rundgang abgemeldet (`aktiv` = false).
 */
function useSeitenLage(aktiv: boolean, startSelektor: string) {
  const [lage, setLage] = useState({ fenster: false, start: false });
  useEffect(() => {
    if (!aktiv) return;
    const pruefe = () => {
      const neu = {
        fenster: fensterOffen(),
        start: !!document.querySelector(startSelektor),
      };
      setLage((alt) => (alt.fenster === neu.fenster && alt.start === neu.start ? alt : neu));
    };
    pruefe();
    const beobachter = new MutationObserver(pruefe);
    beobachter.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["role", "aria-modal"],
    });
    return () => beobachter.disconnect();
  }, [aktiv, startSelektor]);
  // Ohne Beobachtung gilt nichts als gesehen - kein alter Stand von vorhin.
  return aktiv ? lage : RUHE;
}
const RUHE = { fenster: false, start: false };

function rolleVon(a: TypingAccount): "lehrkraft" | "schueler" {
  return a.role === "lehrkraft" ? "lehrkraft" : "schueler";
}

/** Die Rundgänge, die DIESES Gerät gesehen hat (plus, was es sonst schon kennt). */
function geraetKennt(extra: readonly RundgangSchluessel[]): RundgangSchluessel[] {
  return ALLE_RUNDGAENGE.filter((k) => einfuehrungGesehen(k) || extra.includes(k));
}

/**
 * ★ Die Liste am KONTO frisch lesen - und dabei nachtragen, was das Gerät
 * schon gesehen hat (Johannes: wer zuerst ohne Anmeldung übt und sich dann
 * anmeldet, bekommt keine Einführung mehr). Gibt die Liste zurück, wie sie
 * danach am Konto steht - oder `null`, wenn das Lesen scheiterte.
 * Geschrieben wird nur, wenn wirklich etwas fehlt.
 */
async function kontoAbgleichen(
  a: TypingAccount,
  extra: readonly RundgangSchluessel[] = [],
): Promise<string[] | null> {
  const rolle = rolleVon(a);
  let liste: string[] | null = null;
  try {
    liste = await typingBackend().getRundgaengeGesehen(a.id, rolle);
  } catch {
    liste = null;
  }
  if (!liste) return null;
  const neu = fuerKontoNachzutragen(geraetKennt(extra), liste);
  if (!neu) return liste;
  await typingBackend()
    .setRundgaengeGesehen(a.id, rolle, neu)
    .catch(() => false);
  return neu;
}

/**
 * Ein Rundgang ist ZU SEHEN - ab jetzt gilt er als gesehen, am Gerät und am
 * Konto (Johannes: *„nicht nach dem Neuladen!"*).
 */
function alsGesehenMerken(schluessel: RundgangSchluessel, a: TypingAccount | null) {
  einfuehrungMerken(schluessel);
  if (a) void kontoAbgleichen(a);
}

/**
 * EIN laufender Rundgang: der Baustein der Simulationen, dazu der eigene
 * Live-Bereich und die Vorlese-Stimme.
 */
function RundgangLauf({
  schluessel,
  schritte,
  tasten,
  sprechen,
  onGezeigt,
  onEnde,
}: {
  schluessel: RundgangSchluessel;
  schritte: RundgangSchritt[];
  tasten: EinfuehrungTasten;
  /** Mit der Vorlese-Stimme (nur Übungsseite - „Meine Klassen" hat keine). */
  sprechen: boolean;
  /** Der erste Schritt ist zu sehen. */
  onGezeigt: () => void;
  onEnde: (ende: EinfuehrungEnde) => void;
}) {
  const { sprache } = useBedienSprache();
  const t = RUNDGANG_TEXTE[sprache];
  const stimme = useBedienStimme();
  const { fenster } = useSeitenLage(true, "body");
  const [ansage, setAnsage] = useState("");
  /**
   * Der Satz, der angesagt werden soll - mit laufender Nummer, damit auch
   * derselbe Satz ein zweites Mal ankommt. Erst leeren, dann (100 ms später)
   * füllen: So hört eine Sprachausgabe eine ÄNDERUNG, auch beim ersten
   * Schritt. ⚠️ Als Effekt mit Aufräumen, nicht als Zeitgeber im Rückruf -
   * im Entwicklungsmodus (StrictMode) räumte React den sonst gleich wieder ab,
   * und der erste Schritt blieb stumm (im Browser gemessen, 19.09.2026).
   */
  const [anzusagen, setAnzusagen] = useState<{ nr: number; satz: string } | null>(null);
  useEffect(() => {
    if (!anzusagen) return;
    setAnsage("");
    const zeitgeber = window.setTimeout(() => setAnsage(anzusagen.satz), 100);
    return () => window.clearTimeout(zeitgeber);
  }, [anzusagen]);

  const beschriftung = useMemo<EinfuehrungBeschriftung>(
    () => ({
      name: t.name,
      zaehler: t.zaehler,
      ueberspringen: t.ueberspringen,
      weiter: t.weiter,
      fertig: t.fertig,
      geschafft: t.geschafft,
    }),
    [t],
  );
  /*
    ★ 18.10.2026 (Johannes: „passe mac an Wahl-taste an"): Die Sätze nennen
    App-Kürzel („Hilfe (Alt + H)") - am Mac heißt die Taste „Wahl" (in der
    Sprache: Option, Opción …). Für Anzeige UND Ansage, darum hier einmal.
  */
  const schritteHier = useMemo(
    () => schritte.map((s) => ({ ...s, name: wahlText(s.name, sprache), text: wahlText(s.text, sprache) })),
    [schritte, sprache],
  );
  const simSchritte = useMemo<EinfuehrungSchritt[]>(
    () =>
      schritteHier.map((s) => ({
        ziel: s.ziel,
        text: (
          <>
            <strong>{kopf(s.name)}</strong> {s.text}
          </>
        ) as ReactNode,
      })),
    [schritteHier],
  );

  return (
    <>
      {/* Steht, bevor der erste Satz kommt - sonst würde er oft gar nicht
          angesagt. Trägt NUR den Schritt-Text (Blitzmeldung auf der
          Braillezeile, siehe Dateikopf). */}
      <div className="sr-only" aria-live="polite" data-rundgang-ansage="">
        {ansage}
      </div>
      <SimEinfuehrung
        schluessel={schluessel}
        schritte={simSchritte}
        beschriftung={beschriftung}
        tasten={tasten}
        verborgen={fenster}
        eigeneAnsage
        onSchritt={(i) => {
          const s = schritteHier[i];
          if (!s) return;
          if (i === 0) onGezeigt();
          const satz = rundgangSatz(s);
          setAnzusagen((alt) => ({ nr: (alt?.nr ?? 0) + 1, satz }));
          if (sprechen) stimme.sprich(satz);
        }}
        onEnde={onEnde}
      />
    </>
  );
}

/**
 * Die Nummern der Schritte, deren Bereich beim Start da ist - den ersten
 * immer. Ein Schritt ohne Bereich (die Tabelle einer Klasse ohne Kinder, die
 * Tastatur im Klassenmatch) erklärte etwas, das niemand vor sich hat.
 */
function vorhandeneNummern(schritte: RundgangSchritt[]): number[] {
  return schritte.flatMap((s, i) => (i === 0 || s.ziel() ? [i] : []));
}

// ─────────────────────────────────────────────────────────────────────────────
// Die Übungsseite
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Die Schritte der Übungsseite - je Tonlage, je nachdem, wer übt, und in
 * seiner Anrede (`anredeFuer`, skin.ts: „Sie" nur für die Lehrkraft).
 */
export function uebenSchritte(
  sprache: BedienSprache,
  ton: RundgangTon,
  wer: RundgangWer,
  anrede: Anrede,
): RundgangSchritt[] {
  const t = RUNDGANG_TEXTE[sprache];
  const zeile = q('[data-rundgang="uebungszeile"]');
  return [
    { ziel: zeile, name: t.uebenZeileName(ton), text: t.uebenZeile(ton, anrede) },
    {
      ziel: q(".standzeile-leiste"),
      name: t.uebenStandName(ton, anrede),
      text: t.uebenStand(ton, wer, anrede),
    },
    { ziel: q('[data-rundgang="tastatur"]'), name: t.uebenTastaturName(ton), text: t.uebenTastatur(ton) },
    {
      // Die Mitte der Kopfzeile: App-Zeichen und Überschrift („Tastenflow ·
      // Mein Training"). Nicht die Überschrift allein - bei schmalem Fenster
      // steht ihr Text nur für Sprachausgaben da, und sie hätte keine Fläche.
      ziel: () => q('[data-rundgang="kopfzeile"] h1')()?.parentElement,
      name: t.uebenArtName(ton),
      text: t.uebenArt(ton),
    },
    { ziel: q('[data-rundgang="kopfzeile"] nav'), name: t.uebenWerkzeugeName(ton), text: t.uebenWerkzeuge(ton) },
    {
      ziel: q('[data-rundgang="kopfzeile"] [aria-keyshortcuts="Alt+J"]'),
      name: t.uebenKontoName(ton, anrede),
      text: t.uebenKonto(ton, wer, anrede),
    },
    { ziel: zeile, name: t.uebenEndeName(ton), text: t.uebenEnde(ton, anrede) },
  ];
}

/**
 * ★ Der Rundgang der ÜBUNGSSEITE - für alle, die Tastenflow zum ersten Mal
 * betreten. Kommt nach der Einrichtung (er wartet, bis das Übungsfeld steht).
 */
export function RundgangUeben({
  stufe,
  bereit,
}: {
  /** Die Stufe der Seite - daraus die Tonlage. */
  stufe: Stufe;
  /**
   * Wird gerade gewöhnlich geübt? Nicht während Anmeldung, Einrichtung,
   * Statistik, Tippchallenge, Klassenmatch und Eigener Übung.
   */
  bereit: boolean;
}) {
  const account = useTypingAuth((s) => s.account);
  const { sprache } = useBedienSprache();
  const wunsch = useRundgangWunsch((s) => s.wunsch);
  const wunschErledigt = useRundgangWunsch((s) => s.erledigt);

  // ★ Beim LADEN gemessen, einmal (siehe `rundgang.ts`): Die Einrichtung setzt
  // ihren Merker gleich selbst, und eigenes Üben in dieser Sitzung darf die
  // Frage „zum ersten Mal hier?" nicht nachträglich umdrehen.
  const [beimLaden] = useState(() => ({
    einrichtungWarFaellig: !einrichtungFertig(),
    geraetGeuebt: hatSchonGeuebt(loadProgress()),
  }));
  const extra = useMemo<RundgangSchluessel[]>(
    () => (beimLaden.geraetGeuebt ? [RUNDGANG_UEBEN] : []),
    [beimLaden.geraetGeuebt],
  );

  /** Soll er von selbst kommen? `null` = noch nicht entschieden. */
  const [von, setVon] = useState<{ konto: string | null; ja: boolean } | null>(null);
  /**
   * Der laufende Rundgang: WELCHE Schritte (die, deren Bereich beim Start da
   * war). Die Texte werden bei jedem Bild frisch gebaut - wechselt mitten im
   * Rundgang die Sprache, folgt er ihr, ohne den Schritt zu verlieren.
   */
  const [lauf, setLauf] = useState<{ nr: number; nummern: number[] } | null>(null);
  const autoGestartet = useRef(false);

  const wer: RundgangWer = !account
    ? "gast"
    : account.role === "lehrkraft"
      ? "lehrkraft"
      : account.classCode
        ? "klassenkind"
        : "selbstlernend";
  // ★ Die Anrede kommt aus der EINEN Regel (skin.ts). Wer gesiezt wird (die
  // Lehrkraft), liest den Rundgang im Erwachsenen-Ton - ihre Textstufe
  // beschreibt die Texte zum Vorführen, nicht die Person, die liest; und nur
  // der Erwachsenen-Ton hat eine Sie-Fassung. Alle Lernenden lesen „du",
  // auch ab 16 (Johannes 19.09.2026).
  const anrede = anredeFuer(account);
  const ton: RundgangTon = anrede === "Sie" ? "erwachsen" : skinForStufe(stufe);

  // ── Entscheiden - je Konto (oder Gast) einmal ──────────────────────────
  const kontoId = account?.id ?? null;
  useEffect(() => {
    let lebt = true;
    void (async () => {
      const geraetGesehen = einfuehrungGesehen(RUNDGANG_UEBEN);
      if (!account) {
        const ja = rundgangUebenEntscheiden({
          einrichtungWarFaellig: beimLaden.einrichtungWarFaellig,
          geraetGesehen,
          geraetGeuebt: beimLaden.geraetGeuebt,
          konto: null,
        });
        if (lebt) setVon({ konto: null, ja });
        return;
      }
      // Angemeldet: zuerst nachtragen, was das Gerät schon gesehen hat.
      const [liste, stand] = await Promise.all([
        kontoAbgleichen(account, extra),
        typingBackend()
          .getProgress(account.id)
          .catch(() => null),
      ]);
      if (!lebt) return;
      const ja = rundgangUebenEntscheiden({
        einrichtungWarFaellig: beimLaden.einrichtungWarFaellig,
        geraetGesehen,
        geraetGeuebt: beimLaden.geraetGeuebt,
        konto: {
          rolle: rolleVon(account),
          erstelltMs: account.createdAt,
          gesehen: liste,
          geuebt: hatSchonGeuebt(stand),
        },
      });
      setVon({ konto: account.id, ja });
    })();
    return () => {
      lebt = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kontoId]);

  // ── Warten, bis geübt wird und das Übungsfeld steht ──────────────────────
  const willAuto = !!von && von.ja && von.konto === kontoId && !autoGestartet.current;
  const willWunsch = wunsch === "ueben";
  const { start } = useSeitenLage(bereit && (willAuto || willWunsch), '[data-rundgang="uebungszeile"]');
  const kannStarten = bereit && start;

  useEffect(() => {
    if (!kannStarten || (!willWunsch && !willAuto)) return;
    if (willWunsch) wunschErledigt();
    autoGestartet.current = true;
    setLauf((alt) => ({
      nr: (alt?.nr ?? 0) + 1,
      nummern: vorhandeneNummern(uebenSchritte(sprache, ton, wer, anrede)),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kannStarten, willAuto, willWunsch]);

  const schritte = useMemo(() => {
    if (!lauf) return [];
    const alle = uebenSchritte(sprache, ton, wer, anrede);
    return lauf.nummern.map((n) => alle[n]).filter(Boolean);
  }, [lauf, sprache, ton, wer, anrede]);

  if (!lauf || schritte.length === 0) return null;
  return (
    <RundgangLauf
      key={lauf.nr}
      schluessel={RUNDGANG_UEBEN}
      schritte={schritte}
      tasten="uebung"
      sprechen
      onGezeigt={() => alsGesehenMerken(RUNDGANG_UEBEN, account)}
      onEnde={(ende) => {
        setLauf(null);
        // ★ Escape heisst hier, wie überall auf dieser Seite: zurück in die
        // Eingabezeile. Und stand der Fokus auf einem Knopf des Kastens, der
        // gerade verschwindet, braucht er ein Ziel - dasselbe.
        if (ende.grund === "escape" || ende.fokusWarImKasten) focusPracticeField();
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// „Meine Klassen"
// ─────────────────────────────────────────────────────────────────────────────

/** Die Schritte des Lernstands (die ganze neue Oberfläche). */
export function meineKlassenSchritte(sprache: BedienSprache): RundgangSchritt[] {
  const t = RUNDGANG_TEXTE[sprache];
  const aufgaben = '[data-rundgang="aufgaben"]';
  return [
    { ziel: q('[data-rundgang="klassenkopf"]'), name: t.mkKopfName, text: t.mkKopf },
    { ziel: q('[data-rundgang="bereich"]'), name: t.mkBereichName, text: t.mkBereich },
    {
      ziel: q(`${aufgaben} [aria-controls="mk-tf-panel-tippchallenge"]`),
      name: t.mkTippchallengeName,
      text: t.mkTippchallenge,
    },
    {
      ziel: q(`${aufgaben} [aria-controls="mk-tf-panel-eigene-uebung"]`),
      name: t.mkEigeneUebungName,
      text: t.mkEigeneUebung,
    },
    {
      ziel: q(`${aufgaben} [aria-controls="mk-tf-panel-wochenziel"]`),
      name: t.mkWochenzielName,
      text: t.mkWochenziel,
    },
    {
      // „Stunde sperren" hat kein Panel - es ist der EINZIGE Knopf der Reihe
      // ohne `aria-controls`. ⚠️ Nicht an seinem Platz erkennen: Bis
      // 19.09.2026 war er der letzte, dann hat Johannes ihn vor „Einstellungen
      // der Klasse" gezogen („tausche die Schalter") - die alte Suche nach dem
      // letzten Knopf hätte ins Leere gegriffen.
      ziel: () =>
        Array.from(document.querySelectorAll<HTMLElement>(`${aufgaben} button`)).find(
          (k) => !k.hasAttribute("aria-controls"),
        ) ?? null,
      name: t.mkSperrenName,
      text: t.mkSperren,
    },
    {
      ziel: q(`${aufgaben} [aria-controls="mk-tf-panel-einstellungen-klasse"]`),
      name: t.mkEinstellungenName,
      text: t.mkEinstellungen,
    },
    { ziel: q("[data-klassenueberblick]"), name: t.mkUeberblickName, text: t.mkUeberblick },
    { ziel: q(".zeitraum-kopf"), name: t.mkZeitraumName, text: t.mkZeitraum },
    { ziel: q('[data-rundgang="tabelle"]'), name: t.mkTabelleName, text: t.mkTabelle },
    { ziel: q('[data-rundgang="tabelle"] tbody tr'), name: t.mkKindName, text: t.mkKind },
    { ziel: q("header nav"), name: t.mkWerkzeugeName, text: t.mkWerkzeuge },
  ];
}

/** Die Schritte von „Kinder und Zugänge". */
export function kinderUndZugaengeSchritte(
  sprache: BedienSprache,
  hatKlasse: boolean,
): RundgangSchritt[] {
  const t = RUNDGANG_TEXTE[sprache];
  return [
    { ziel: q('[data-rundgang="klassen"]'), name: t.kuzKlassenName, text: t.kuzKlassen(hatKlasse) },
    { ziel: q('[data-rundgang="klasse"]'), name: t.kuzKlasseName, text: t.kuzKlasse },
    { ziel: q('[data-rundgang="lernende"]'), name: t.kuzLernendeName, text: t.kuzLernende },
    { ziel: q('[data-rundgang="excel"]'), name: t.kuzExcelName, text: t.kuzExcel },
    { ziel: q('[data-rundgang="bereich"]'), name: t.kuzZurueckName, text: t.kuzZurueck },
  ];
}

/**
 * ★ Der Rundgang durch „MEINE KLASSEN" - von selbst nur für NEUE Lehrkräfte
 * (bestehende bekommen „Was gibt's Neues" mit dem Knopf „Rundgang durch die
 * Seite"), und nur für Tastenflow.
 *
 * ⚠️ Ein Bauteil, eine Zeile in `MeineKlassePage` - die Seite gehört gerade
 * einer anderen Etappe (Übersetzung); hier steht alles, was der Rundgang
 * braucht. Die Bereiche kennt er über ihre `data-rundgang`-Marken.
 */
export function RundgangMeineKlassen({
  verwalten,
  programm,
  klassenGeladen,
  klassenAnzahl,
}: {
  /** Bildschirm „Kinder und Zugänge" (sonst „Lernstand"). */
  verwalten: boolean;
  /** Das offene Programm (Lernstand) bzw. die Herkunft (Verwaltung). */
  programm: string | null | undefined;
  klassenGeladen: boolean;
  klassenAnzahl: number;
}) {
  const account = useTypingAuth((s) => s.account);
  const lehrkraft = account?.role === "lehrkraft" ? account : null;
  const { sprache } = useBedienSprache();
  const wunsch = useRundgangWunsch((s) => s.wunsch);
  const wunschErledigt = useRundgangWunsch((s) => s.erledigt);

  const tastenflowHier = programm === "tippen" || (!programm && hierIstTastenflow());
  const schluessel = verwalten ? RUNDGANG_KINDER_UND_ZUGAENGE : RUNDGANG_MEINE_KLASSEN;

  /** Hatte die Lehrkraft beim Öffnen der Seite noch keine Klasse? */
  const [ohneKlasseBeimLaden, setOhneKlasseBeimLaden] = useState<boolean | null>(null);
  useEffect(() => {
    if (klassenGeladen && ohneKlasseBeimLaden === null) setOhneKlasseBeimLaden(klassenAnzahl === 0);
  }, [klassenGeladen, klassenAnzahl, ohneKlasseBeimLaden]);

  const [von, setVon] = useState<{ fuer: string; ja: boolean } | null>(null);
  const [lauf, setLauf] = useState<{
    nr: number;
    schluessel: RundgangSchluessel;
    nummern: number[];
  } | null>(null);
  const autoGestartetFuer = useRef<string | null>(null);

  // ── Entscheiden - je Lehrkraft und Bildschirm einmal ──────────────────
  const fuer = lehrkraft ? `${lehrkraft.id}:${schluessel}` : "";
  useEffect(() => {
    if (!lehrkraft || !tastenflowHier || ohneKlasseBeimLaden === null) return;
    let lebt = true;
    void (async () => {
      const liste = await kontoAbgleichen(lehrkraft);
      if (!lebt) return;
      const ja = rundgangLehrkraftEntscheiden({
        schluessel: verwalten ? RUNDGANG_KINDER_UND_ZUGAENGE : RUNDGANG_MEINE_KLASSEN,
        erstelltMs: lehrkraft.createdAt,
        gesehen: (k) => einfuehrungGesehen(k) || (liste ?? []).includes(k),
        kontoLesbar: liste !== null,
        ohneKlasseBeimLaden,
      });
      setVon({ fuer, ja });
    })();
    return () => {
      lebt = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fuer, tastenflowHier, ohneKlasseBeimLaden]);

  // Ein anderer Bildschirm (die erste Klasse ist angelegt, die Seite wechselt
  // von selbst zum Lernstand) beendet den Rundgang des vorigen - gesehen ist
  // er ja schon.
  useEffect(() => {
    if (lauf && lauf.schluessel !== schluessel) setLauf(null);
  }, [lauf, schluessel]);

  const willAuto =
    !!von && von.ja && von.fuer === fuer && autoGestartetFuer.current !== fuer;
  const willWunsch = wunsch === "meine-klassen" && !!lehrkraft;
  /*
   * Wann der Bildschirm „fertig" ist: „Kinder und Zugänge" mit der Karte
   * „Klassen"; der Lernstand mit der Aufgaben-Reihe von Tastenflow - sie steht
   * erst da, wenn die Klasse Kinder hat. ⚠️ Von SELBST kommt der Rundgang nur
   * dann: Eine Klasse ohne Kinder zeigt nur den Satz „noch keine Kinder" - ein
   * Rundgang durch eine leere Seite verbrauchte den ersten Besuch. Auf WUNSCH
   * (Hilfe, „Was gibt's Neues") genügt auch dieser Satz.
   */
  const startSelektor = verwalten
    ? '[data-rundgang="klassen"]'
    : willWunsch
      ? '[data-rundgang="aufgaben"], [data-rundgang="keine-kinder"]'
      : '[data-rundgang="aufgaben"]';
  const { start } = useSeitenLage(!!lehrkraft && (willAuto || willWunsch), startSelektor);

  const hatKlasse = klassenAnzahl > 0;
  const alleSchritte = useMemo(
    () => (verwalten ? kinderUndZugaengeSchritte(sprache, hatKlasse) : meineKlassenSchritte(sprache)),
    [verwalten, sprache, hatKlasse],
  );

  useEffect(() => {
    if (!start) return;
    if (!willWunsch && !willAuto) return;
    if (willWunsch) wunschErledigt();
    autoGestartetFuer.current = fuer;
    setLauf((alt) => ({ nr: (alt?.nr ?? 0) + 1, schluessel, nummern: vorhandeneNummern(alleSchritte) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, willAuto, willWunsch]);

  const schritte = useMemo(
    () => (lauf ? lauf.nummern.map((n) => alleSchritte[n]).filter(Boolean) : []),
    [lauf, alleSchritte],
  );

  if (!lauf || !lehrkraft || schritte.length === 0) return null;
  return (
    <RundgangLauf
      key={lauf.nr}
      schluessel={lauf.schluessel}
      schritte={schritte}
      tasten="seite"
      sprechen={false}
      onGezeigt={() => alsGesehenMerken(lauf.schluessel, lehrkraft)}
      onEnde={(ende) => {
        setLauf(null);
        // Der Knopf unter dem Fokus verschwindet - dann auf die Überschrift.
        if (ende.fokusWarImKasten) {
          const titel = document.getElementById("seitentitel");
          if (titel) {
            if (!titel.hasAttribute("tabindex")) titel.setAttribute("tabindex", "-1");
            titel.focus({ preventScroll: true });
          }
        }
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Die Knöpfe, die einen Rundgang zurückholen
// ─────────────────────────────────────────────────────────────────────────────

function WunschKnopf({
  wort,
  tipp,
  onClick,
}: {
  wort: string;
  tipp: string;
  onClick: () => void;
}) {
  return (
    <Tipp text={tipp} ausrichtung="links">
      {(hinweisId) => (
        <button
          type="button"
          className="btn-secondary btn-toggle"
          aria-describedby={hinweisId}
          onClick={onClick}
        >
          <span aria-hidden="true">👉</span> {wort}
        </button>
      )}
    </Tipp>
  );
}

/** Hilfe der Kinder (Alt + H): „Rundgang noch einmal". Schliesst die Hilfe. */
export function RundgangNochmalKnopf({ onStart }: { onStart: () => void }) {
  const { sprache } = useBedienSprache();
  const t = RUNDGANG_TEXTE[sprache];
  const wuenschen = useRundgangWunsch((s) => s.wuenschen);
  return (
    <p className="m-0">
      <WunschKnopf
        wort={t.nochmalUeben}
        tipp={t.nochmalTipp}
        onClick={() => {
          wuenschen("ueben");
          onStart();
        }}
      />
    </p>
  );
}

/**
 * Hilfe der Lehrkraft auf der ÜBUNGSSEITE: der Rundgang dieser Seite - und
 * der durch „Meine Klassen" (führt dorthin).
 */
export function RundgangLehrkraftKnoepfe({ onStart }: { onStart: () => void }) {
  const { sprache } = useBedienSprache();
  const t = RUNDGANG_TEXTE[sprache];
  const wuenschen = useRundgangWunsch((s) => s.wuenschen);
  // Die Hilfe steht auch allein (Tests, Vorschau) - ohne Router dann ohne Weg.
  const imRouter = useInRouterContext();
  return (
    <p className="m-0 flex flex-wrap gap-2">
      <WunschKnopf
        wort={t.durchUebungsseite}
        tipp={t.nochmalTipp}
        onClick={() => {
          wuenschen("ueben");
          onStart();
        }}
      />
      {imRouter && <ZuMeinenKlassenKnopf onStart={onStart} />}
    </p>
  );
}

/** „Rundgang durch Meine Klassen" von der Übungsseite aus: dorthin, dann los. */
function ZuMeinenKlassenKnopf({ onStart }: { onStart: () => void }) {
  const { sprache } = useBedienSprache();
  const t = RUNDGANG_TEXTE[sprache];
  const wuenschen = useRundgangWunsch((s) => s.wuenschen);
  const navigate = useNavigate();
  return (
    <WunschKnopf
      wort={t.durchMeineKlassen}
      tipp={t.meineKlassenTipp}
      onClick={() => {
        wuenschen("meine-klassen");
        onStart();
        navigate(meineKlasseHref("tippen"));
      }}
    />
  );
}

/**
 * Hilfe zu „Meine Klassen" (Alt + H): „Rundgang durch Meine Klassen" - der
 * Rundgang des Bildschirms, der gerade offen ist. Nur für Tastenflow (und auf
 * „Kinder und Zugänge", das allen Programmen gehört).
 */
export function RundgangMeineKlassenKnopf({
  onStart,
  programmName,
}: {
  onStart: () => void;
  /** Das offene Programm der Hilfe - ein anderes als Tastenflow: kein Knopf. */
  programmName?: string;
}) {
  const { sprache } = useBedienSprache();
  const t = RUNDGANG_TEXTE[sprache];
  const wuenschen = useRundgangWunsch((s) => s.wuenschen);
  if (programmName && programmName !== "Tastenflow") return null;
  return (
    <p className="m-0">
      <WunschKnopf
        wort={t.durchMeineKlassen}
        tipp={t.meineKlassenTipp}
        onClick={() => {
          wuenschen("meine-klassen");
          onStart();
          /*
            ★ Der Fokus auf die Hauptüberschrift, nicht zurück auf den
            Hilfe-Knopf (dorthin brächte ihn `Modal`): Auf einem Knopf gehört
            die Eingabetaste dem Knopf - sie öffnete die Hilfe gleich wieder,
            statt im Rundgang weiterzugehen (im Browser gemessen, 19.09.2026).
            Auf der Überschrift heisst sie „Weiter". Derselbe Ort wie nach
            „Was gibt's Neues". ⚠️ `setTimeout(0)`: `Modal` setzt beim Abbau
            selbst noch einen Fokus.
          */
          window.setTimeout(() => {
            const titel = document.getElementById("seitentitel");
            if (!titel) return;
            if (!titel.hasAttribute("tabindex")) titel.setAttribute("tabindex", "-1");
            titel.focus({ preventScroll: true });
          }, 0);
        }}
      />
    </p>
  );
}
