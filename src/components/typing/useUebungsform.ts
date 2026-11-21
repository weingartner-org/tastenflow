/**
 * Die Klammer zwischen den Übungsformen und `Mein Training` (AdaptiveTrainer),
 * das dieselben Formen auf seiner Abschluss-Karte anbietet - die Logik gehört
 * EINMAL hierher.
 *
 * ★ E7 (19.09.2026): Bis dahin teilte sich auch die Übungsart „Lektionen"
 * (`TypingTrainer.tsx`) diesen Haken - sie ist entfallen, `useUebungsform`
 * bleibt als eigenständiges Modul stehen (klar geschnitten, unabhängig
 * testbar), auch mit nur noch einem Aufrufer.
 *
 * Was der Haken kann:
 *  • `angebot` - was auf der Abschluss-Karte angeboten wird: eine Übungsform,
 *    die nächste Geschichte, oder gar nichts. Reihum, nicht zufällig.
 *  • `starten` / `beenden` - der laufende Formlauf.
 *  • `vermerken` - „dieses Angebot ist gemacht worden". Gerufen wird das am
 *    RUNDENENDE, wenn die Karte erscheint: Ein Angebot, das ein Kind mit
 *    „lieber weiter üben" weglegt, war trotzdem da. Sonst bekäme es dieselbe
 *    Form bis in alle Ewigkeit.
 *
 * ⚠️ Das Angebot wird EINMAL JE RUNDE berechnet (`round`), nicht bei jedem
 * Tastendruck: `taugt` rechnet an echten Wortlisten.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Lang, Stufe, TypingProgress } from "@/lib/typing";
import { useBedienSprache } from "@/lib/bedienSprache";
// ★ E6a (24.09.2026): der Lernweg des Kindes steht in seinem Fortschritt.
import { lernwegVon } from "@/lib/typing/lernweg";
import { franzVariante } from "@/lib/typing/franzVariante";
import {
  GESCHICHTE,
  angebotVermerkt,
  formFuer,
  naechstesAngebot,
  standAus,
  verfuegbareFormen,
  type AngebotId,
  type FormKontext,
  type FormRunde,
  type Uebungsform,
} from "@/lib/typing/uebungsformen";

export interface FormLauf {
  form: Uebungsform;
  /** Zeilenformen: die gebaute Runde. Formen mit eigenem Bildschirm: `null`. */
  runde: FormRunde | null;
}

export function useUebungsform({
  progress,
  stufe,
  lang,
  oneHand,
  count = 12,
  round,
  storyOffen,
}: {
  progress: TypingProgress;
  stufe: Stufe;
  lang: Lang;
  /** Kind mit dem Häkchen `Einhand schreiben` (Umkehrung von enforceShiftHand). */
  oneHand: boolean;
  count?: number;
  /** Zählt bei jeder neuen Runde hoch - das Angebot wird dann neu bestimmt. */
  round: number;
  /** Steht gerade eine Geschichte offen? Sie läuft im selben Wechsel mit. */
  storyOffen: boolean;
}) {
  const [lauf, setLauf] = useState<FormLauf | null>(null);
  /*
   * ★ EN4 (18.09.2026): Die BEDIENUNGSSPRACHE kommt in den Kontext - in ihr
   * schreiben die Formen Ankündigung und Fragenrahmen (`bedienung.ts`).
   * Ohne aktiven Sprachbereich (`bereichAktiv`, etwa ohne Provider) bleibt
   * sie leer: Dann spricht die Bedienung der Form die Übungssprache, genau wie
   * vor EN4.
   */
  const { sprache: bedienSprache, bereichAktiv } = useBedienSprache();
  const sprache = bereichAktiv ? bedienSprache : undefined;

  const introduced = progress.introduced ?? [];
  // ★ E6a: der Lernweg kommt aus dem Fortschritt - kein stiller Rückfall auf
  // „de" (Bauplan §2.3), sonst prüfte eine Form auf Weg „en" in der
  // deutschen Reihenfolge.
  const lernweg = lernwegVon(progress);
  const ctx: FormKontext = useMemo(
    () => ({
      lernweg,
      introduced,
      shift: introduced.includes("⇧"),
      oneHand,
      stufe,
      lang,
      sprache,
      // ★ E11a-5 (26.09.2026, aus E10d): die französische Landesvariante - nur
      // auf Weg „fr"; `franzVariante()` rät sie (gespeichert > Tastatur >
      // Browser) und liefert ohne den Probe-Schalter „fr-FR".
      ...(lernweg === "fr" ? { franzVariante: franzVariante() } : {}),
      count,
      zufall: Math.random,
    }),
    // Der Tastenstand ändert sich nur zwischen Runden - `join` hält die
    // Abhängigkeit stabil, statt bei jedem Render ein neues Array zu sehen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [introduced.join(""), oneHand, stufe, lang, sprache, count, round, lernweg],
  );

  /**
   * ★★★ Die Reihum-Zählung wird bei RUNDENBEGINN abgelichtet - und die Karte
   * rechnet gegen dieses Bild, nicht gegen den laufenden Stand.
   *
   * Gefunden beim Abnahme-Lauf am 02.09.2026: Ohne das wechselte das Angebot
   * MITTEN AUF DER KARTE. Am Rundenende wird das gemachte Angebot vermerkt -
   * und weil im selben Augenblick oft eine neue Taste freikommt, rechnete die
   * Karte alles neu und zeigte statt der eben angekündigten Geschichte
   * plötzlich eine Übungsform. Ein Kind mit Blindheit hätte eine Ankündigung
   * gehört und einen anderen Knopf bekommen.
   *
   * Abgelichtet wird NUR die Zählung. Tastenstand und offene Geschichte laufen
   * weiter live mit - sonst stünde beim ersten Aufbau (Spielstand noch nicht
   * geladen) für immer das falsche Angebot da.
   */
  const [standBild, setStandBild] = useState(progress.formStand);
  const standRef = useRef(progress.formStand);
  standRef.current = progress.formStand;
  /**
   * Eingefroren wird erst, wenn das Angebot GEMACHT ist (`vermerkeIn` am
   * Rundenende) - vorher läuft der Stand live mit.
   *
   * ⚠️ Der zweite Anlauf. Zuerst hing das Bild allein am Rundenwechsel - und
   * genau daran scheiterte es beim Probelauf im Browser: Beim Aufbau der Seite
   * ist der Spielstand noch nicht geladen, das Bild war leer, und nach dem
   * Laden wurde es nie nachgezogen. Ein Kind bekam nach jedem Neuladen wieder
   * das erste Angebot - die Reihum-Zählung war über Sitzungen hinweg wirkungslos.
   */
  const eingefroren = useRef(false);
  useEffect(() => {
    eingefroren.current = false;
    setStandBild(standRef.current);
  }, [round]);
  useEffect(() => {
    if (!eingefroren.current) setStandBild(progress.formStand);
  }, [progress.formStand]);

  const angebot: AngebotId | null = useMemo(() => {
    // ★ Die GESCHICHTE steht VORNE - und das entscheidet den Gleichstand.
    //
    // Beim ersten Angebot hat ein Kind noch nichts gehabt: Alles steht auf
    // gleich, und dann gewinnt, was hier zuerst kommt. Der angekündigte
    // Geschichten-Hauptweg gilt seit 28.07.2026 und ist eingeführt - er darf
    // nicht dadurch nach hinten rutschen, dass acht neue Formen dazukommen.
    // Ab dem zweiten Angebot entscheidet ohnehin die Reihum-Zählung, und die
    // Geschichte reiht sich ganz normal mit ein.
    const verfuegbar: AngebotId[] = storyOffen
      ? [GESCHICHTE, ...verfuegbareFormen(ctx)]
      : verfuegbareFormen(ctx);
    return naechstesAngebot(standAus(standBild), verfuegbar);
  }, [ctx, storyOffen, standBild]);

  const form = angebot && angebot !== GESCHICHTE ? (formFuer(angebot) ?? null) : null;

  /**
   * Das Angebot ist gemacht worden - unabhängig davon, ob es angenommen wird.
   *
   * ⚠️ Bewusst PUR: Der Aufrufer reicht den Stand herein und speichert selbst.
   * Am Rundenende feuern mehrere Verbucher im selben Tick; ein eigener
   * `persist` hier würde den der anderen überschreiben - genau die
   * Lost-Update-Falle K9, die in diesem Trainer schon einmal Buchstaben-Zähler
   * gekostet hat.
   */
  const vermerkeIn = useCallback(
    (p: TypingProgress): TypingProgress => {
      if (!angebot) return p;
      // Ab jetzt steht die Karte - das Angebot darf sich nicht mehr ändern.
      eingefroren.current = true;
      return { ...p, formStand: angebotVermerkt(standAus(p.formStand), angebot) };
    },
    [angebot],
  );

  const starten = useCallback(() => {
    if (!form) return;
    setLauf({ form, runde: form.baue ? form.baue(ctx) : null });
  }, [form, ctx]);

  /**
   * Eine BESTIMMTE Form starten - unabhängig davon, was gerade an der Reihe
   * wäre. Der Weg des Bereichs „Wortspiele": Dort nimmt man sich etwas aus
   * dem Regal, statt das nächste Angebot anzunehmen.
   *
   * ⚠️ Die Reihum-Zählung bleibt dabei UNBERÜHRT. Wer sich im Regal dreimal
   * dieselbe Form holt, soll auf der Abschluss-Karte trotzdem der Reihe nach
   * weiterkommen - sonst würde ein Lieblingsspiel den ganzen Wechsel
   * blockieren, und der Rest verhungerte.
   */
  const starteBestimmte = useCallback(
    (f: Uebungsform) => setLauf({ form: f, runde: f.baue ? f.baue(ctx) : null }),
    [ctx],
  );

  const beenden = useCallback(() => setLauf(null), []);

  return { ctx, angebot, form, lauf, starten, starteBestimmte, beenden, vermerkeIn };
}
