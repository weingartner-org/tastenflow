/**
 * ★★★ „WIR HABEN EINE ANDERE TASTATUR ERKANNT - ÜBERNEHMEN?" (W2b, 28.09.2026).
 *
 * Windows-Befund §3.7: erkennen, VORSCHLAGEN, in den Einstellungen änderbar -
 * nie still überschreiben, was jemand gewählt hat. Der Streifen steht über der
 * Übung, solange die erkannte Tastatur eine andere ist als die eingestellte.
 *
 *  · „Übernehmen" stellt um (`setLayout`, dieselbe Stelle wie Einrichtung und
 *    Zahnrad), „Nein, danke" merkt sich diese eine Erkennung auf dem Gerät -
 *    eine ANDERE erkannte Tastatur fragt wieder. Danach geht der Fokus in die
 *    Übungszeile (Hausregel: jeder Schalter hat ein Fokus-Ziel).
 *  · Passt die erkannte Tastatur nicht zum Lehrgang (Kind auf Weg „fr" an
 *    einer deutschen Tastatur), gibt es nichts zu übernehmen - dann sagt der
 *    Streifen nur, was er sieht, mit „Verstanden".
 *  · ⚠️ KEINE Live-Region: Das Kind tippt vielleicht gerade, und alles, was in
 *    einen Live-Bereich geht, springt als Blitzmeldung auf die Braillezeile
 *    (Übergabe 09.09.2026: „die Zeile darf nie springen"). Der Streifen steht
 *    im Tab-Weg vor der Übung und wird dort gefunden.
 */
import { texte, useBedienSprache } from "@/lib/bedienSprache";
import { focusPracticeField } from "@/lib/typing/focusField";
import { layoutById, setLayout, type LayoutId } from "@/lib/typing/layouts";
// ★ O-IT (02.10.2026): Tastatur-Namen über `layoutTexteIn` - italienisch beschriftet (layouts.ts bleibt unberührt).
import { layoutTexteIn } from "@/lib/typing/tastaturTexteIt";
import type { Lernweg } from "@/lib/typing/lernweg";
import { tastaturPasstZumWeg } from "@/lib/typing/wegTastaturen";
import { useState } from "react";
import { useKeyboardLayout } from "./useKeyboardLayout";
import { useTastaturErkennung } from "./useTastaturErkennung";
import { wegName } from "./WegJeKind";

/** Auf diesem Gerät abgelehnt: die Kennung der erkannten Tastatur. */
export const VORSCHLAG_NEIN_MERKER = "tastenflow-tastatur-vorschlag-nein";

function abgelehnt(id: LayoutId): boolean {
  try {
    return window.localStorage.getItem(VORSCHLAG_NEIN_MERKER) === id;
  } catch {
    return false;
  }
}
function merkeAbgelehnt(id: LayoutId) {
  try {
    window.localStorage.setItem(VORSCHLAG_NEIN_MERKER, id);
  } catch {
    /* Speicher gesperrt - dann fragt es beim nächsten Laden wieder */
  }
}

export const VORSCHLAG_TEXTE = texte({
  de: {
    erkannt: (name: string) => `Wir haben eine andere Tastatur erkannt: ${name}.`,
    frage: "Übernehmen?",
    uebernehmen: "Übernehmen",
    nein: "Nein, danke",
    passtNicht: (weg: string) => `Dein Lehrgang ${weg} braucht eine andere Tastatur.`,
    verstanden: "Verstanden",
  },
  en: {
    erkannt: (name: string) => `We have detected a different keyboard: ${name}.`,
    frage: "Use it?",
    uebernehmen: "Use this keyboard",
    nein: "No, thanks",
    passtNicht: (weg: string) => `Your ${weg} course needs a different keyboard.`,
    verstanden: "Got it",
  },
  fr: {
    erkannt: (name: string) => `Nous avons détecté un autre clavier : ${name}.`,
    frage: "Le choisir ?",
    uebernehmen: "Choisir ce clavier",
    nein: "Non, merci",
    passtNicht: (weg: string) => `Ton parcours ${weg} a besoin d'un autre clavier.`,
    verstanden: "D'accord",
  },
  es: {
    erkannt: (name: string) => `Hemos detectado otro teclado: ${name}.`,
    frage: "¿Usarlo?",
    uebernehmen: "Usar este teclado",
    nein: "No, gracias",
    passtNicht: (weg: string) => `Tu recorrido de ${weg} necesita otro teclado.`,
    verstanden: "Entendido",
  },
  it: {
    erkannt: (name: string) => `Abbiamo riconosciuto un'altra tastiera: ${name}.`,
    frage: "Usarla?",
    uebernehmen: "Usa questa tastiera",
    nein: "No, grazie",
    passtNicht: (weg: string) => `Il tuo percorso di ${weg} ha bisogno di un'altra tastiera.`,
    verstanden: "Ho capito",
  },
  // ★ O-PL (02.10.2026): -no-Form „Wykryto" (Glossar Regel 2), Name nach
  // Doppelpunkt, Kursname in „…” (nicht gebeugt, Regel 11); „Rozumiem" (Regel 12).
  pl: {
    erkannt: (name: string) => `Wykryto inną klawiaturę: ${name}.`,
    frage: "Użyć jej?",
    uebernehmen: "Użyj tej klawiatury",
    nein: "Nie, dziękuję",
    passtNicht: (weg: string) => `Twój kurs „${weg}” wymaga innej klawiatury.`,
    verstanden: "Rozumiem",
  },
  // ★ O-TR (02.10.2026): Passiv "algılandı", Name nach Doppelpunkt, Kursname in
  // geraden Anführungszeichen ohne Endung (Regel 6/7); Fragepartikel nur am
  // festen Wort ("kullanılsın mı?"); "Anladım" (Regel 10).
  tr: {
    erkannt: (name: string) => `Başka bir klavye algılandı: ${name}.`,
    frage: "Bu klavye kullanılsın mı?",
    uebernehmen: "Bu klavyeyi kullan",
    nein: "Hayır, teşekkürler",
    passtNicht: (weg: string) => `Kursun ("${weg}") başka bir klavye gerektiriyor.`,
    verstanden: "Anladım",
  },
  // ★ O-CS (03.10.2026): „Aplikace rozpoznala" (Vergangenheit am Ding, nie am
  // Kind - Glossar Regel 2), Name nach Doppelpunkt, Kursname in Klammern
  // (ungebeugt, Regel 12); „Rozumím" (Regel 10).
  cs: {
    erkannt: (name: string) => `Aplikace rozpoznala jinou klávesnici: ${name}.`,
    frage: "Použít ji?",
    uebernehmen: "Použít tuto klávesnici",
    nein: "Ne, děkuji",
    passtNicht: (weg: string) => `Tvůj kurz (${weg}) potřebuje jinou klávesnici.`,
    verstanden: "Rozumím",
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      erkannt: (name: string) => `Разпознахме друга клавиатура: ${name}.`,
      frage: "Да я използваме ли?",
      uebernehmen: "Използвай я",
      nein: "Не, благодаря",
      // ${weg} ist der Sprachname klein („български") - „курс по български".
      passtNicht: (weg: string) => `Курсът ти по ${weg} има нужда от друга клавиатура.`,
      verstanden: "Разбрах",
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      erkannt: (name: string) => `Βρήκαμε ένα άλλο πληκτρολόγιο: ${name}.`,
      frage: "Να χρησιμοποιηθεί;",
      uebernehmen: "Χρήση αυτού του πληκτρολογίου",
      nein: "Όχι, ευχαριστώ",
      passtNicht: (weg: string) => `Το πρόγραμμά σου (${weg}) χρειάζεται άλλο πληκτρολόγιο.`,
      verstanden: "Κατάλαβα",
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      erkannt: (name: string) => `Másik billentyűzetet észleltünk: ${name}.`,
      frage: "Ezt használod?",
      uebernehmen: "Átvétel",
      nein: "Nem, köszönöm",
      passtNicht: (weg: string) => `A tanfolyamodhoz (${weg}) másik billentyűzet kell.`,
      verstanden: "Értem",
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      erkannt: (name: string) => `We hebben een ander toetsenbord herkend: ${name}.`,
      frage: "Overnemen?",
      uebernehmen: "Dit toetsenbord gebruiken",
      nein: "Nee, bedankt",
      passtNicht: (weg: string) => `Je cursus ${weg} heeft een ander toetsenbord nodig.`,
      verstanden: "Begrepen",
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      erkannt: (name: string) => `Detetámos outro teclado: ${name}.`,
      frage: "Usar este?",
      uebernehmen: "Usar este teclado",
      nein: "Não, manter o atual",
      passtNicht: (weg: string) => `O teu curso (${weg}) precisa de outro teclado.`,
      verstanden: "Entendido",
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      erkannt: (name: string) => `Detectamos outro teclado: ${name}.`,
      frage: "Usar este teclado?",
      uebernehmen: "Usar este teclado",
      // „Não, obrigado/obrigada" verrät das Geschlecht (Glossar Regel 2).
      nein: "Não usar",
      passtNicht: (weg: string) => `O seu curso ${weg} precisa de outro teclado.`,
      verstanden: "Entendi",
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      erkannt: (name: string) => `Am recunoscut o altă tastatură: ${name}.`,
      frage: "O folosim?",
      uebernehmen: "Folosiți tastatura",
      nein: "Nu, mulțumesc",
      passtNicht: (weg: string) => `Parcursul tău (${weg}) are nevoie de altă tastatură.`,
      verstanden: "Am înțeles",
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      erkannt: (name: string) => `Ett annat tangentbord hittades: ${name}.`,
      frage: "Vill du använda det?",
      uebernehmen: "Använd det",
      nein: "Nej tack",
      passtNicht: (weg: string) => `Din kurs (${weg}) behöver ett annat tangentbord.`,
      verstanden: "Jag förstår",
    },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: {
      erkannt: (name: string) => `Виявлено іншу клавіатуру: ${name}.`,
      frage: "Застосувати?",
      uebernehmen: "Застосувати",
      nein: "Ні, дякую",
      // Lernweg-Name in Klammern, ungebeugt (Glossar §2.12).
      passtNicht: (weg: string) => `Твоєму курсу (${weg}) потрібна інша клавіатура.`,
      verstanden: "Зрозуміло",
    },
});

export function TastaturVorschlag({ lernweg, bereit }: { lernweg: Lernweg; bereit: boolean }) {
  const { spracheGewaehlt: sprache } = useBedienSprache();
  const t = VORSCHLAG_TEXTE[sprache];
  const eingestellt = useKeyboardLayout();
  const erkannt = useTastaturErkennung();
  // Nach „Nein"/„Verstanden" sofort weg - der Merker gilt ab dem nächsten Laden.
  const [weg, setWeg] = useState<LayoutId | null>(null);
  if (!bereit || !erkannt || erkannt.art !== "app") return null;
  const id = erkannt.id;
  if (id === eingestellt.id || weg === id || abgelehnt(id)) return null;
  const name = layoutTexteIn(layoutById(id), sprache).label;
  const passt = tastaturPasstZumWeg(id, lernweg);
  const schliesse = () => {
    merkeAbgelehnt(id);
    setWeg(id);
    focusPracticeField();
  };
  return (
    <div
      className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border-2 border-accent bg-surface-raised px-4 py-3 text-base text-ink"
      data-testid="tastatur-vorschlag"
    >
      <span>
        {t.erkannt(name)} {passt ? t.frage : t.passtNicht(wegName(lernweg, sprache))}
      </span>
      {passt ? (
        <>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setLayout(id);
              focusPracticeField();
            }}
          >
            {t.uebernehmen}
          </button>
          <button type="button" className="btn-secondary btn-toggle" onClick={schliesse}>
            {t.nein}
          </button>
        </>
      ) : (
        <button type="button" className="btn-secondary btn-toggle" onClick={schliesse}>
          {t.verstanden}
        </button>
      )}
    </div>
  );
}
