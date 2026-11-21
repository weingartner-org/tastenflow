import { useCallback, useState } from "react";
import { texte, type BedienSprache } from "@/lib/bedienSprache";
import { feststelltasteGewollt } from "@/lib/typing/feststelltasteGewollt";
import { feststelltasteHinweisText } from "@/lib/typing/totastenTexte";
import { Merkfenster } from "./Merkfenster";

/**
 * Feststelltaste an: bei JEDEM Buchstaben ein Fenster, das mit „Weiter"
 * bestätigt wird (Johannes 12.10.2026: „als Popup, mit Weiter bestätigt").
 * Das Fenster liest sich selbst vor (`Merkfenster`: aria-describedby, Stimme
 * nur bei „Vorlesen an") - keine Blitzmeldung auf der Braillezeile.
 */
const FENSTER = texte({
  de: { tipp: "Drück die Feststelltaste ⇪ einmal, dann schreibst du wieder klein.", weiter: "Weiter" },
  en: { tipp: "Press the Caps Lock key ⇪ once to type lowercase again.", weiter: "Continue" },
  fr: { tipp: "Appuie une fois sur Verr. Maj ⇪ pour écrire de nouveau en minuscules.", weiter: "Continuer" },
  es: { tipp: "Pulsa Bloq Mayús ⇪ una vez para escribir de nuevo en minúsculas.", weiter: "Continuar" },
  it: { tipp: "Premi una volta Bloc Maiusc ⇪ per scrivere di nuovo in minuscolo.", weiter: "Continua" },
  pl: { tipp: "Naciśnij raz Caps Lock ⇪, aby znów pisać małymi literami.", weiter: "Dalej" },
  tr: { tipp: "Küçük harfle yazmak için Caps Lock ⇪ tuşuna bir kez bas.", weiter: "Devam" },
  cs: { tipp: "Jednou stiskni klávesu Caps Lock ⇪ a piš zase malými písmeny.", weiter: "Pokračovat" },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: { tipp: "Натисни веднъж Caps Lock ⇪ и отново пишеш с малки букви.", weiter: "Продължи" },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: { tipp: "Πάτησε μία φορά το Caps Lock ⇪ και θα γράφεις ξανά πεζά.", weiter: "Συνέχεια" },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: { tipp: "Nyomd meg egyszer a Caps Lock billentyűt ⇪, és újra kisbetűvel írsz.", weiter: "Tovább" },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: { tipp: "Druk één keer op Caps Lock ⇪, dan typ je weer kleine letters.", weiter: "Verder" },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: { tipp: "Prime a tecla Caps Lock ⇪ uma vez para voltares a escrever em minúsculas.", weiter: "Continuar" },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: { tipp: "Pressione Caps Lock ⇪ uma vez para voltar a digitar em minúsculas.", weiter: "Continuar" },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: { tipp: "Apasă o dată tasta Caps Lock ⇪, apoi scrii din nou cu litere mici.", weiter: "Mai departe" },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: { tipp: "Tryck en gång på Caps Lock ⇪, så skriver du med små bokstäver igen.", weiter: "Fortsätt" },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: { tipp: "Натисни один раз клавішу Caps Lock ⇪ - і знову друкуватимеш малими літерами.", weiter: "Далі" },
});

export function FeststelltasteFenster({
  sprache,
  onSchliessen,
}: {
  sprache: BedienSprache;
  onSchliessen: () => void;
}) {
  const t = FENSTER[sprache];
  return (
    <Merkfenster
      titel={`⇪ ${feststelltasteHinweisText(sprache)}`}
      absaetze={[t.tipp]}
      knopf={t.weiter}
      onSchliessen={onSchliessen}
    />
  );
}

/** Für die Bildschirme ohne `TypingSession` (Rätsel, Freies Schreiben). */
export function useFeststelltasteWarnung(sprache: BedienSprache) {
  const [offen, setOffen] = useState(false);
  const pruefe = useCallback(
    (e: { key: string; getModifierState?: (taste: "CapsLock") => boolean }) => {
      if (!/^\p{L}$/u.test(e.key)) return;
      if (typeof e.getModifierState !== "function" || !e.getModifierState("CapsLock")) return;
      if (feststelltasteGewollt(e.key)) return; // Schweiz: Ä Ö Ü
      setOffen(true);
    },
    [],
  );
  const hinweis = offen ? (
    <FeststelltasteFenster sprache={sprache} onSchliessen={() => setOffen(false)} />
  ) : null;
  return { pruefe, hinweis };
}
