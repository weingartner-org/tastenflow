/**
 * ★ GEZIELT ÜBEN (13.11.2026, Bauplan §2, §4): die EINE Stelle, an der die Übungsseite alles zu „Gezielt üben"
 * bekommt - damit die riesige `TippenTrainerPage` nur einen Haken aufruft:
 *
 *   • Was gilt heute (`wirksam`) und was ist gespeichert (`roh`): MIT Kind-Konto das Konto (in einer Klasse schon mit
 *     Vorrang Kind/Klasse gerechnet, `mitKlassenVorrang`), OHNE (Gäste, Lehrkräfte, die selbst üben) das Gerät.
 *   • Wer es ändern darf: alle, die nicht in einer Klasse sind.
 *   • Der Dialog (`GezieltDialog`) samt Vorschlag aus den wackligen Tasten, das Speichern, die Ansage beim Rundenstart
 *     und die einmalige Vorstellung einer VORGEZOGENEN Taste.
 *
 * ★ Vorgezogen heisst: Die Taste kommt im Lehrgang erst später und ist nur für diese Runde erlaubt (Etappe A:
 * `gezieltFuerRunde`). Vorgestellt wird sie beim ersten Mal - als sichtbarer Hinweis UNTER dem Übungsfeld plus eine
 * Ansage, NICHT über `UnlockCelebration`: Die Karte feiert eine Freischaltung (Fanfare, „Gratulation", Abzeichen-
 * Ton), und hier wird nichts freigeschaltet und nichts gespeichert.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useBedienSprache } from "@/lib/bedienSprache";
import { typingBackend } from "@/lib/typing/backend";
import type { TypingAccount } from "@/lib/typing/account";
import type { Lernweg } from "@/lib/typing/lernweg";
import { FINGER_ANSAGE_JE_SPRACHE, spokenLabel } from "@/lib/typing/fingers";
import { gezieltWirksam, type Gezielt } from "@/lib/typing/gezielt";
import { useDeviceGezielt, vorgestelltLesen, vorgestelltMerken, vorgestelltSchluessel } from "@/lib/typing/gezieltGeraet";
import { GEZIELT_TEXTE } from "@/lib/typing/gezieltTexte";
import { loadProgress } from "@/lib/typing/progress";
import { ensureIntroduced } from "@/lib/typing/letters";
import { lernwegVon } from "@/lib/typing/lernweg";
import { stufeFuer } from "@/lib/typing/account";
import { wackeligeTastenAus } from "@/lib/typing/zeilenMessung";
import { useTypingA11y } from "@/lib/typing/a11y";
import { useContrast } from "@/lib/contrast";
import { GezieltDialog } from "./GezieltDialog";
import { GezieltSchild } from "./GezieltSchild";
import { useBedienStimme } from "./useBedienStimme";

export interface GezieltSteuerung {
  /** Was heute gilt - das geht an `AdaptiveTrainer` (`null` = nichts). */
  wirksam: Gezielt | null;
  /** Das Gespeicherte (für den Dialog). */
  roh: Gezielt | null;
  /** Darf die Person es selbst ändern? In einer Klasse nicht. */
  darfAendern: boolean;
  /** Dialog öffnen. */
  oeffnen: () => void;
  /** Ausschalten (speichert `null`). */
  ausschalten: () => void;
  /** Alt + 2: Dialog öffnen - bei einem Kind einer Klasse die Tasten der Lehrkraft ansagen. */
  kuerzel: () => void;
  /** Für `AdaptiveTrainer.onVorgezogen`. */
  onVorgezogen: (zeichen: string[]) => void;
  /** Für `AdaptiveTrainer.onGezieltRunde`. */
  onRunde: (zeichen: string[]) => void;
  /** Das Schildchen für die Stand-Zeile (`AdaptiveTrainer.gezieltSlot`) - `undefined`, wenn nichts gilt. */
  schild: ReactNode;
  /** Fingerfarben zeigen? (Nur in Hell/Dunkel.) */
  farben: boolean;
  /** Der Dialog und der Hinweis „vorgezogen" - gehören einmal irgendwo in die Seite. */
  knoten: ReactNode;
}

export function useGezieltSteuerung({
  account,
  istKlassenkind,
  lernweg,
  einhand,
  update,
  onGespeichert,
}: {
  account: TypingAccount | null;
  istKlassenkind: boolean;
  lernweg: Lernweg;
  einhand: boolean;
  update: (a: TypingAccount) => void;
  /** Nach dem Speichern - die Seite lädt dann die Runde neu, damit es sofort gilt. */
  onGespeichert?: () => void;
}): GezieltSteuerung {
  const { spracheGewaehlt: sprache } = useBedienSprache();
  const t = GEZIELT_TEXTE[sprache];
  const stimme = useBedienStimme();
  const geraet = useDeviceGezielt((s) => s.gezielt);
  const setGeraet = useDeviceGezielt((s) => s.setGezielt);
  const istKind = account?.role === "schueler";
  const roh = istKind ? (account?.gezielt ?? null) : geraet;
  const wirksam = gezieltWirksam(roh, new Date());
  const darfAendern = !istKlassenkind;
  const fingerFarben = useTypingA11y((s) => s.fingerFarben);
  const kontrast = useContrast((s) => s.mode);
  const farben = fingerFarben && (kontrast === "hell" || kontrast === "dunkel");

  const [offen, setOffen] = useState(false);
  const [vorschlag, setVorschlag] = useState<string[]>([]);
  const [vorgezogen, setVorgezogen] = useState<string[]>([]);

  const spiegel = useRef({ t, sprache, stimme, wirksam, account, lernweg, einhand });
  spiegel.current = { t, sprache, stimme, wirksam, account, lernweg, einhand };

  const oeffnen = useCallback(() => {
    setOffen(true);
    // Der Vorschlag: die wackligen Tasten der Person - falls berechenbar. Ein Fehler oder ein leerer Stand nimmt nichts weg.
    void (async () => {
      try {
        const konto = spiegel.current.account;
        const p = konto ? await typingBackend().getProgress(konto.id) : loadProgress();
        const weg = lernwegVon(p);
        const einheiten = wackeligeTastenAus(p.letters, ensureIntroduced(p.introduced, weg), {
          lernweg: weg,
          stufe: konto ? stufeFuer(konto) : undefined,
        });
        setVorschlag(einheiten.filter((u) => [...u].length === 1 && u.trim() !== ""));
      } catch {
        setVorschlag([]);
      }
    })();
  }, []);

  const speichern = useCallback(
    (g: Gezielt | null) => {
      const konto = spiegel.current.account;
      if (konto && konto.role === "schueler") {
        void typingBackend()
          .setGezielt(konto.id, g)
          .then((a) => {
            if (a) update(a);
            onGespeichert?.();
          });
      } else {
        setGeraet(g);
        onGespeichert?.();
      }
    },
    [onGespeichert, setGeraet, update],
  );

  const ausschalten = useCallback(() => speichern(null), [speichern]);

  const kuerzel = useCallback(() => {
    const s = spiegel.current;
    if (!darfAendern) {
      const w = s.wirksam;
      s.stimme.sprich(
        w ? s.t.lehrkraftAnsage(w.zeichen.map((z) => spokenLabel(z, s.sprache)).join(", ")) : s.t.lehrkraftKeine,
      );
      return;
    }
    oeffnen();
  }, [darfAendern, oeffnen]);

  // ★ Beim Rundenbau (während des Renders des Trainers): nichts setzen, nichts sprechen - erst im nächsten Takt.
  const onRunde = useCallback((zeichen: string[]) => {
    window.setTimeout(() => {
      const s = spiegel.current;
      if (zeichen.length === 0) return;
      s.stimme.sprich(s.t.rundenAnsage(zeichen.map((z) => spokenLabel(z, s.sprache)).join(", ")));
    }, 0);
  }, []);

  const onVorgezogen = useCallback((zeichen: string[]) => {
    window.setTimeout(() => {
      const s = spiegel.current;
      const schluessel = vorgestelltSchluessel(s.account?.id);
      const schon = vorgestelltLesen(schluessel);
      const neu = zeichen.filter((z) => !schon.includes(z));
      if (neu.length === 0) return;
      vorgestelltMerken(schluessel, neu);
      setVorgezogen((alt) => [...alt, ...neu.filter((z) => !alt.includes(z))]);
      const wie = neu.map((z) => FINGER_ANSAGE_JE_SPRACHE[s.sprache](z, s.einhand, s.lernweg)).join(" ");
      s.stimme.sprich(`${s.t.vorgezogenTitel}. ${wie}`);
    }, 0);
  }, []);

  // Wer in eine andere Sprache oder ein anderes Konto wechselt, sieht den Hinweis nicht weiter.
  useEffect(() => {
    setVorgezogen([]);
  }, [account?.id]);

  const knoten = useMemo(
    () => (
      <>
        {offen && (
          <GezieltDialog
            start={roh}
            vorschlag={vorschlag}
            onSpeichern={speichern}
            onSchliessen={() => setOffen(false)}
          />
        )}
        {vorgezogen.length > 0 && (
          <div className="mt-4 rounded-xl border border-hairline px-4 py-3 text-base text-ink-soft" data-gezielt-vorgezogen="">
            <p className="m-0 font-semibold text-ink">{t.vorgezogenTitel}</p>
            <ul className="m-0 mt-1 list-none p-0">
              {vorgezogen.map((z) => (
                <li key={z}>
                  <span className="font-legible font-semibold text-ink">{z}</span>{" "}
                  {FINGER_ANSAGE_JE_SPRACHE[sprache](z, einhand, lernweg)}
                </li>
              ))}
            </ul>
            <p className="m-0 mt-1 text-sm">{t.vorgezogenText}</p>
            <button type="button" className="btn-secondary btn-toggle mt-2" onClick={() => setVorgezogen([])}>
              {t.verstanden}
            </button>
          </div>
        )}
      </>
    ),
    [offen, roh, vorschlag, speichern, vorgezogen, t, sprache, einhand, lernweg],
  );

  const schild = wirksam ? (
    <GezieltSchild zeichen={wirksam.zeichen} darfAendern={darfAendern} onAendern={oeffnen} farben={farben} />
  ) : undefined;

  return { wirksam, roh, darfAendern, oeffnen, ausschalten, kuerzel, onVorgezogen, onRunde, schild, farben, knoten };
}
