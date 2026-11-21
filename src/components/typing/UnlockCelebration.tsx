/**
 * Große Freischalt-Feier des Tipptrainers „Tastenflow": Sobald ein neuer
 * Buchstabe / ein neues Zeichen dazukommt, poppt diese Karte vollflächig auf,
 * eine festliche Fanfare spielt und — bei eingeschaltetem Vorlesen — sagt die
 * (altersgerecht konfigurierte) Stimme an, WIE das Zeichen getippt wird, z. B.
 * „Gratulation! Das Sonderzeichen Prozent ist freigeschaltet. Es wird mit
 * Umschalt und Fünf geschrieben." Wunsch von Johannes.
 *
 * Barrierefrei: role="dialog" MIT Fokus-Falle, Anfangsfokus auf „Weiter",
 * Escape/Klick schließt, und die Bewegungen respektieren „weniger Bewegung"
 * (globale prefers-reduced-motion-Regel in index.css).
 * ★ Sie schließt sich NICHT mehr von selbst (Nr 12, siehe unten).
 * Siehe [[project_zehnfinger_trainer]].
 */
import { Fragment, useEffect, useRef } from "react";
import { useFocusTrap } from "./useFocusTrap";
import {
  type Skin,
  playUnlockFanfare,
  showsConfetti,
  speak,
  speakUi,
  unlockBrailleLabel,
  unlockBrailleLabelEn,
  unlockBrailleLabelFr,
  unlockBrailleLabelEs,
  unlockInfo,
  unlockInfoEn,
  unlockInfoFr,
  unlockInfoEs,
  type UnlockInfo,
  unlockSpeechAlle,
  vorleseSprache,
} from "@/lib/typing";
import type { Lernweg } from "@/lib/typing/lernweg";
import { unlockBrailleLabelIt, unlockInfoIt, unlockSpeechAlleIt } from "@/lib/typing/freischaltungIt";
import { unlockBrailleLabelPl, unlockInfoPl, unlockSpeechAllePl } from "@/lib/typing/freischaltungPl";
import { unlockBrailleLabelTr, unlockInfoTr, unlockSpeechAlleTr } from "@/lib/typing/freischaltungTr";
import { unlockBrailleLabelCs, unlockInfoCs, unlockSpeechAlleCs } from "@/lib/typing/freischaltungCs";
// ★ G3c-VERTEILER (25.10.2026): die Feier der neun Gerüst-Sprachen (`freischaltung<Xx>.ts`, heute die englische).
import { unlockBrailleLabelBg, unlockInfoBg, unlockSpeechAlleBg } from "@/lib/typing/freischaltungBg";
import { unlockBrailleLabelEl, unlockInfoEl, unlockSpeechAlleEl } from "@/lib/typing/freischaltungEl";
import { unlockBrailleLabelHu, unlockInfoHu, unlockSpeechAlleHu } from "@/lib/typing/freischaltungHu";
import { unlockBrailleLabelNl, unlockInfoNl, unlockSpeechAlleNl } from "@/lib/typing/freischaltungNl";
import { unlockBrailleLabelPt, unlockInfoPt, unlockSpeechAllePt } from "@/lib/typing/freischaltungPt";
import { unlockBrailleLabelBr, unlockInfoBr, unlockSpeechAlleBr } from "@/lib/typing/freischaltungBr";
import { unlockBrailleLabelRo, unlockInfoRo, unlockSpeechAlleRo } from "@/lib/typing/freischaltungRo";
import { unlockBrailleLabelSv, unlockInfoSv, unlockSpeechAlleSv } from "@/lib/typing/freischaltungSv";
import { unlockBrailleLabelUk, unlockInfoUk, unlockSpeechAlleUk } from "@/lib/typing/freischaltungUk";
import { istGeruestSprache, type GeruestSprache } from "@/lib/typing/sprachRegister";
import { texte, useBedienSprache, type BedienSprache } from "@/lib/bedienSprache";

/**
 * Die sichtbaren Texte der Feier in beiden Bedienungssprachen (12.09.2026).
 * Deutsch wortgleich wie vorher. Die GESPROCHENE Ansage folgte im Probestück
 * der Übungssprache (`unlockSpeech` mit `vorleseSprache()`, Bauplan §3.5).
 * ★ EN1 (19.09.2026): In Tastenflow (`bereichAktiv`) spricht die Karte in der
 * BEDIENUNGSSPRACHE und mit ihrer Stimme - sie sagt, was auf ihr steht
 * (Name der Taste, wie man sie tippt), und das steht in dieser Sprache da.
 * Ohne aktiven Sprachbereich: wie bisher.
 */
const FEIER_TEXTE = texte({
  de: {
    vorspann: (sober: boolean) => (sober ? "Neu freigeschaltet" : "Gratulation, neu freigeschaltet!"),
    weiter: (sober: boolean) => (sober ? "Weiter" : "Super, weiter!"),
    name: (vorspann: string, kopf: string, wie: string) => `${vorspann}: ${kopf}. ${wie}`,
    und: "und",
  },
  en: {
    vorspann: (sober: boolean) => (sober ? "New for you" : "Well done! New for you"),
    weiter: (sober: boolean) => (sober ? "Continue" : "Great, keep going!"),
    name: (vorspann: string, kopf: string, wie: string) => `${vorspann}: ${kopf}. ${wie}`,
    und: "and",
  },
  fr: {
    vorspann: (sober: boolean) => (sober ? "Nouveau pour toi" : "Bravo, nouveau pour toi !"),
    weiter: (sober: boolean) => (sober ? "Continuer" : "Super, on continue !"),
    name: (vorspann: string, kopf: string, wie: string) => `${vorspann} : ${kopf}. ${wie}`,
    und: "et",
  },
  es: {
    vorspann: (sober: boolean) => (sober ? "Nuevo para ti" : "¡Muy bien, nuevo para ti!"),
    weiter: (sober: boolean) => (sober ? "Continuar" : "¡Genial, seguimos!"),
    name: (vorspann: string, kopf: string, wie: string) => `${vorspann}: ${kopf}. ${wie}`,
    und: "y",
  },
  // ★ O-IT (02.10.2026): Lob ohne Adjektiv-Endung (Glossar Regel 2), ein „!" je Meldung.
  it: {
    vorspann: (sober: boolean) => (sober ? "Nuovo per te" : "Ottimo lavoro, nuovo per te!"),
    weiter: (sober: boolean) => (sober ? "Avanti" : "Fantastico, avanti!"),
    name: (vorspann: string, kopf: string, wie: string) => `${vorspann}: ${kopf}. ${wie}`,
    und: "e",
  },
  // ★ O-PL (02.10.2026): „Nowość dla ciebie" (Glossar §2.11); das Lob über die
  // Sache, nie über das Kind (Regel 2), ein „!" je Meldung; Knopf „Dalej".
  pl: {
    vorspann: (sober: boolean) => (sober ? "Nowość dla ciebie" : "Świetna robota, nowość dla ciebie!"),
    weiter: (sober: boolean) => (sober ? "Dalej" : "Super, dalej!"),
    // Ohne das „!" des Vorspanns vor dem Doppelpunkt („…dla ciebie: litera Ł.").
    name: (vorspann: string, kopf: string, wie: string) => `${vorspann.replace(/!$/, "")}: ${kopf}. ${wie}`,
    und: "i",
  },
  // ★ O-TR (02.10.2026): „Senin için yeni", sen; ein „!" je Meldung; Knopf
  // „Devam et" (Glossar Regel 10). Die Zeile über der Karte steht in CSS
  // `uppercase` - türkisch gerechnet, weil `<html lang>` der Bedienung folgt
  // (`BedienSpracheProvider`, Glossar §1 Regel 9: „HARİKA", nie „HARIKA").
  tr: {
    vorspann: (sober: boolean) => (sober ? "Senin için yeni" : "Harika, senin için yeni!"),
    weiter: (sober: boolean) => (sober ? "Devam et" : "Süper, devam et!"),
    // Ohne das „!" des Vorspanns vor dem Doppelpunkt („…için yeni: R harfi.").
    name: (vorspann: string, kopf: string, wie: string) => `${vorspann.replace(/!$/, "")}: ${kopf}. ${wie}`,
    und: "ve",
  },
  // ★ O-CS (03.10.2026): „Novinka pro tebe" (Glossar §2.4), ty; das Lob ist ein
  // Ausruf ohne Geschlecht („Výborně"), nie „Dokázal jsi to" (Regel 2); ein „!"
  // je Meldung; Knopf „Pokračovat" (Glossar Regel 10). Die Zeile über der Karte
  // steht in CSS `uppercase` - tschechisch ohne Sonderfall.
  cs: {
    vorspann: (sober: boolean) => (sober ? "Novinka pro tebe" : "Výborně, novinka pro tebe!"),
    weiter: (sober: boolean) => (sober ? "Pokračovat" : "Super, pokračovat!"),
    // Ohne das „!" des Vorspanns vor dem Doppelpunkt („...pro tebe: písmeno ř.").
    name: (vorspann: string, kopf: string, wie: string) => `${vorspann.replace(/!$/, "")}: ${kopf}. ${wie}`,
    und: "a",
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      vorspann: (sober: boolean) => (sober ? "Ново за теб" : "Браво! Ново за теб"),
      weiter: (sober: boolean) => (sober ? "Продължи" : "Супер, продължаваме!"),
      name: (vorspann: string, kopf: string, wie: string) => `${vorspann}: ${kopf}. ${wie}`,
      und: "и",
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      vorspann: (sober: boolean) => (sober ? "Κάτι νέο για σένα" : "Μπράβο! Κάτι νέο για σένα"),
      weiter: (sober: boolean) => (sober ? "Συνέχεια" : "Τέλεια, συνεχίζουμε!"),
      name: (vorspann: string, kopf: string, wie: string) => `${vorspann}: ${kopf}. ${wie}`,
      und: "και",
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      vorspann: (sober: boolean) => (sober ? "Újdonság neked" : "Nagyszerű! Újdonság neked"),
      weiter: (sober: boolean) => (sober ? "Tovább" : "Szuper, tovább!"),
      name: (vorspann: string, kopf: string, wie: string) => `${vorspann}: ${kopf}. ${wie}`,
      und: "és",
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      vorspann: (sober: boolean) => (sober ? "Nieuw voor jou" : "Goed gedaan! Nieuw voor jou"),
      weiter: (sober: boolean) => (sober ? "Verder" : "Super, verder!"),
      name: (vorspann: string, kopf: string, wie: string) => `${vorspann}: ${kopf}. ${wie}`,
      und: "en",
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      vorspann: (sober: boolean) => (sober ? "Novidade para ti" : "Muito bem! Novidade para ti"),
      weiter: (sober: boolean) => (sober ? "Continuar" : "Boa, continuar!"),
      name: (vorspann: string, kopf: string, wie: string) => `${vorspann}: ${kopf}. ${wie}`,
      und: "e",
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      vorspann: (sober: boolean) => (sober ? "Novidade para você" : "Muito bem! Novidade para você"),
      weiter: (sober: boolean) => (sober ? "Continuar" : "Ótimo, vamos lá!"),
      name: (vorspann: string, kopf: string, wie: string) => `${vorspann}: ${kopf}. ${wie}`,
      und: "e",
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      vorspann: (sober: boolean) => (sober ? "Noutate pentru tine" : "Foarte bine! Noutate pentru tine"),
      weiter: (sober: boolean) => (sober ? "Mai departe" : "Super, mai departe!"),
      name: (vorspann: string, kopf: string, wie: string) => `${vorspann}: ${kopf}. ${wie}`,
      und: "și",
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      vorspann: (sober: boolean) => (sober ? "Nytt för dig" : "Bra jobbat! Nytt för dig"),
      weiter: (sober: boolean) => (sober ? "Fortsätt" : "Toppen, fortsätt!"),
      name: (vorspann: string, kopf: string, wie: string) => `${vorspann}: ${kopf}. ${wie}`,
      und: "och",
    },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: {
      vorspann: (sober: boolean) => (sober ? "Нове для тебе" : "Чудово! Нове для тебе"),
      weiter: (sober: boolean) => (sober ? "Далі" : "Супер, далі!"),
      name: (vorspann: string, kopf: string, wie: string) => `${vorspann}: ${kopf}. ${wie}`,
      und: "і",
    },
});

/**
 * ★ E11a-5 (26.09.2026): Karte und Braillezeilen-Meldung je Bedienungssprache -
 * Tabellen statt `sprache === "en" ? … : …`, die „fr" still deutsch gelassen
 * hätten (Leitfaden Falle 30).
 */
const FEIER_INFO: Record<BedienSprache, (unit: string, lernweg?: Lernweg) => UnlockInfo> = {
  de: unlockInfo,
  en: unlockInfoEn,
  fr: unlockInfoFr,
  es: unlockInfoEs,
  // ★ O-IT (02.10.2026): der italienische Zwilling steht in `freischaltungIt.ts`.
  it: unlockInfoIt,
  // ★ O-PL (02.10.2026): der polnische Zwilling steht in `freischaltungPl.ts`.
  pl: unlockInfoPl,
  // ★ O-TR (02.10.2026): der türkische Zwilling steht in `freischaltungTr.ts`.
  tr: unlockInfoTr,
  // ★ O-CS (03.10.2026): der tschechische Zwilling steht in `freischaltungCs.ts`.
  cs: unlockInfoCs,
  // ★ O2-COMP (30.10.2026): die neun Sprachen mit eigener Fassung.
  bg: unlockInfoBg,
  el: unlockInfoEl,
  hu: unlockInfoHu,
  nl: unlockInfoNl,
  pt: unlockInfoPt,
  br: unlockInfoBr,
  ro: unlockInfoRo,
  sv: unlockInfoSv,
  uk: unlockInfoUk,
};
const FEIER_BRAILLE: Record<BedienSprache, (unit: string, lernweg?: Lernweg) => string> = {
  de: unlockBrailleLabel,
  en: unlockBrailleLabelEn,
  fr: unlockBrailleLabelFr,
  es: unlockBrailleLabelEs,
  it: unlockBrailleLabelIt,
  pl: unlockBrailleLabelPl,
  tr: unlockBrailleLabelTr, // ★ O-TR (02.10.2026)
  cs: unlockBrailleLabelCs, // ★ O-CS (03.10.2026)
  // ★ O2-COMP (30.10.2026): die neun Sprachen mit eigener Fassung.
  bg: unlockBrailleLabelBg,
  el: unlockBrailleLabelEl,
  hu: unlockBrailleLabelHu,
  nl: unlockBrailleLabelNl,
  pt: unlockBrailleLabelPt,
  br: unlockBrailleLabelBr,
  ro: unlockBrailleLabelRo,
  sv: unlockBrailleLabelSv,
  uk: unlockBrailleLabelUk,
};

/** ★ G3c-VERTEILER (25.10.2026): die gesprochene Ansage der neun Gerüst-Sprachen (heute dieselbe englische wie vorher). */
const FEIER_ANSAGE_GERUEST: Readonly<Record<GeruestSprache, (units: readonly string[], sober: boolean, lernweg?: Lernweg) => string>> = {
  bg: unlockSpeechAlleBg,
  el: unlockSpeechAlleEl,
  hu: unlockSpeechAlleHu,
  nl: unlockSpeechAlleNl,
  pt: unlockSpeechAllePt,
  br: unlockSpeechAlleBr,
  ro: unlockSpeechAlleRo,
  sv: unlockSpeechAlleSv,
  uk: unlockSpeechAlleUk,
};

/*
 * ★ Nr 12 der Fokusziele (22.08.2026): Der SELBSTSCHLIESSER IST WEG.
 *
 * Sieben Sekunden nach dem Erscheinen verschwand die Karte von selbst - und
 * mit ihr der Knopf „Weiter", auf dem der Fokus stand. Ein fokussiertes
 * Element, das ein Zeitgeber aus dem Baum nimmt, ist genau das, was Regel 0.1
 * verbietet: Wer die Ansage noch hörte oder auf der Braillezeile las, stand
 * mitten im Satz im Nichts. Das Kind drückt jetzt „Weiter" (die Eingabetaste
 * genügt, der Knopf hat den Fokus) - oder Escape, oder es fängt einfach an zu
 * tippen. Nichts verschwindet mehr unter dem Fokus.
 */

/** Konfetti-Stückchen (rein dekorativ): Streuung nach links/rechts + Versatz. */
const CONFETTI = Array.from({ length: 14 }, (_, i) => ({
  x: `${(i % 2 ? 1 : -1) * (3 + (i % 7) * 1.6)}rem`,
  delay: `${(i % 5) * 90}ms`,
  color: ["--c-accent-solid", "--c-warning", "--c-success", "--c-accent-solid"][i % 4],
}));

export interface UnlockCelebrationProps {
  /** Freigeschaltete Einheit (Zeichen oder „⇧"); null = nichts zeigen. */
  unit: string | null;
  /**
   * ★★★ ES-M2 (27.09.2026, Prüfbericht ES-P2 M1): Einheiten, die in DERSELBEN
   * Runde mit `unit` gekommen sind (¿ mit ?, ¡ mit !). Bis hierher bekam die
   * Karte nur die letzte neue Einheit - das öffnende Zeichen, das es nur im
   * Spanischen gibt, wurde nie vorgestellt. Jede Einheit bekommt jetzt ihren
   * Namen und ihren Griff, auf der Karte, auf der Braillezeile und in der
   * Ansage. Leer oder fehlend: die Karte wie bisher.
   */
  mit?: readonly string[];
  /**
   * ★ ES-M2: der Weg des Kindes - damit Französisch und Spanisch die
   * Totasten-Einheiten („´" „^" „¨") als Taste + Vokal vorstellen und
   * Zeichen, die nur ihr Weg kennt („¿" „_"), richtig einordnen.
   */
  lernweg?: Lernweg;
  /**
   * Das Spiel als BELOHNUNG (14.08.2026): Seit „Freischalten und Feiern sind
   * getrennt" ist die Taste schon verdient, wenn diese Karte erscheint — das
   * Spiel kommt danach freiwillig obendrauf. Ist der Slot gesetzt, steht neben
   * „Weiter" ein zweiter Knopf. (Bis zum 22.08.2026 steuerte dieser Slot auch,
   * ob die Karte sich nach sieben Sekunden selbst schloss - den Selbstschließer
   * gibt es nicht mehr, sie wartet jetzt IMMER auf eine Antwort.)
   */
  belohnung?: { frage: string; label: string; onStart: () => void };
  /**
   * Profil: kind (7-10) bekommt Jubel + Konfetti, jugend und erwachsen die
   * sachliche Feier ganz ohne beides.
   */
  skin: Skin;
  /** Schließen (Klick, Escape, „Weiter"). */
  onClose: () => void;
}

// ★ O-CS (03.10.2026): gilt auch für cs - `nachgestellt` (Gattungswort hinter dem Namen) bleibt türkisch; tschechisch
// steht es davor wie in den übrigen Sprachen („písmeno ř").
export function UnlockCelebration({
  unit,
  mit,
  lernweg,
  skin,
  belohnung,
  onClose,
}: UnlockCelebrationProps) {
  // Ruhige WORTE für alle außer dem Kinder-Profil (die Anrede kommt in dieser
  // Karte nicht vor, darum teilen sich jugend und erwachsen eine Fassung). Das
  // KONFETTI folgt separat `showsConfetti` — eigene Achse, siehe skin.ts.
  const sober = skin !== "kind";
  const closeRef = useRef<HTMLButtonElement>(null);
  /** Die Karte selbst - der Rahmen, in dem Tab gefangen bleibt (Nr 12). */
  const cardRef = useRef<HTMLDivElement>(null);
  // Eigene Alarm-Region: NVDA blendet sie sofort auf der Braillezeile ein
  // („Neuer Buchstabe R") — unabhängig davon, was gerade den Fokus hat.
  const brailleRef = useRef<HTMLDivElement>(null);
  // Immer die AKTUELLE onClose-Funktion, ohne sie in die Effekt-Abhängigkeiten
  // zu nehmen: Der Eltern-Trainer reicht onClose als frische Arrow-Funktion
  // durch, die bei jedem Re-Render (z. B. Alt+V, Sprachwechsel) neu entsteht.
  // Läge onClose in den Deps, spielte die Fanfare erneut (K18).
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  // Über einen Ref, aus demselben Grund wie `onCloseRef` (K18): Ein Sprachwechsel
  // bei offener Karte darf die Fanfare nicht noch einmal auslösen.
  const { sprache, bereichAktiv } = useBedienSprache();
  const spracheRef = useRef(sprache);
  spracheRef.current = sprache;
  const bereichAktivRef = useRef(bereichAktiv);
  bereichAktivRef.current = bereichAktiv;
  // Alle Einheiten dieser Feier, in der Reihenfolge der Freischaltung. Der
  // Effekt unten hängt an einem SCHLÜSSEL aus Zeichen, nicht am Feld: ein neu
  // gebautes Feld bei jedem Neuzeichnen spielte sonst die Fanfare erneut (K18).
  const alle = unit ? [unit, ...(mit ?? []).filter((u) => u !== unit)] : [];
  const alleSchluessel = alle.join("\n");
  const alleRef = useRef(alle);
  alleRef.current = alle;
  const lernwegRef = useRef(lernweg);
  lernwegRef.current = lernweg;

  // Klang + Ansage beim Erscheinen. Den Fokus setzt die Fokus-Falle unten,
  // einen Selbstschließer gibt es seit dem 22.08.2026 nicht mehr (s. o.).
  // Nur an [unit, sober] gekoppelt — der eigentliche Auslöser (neues Zeichen).
  useEffect(() => {
    if (!unit) return;
    playUnlockFanfare();
    // Kurze Freischalt-Meldung auf die Braillezeile schieben (nach dem Mounten
    // gesetzt, damit role="alert" zuverlässig auslöst).
    const einheiten = alleRef.current;
    const weg = lernwegRef.current;
    if (brailleRef.current)
      brailleRef.current.textContent = einheiten
        .map((u) => FEIER_BRAILLE[spracheRef.current](u, weg))
        .join(", ");
    // Kurz nach der Fanfare sprechen, damit beides nicht übereinanderliegt.
    // Sie geht über `speak` heraus, also mit der INHALTS-Stimme - bei englischem
    // Inhalt mit einer englischen. Bis 29.08.2026 stand dort trotzdem deutscher
    // Text; das war Jens' Befund an einer Stelle, die niemand nachgesehen hatte.
    const sp = window.setTimeout(() => {
      if (bereichAktivRef.current) {
        const b = spracheRef.current;
        // ★ O-IT (02.10.2026): Italienisch über `freischaltungIt.ts` (`letters.ts` bleibt unberührt).
        // ★ O-PL (02.10.2026): Polnisch ebenso über `freischaltungPl.ts`.
        // ★ O-TR (02.10.2026): Türkisch ebenso über `freischaltungTr.ts`.
        // ★ O-CS (03.10.2026): Tschechisch ebenso über `freischaltungCs.ts`.
        const satz =
          b === "it"
            ? unlockSpeechAlleIt(einheiten, sober, weg)
            : b === "pl"
              ? unlockSpeechAllePl(einheiten, sober, weg)
              : b === "tr"
                ? unlockSpeechAlleTr(einheiten, sober, weg)
                : b === "cs"
                  ? unlockSpeechAlleCs(einheiten, sober, weg)
                  : istGeruestSprache(b)
                    ? FEIER_ANSAGE_GERUEST[b](einheiten, sober, weg)
                    : unlockSpeechAlle(einheiten, sober, b, weg);
        speakUi(satz, undefined, undefined, b);
      } else {
        const v = vorleseSprache();
        speak(
          v === "it"
            ? unlockSpeechAlleIt(einheiten, sober, weg)
            : v === "pl"
              ? unlockSpeechAllePl(einheiten, sober, weg)
              : v === "tr"
                ? unlockSpeechAlleTr(einheiten, sober, weg)
                : v === "cs"
                  ? unlockSpeechAlleCs(einheiten, sober, weg)
                  : istGeruestSprache(v)
                    ? FEIER_ANSAGE_GERUEST[v](einheiten, sober, weg)
                    : unlockSpeechAlle(einheiten, sober, v, weg),
        );
      }
    }, 650);
    return () => window.clearTimeout(sp);
  }, [unit, alleSchluessel, sober]);

  // ★ Nr 12 der Fokusziele (22.08.2026): FOKUS-FALLE. Die Karte trug seit jeher
  // `aria-modal="true"`, hielt Tab aber nicht fest - man tabbte in die Seite,
  // die der Sprachausgabe als verdeckt gemeldet ist. `useFocusTrap` setzt
  // zugleich den Anfangsfokus auf „Weiter" (bisher tat das der Effekt oben)
  // und gibt ihn beim Schließen NICHT an den Öffner zurück: Der Öffner ist die
  // Runde, die gerade zu Ende ging, und die gibt es nicht mehr. Wohin es
  // stattdessen geht, sagt der Trainer (R2, Eingabezeile).
  useFocusTrap(!!unit, cardRef, { initialFocus: closeRef });

  // Escape schließt (R6: die Eingabezeile holt der Trainer im `onClose`).
  useEffect(() => {
    if (!unit) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [unit]);

  if (!unit) return null;
  const t = FEIER_TEXTE[sprache];
  const infos = alle.map((u) => FEIER_INFO[sprache](u, lernweg));
  // `noun` darf leer sein (englische Satzzeichen: „the question mark").
  // ★ O-TR (02.10.2026): Türkisch stellt das Gattungswort HINTER den Namen („R harfi").
  const nachgestellt = sprache === "tr";
  const kopfVon = (i: UnlockInfo) =>
    i.name
      ? (nachgestellt ? [i.name, i.noun] : [i.article, i.noun, i.name]).filter(Boolean).join(" ")
      : i.noun;
  const headline = infos.map(kopfVon).join(` ${t.und} `);
  const lead = t.vorspann(sober);
  const mehrere = infos.length > 1;

  return (
    <div
      className="tt-celebrate"
      role="dialog"
      aria-modal="true"
      aria-label={t.name(lead, headline, infos.map((i) => i.howTo).join(" "))}
      onClick={onClose}
    >
      {/* Freischalt-Meldung für die Braillezeile (NVDA) + Screenreader-Sprache. */}
      <div ref={brailleRef} className="sr-only" role="alert" />
      {/* Klick auf die Karte selbst soll nicht sofort durchschließen, aber der
          „Weiter"-Knopf und der Hintergrund tun es — daher stopPropagation. */}
      <div
        ref={cardRef}
        className="tt-celebrate-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Konfetti hängt bewusst NICHT an `sober`, sondern an einer eigenen
            Achse: Gesehen wird es nur von dem, der selbst davorsitzt — der
            gesprochene Jubel dagegen von der halben Klasse (30.07.). */}
        {!showsConfetti(skin) ? null : CONFETTI.map((c, i) => (
          <span
            key={i}
            className="tt-confetti"
            aria-hidden="true"
            style={
              {
                background: `rgb(var(${c.color}))`,
                ["--tt-x" as string]: c.x,
                ["--tt-delay" as string]: c.delay,
              } as React.CSSProperties
            }
          />
        ))}
        <span className="tt-ring" aria-hidden="true" />

        <p className="m-0 text-sm font-semibold uppercase tracking-wide text-accent">
          {lead}
        </p>
        <div className="tt-celebrate-glyph my-2 text-ink" aria-hidden="true">
          {infos.map((i) => i.glyph).join(" ")}
        </div>
        {infos.map((i, n) => {
          // Eine Einheit: dieselben zwei Absätze wie bisher, ohne Hülle.
          const Huelle = mehrere ? "div" : Fragment;
          const huelleProps = mehrere ? { className: n > 0 ? "mt-3" : undefined } : {};
          return (
          <Huelle key={alle[n]} {...huelleProps}>
            <p className="m-0 text-xl font-bold text-ink">
              {i.name && nachgestellt ? (
                <>
                  <span className="font-legible">{i.name}</span>
                  {i.noun ? ` ${i.noun}` : ""}
                  {mehrere && <span className="font-legible"> {alle[n]}</span>}
                </>
              ) : i.name ? (
                <>
                  {i.article} {i.noun ? `${i.noun} ` : ""}
                  <span className="font-legible">{i.name}</span>
                  {mehrere && <span className="font-legible"> {alle[n]}</span>}
                </>
              ) : (
                i.noun
              )}
            </p>
            <p className="mx-auto mb-0 mt-2 max-w-prose text-base text-ink-soft">
              {i.howTo}
            </p>
          </Huelle>
          );
        })}

        {belohnung && (
          <p className="mx-auto mb-0 mt-3 max-w-prose text-base font-semibold text-ink">
            {belohnung.frage}
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <button
            ref={closeRef}
            type="button"
            className={belohnung ? "btn btn-secondary" : "btn btn-primary"}
            onClick={onClose}
          >
            {t.weiter(sober)}
          </button>
          {belohnung && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={belohnung.onStart}
            >
              {belohnung.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
