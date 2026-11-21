/**
 * ★★★ „VERWENDEST DU EINE FRANZÖSISCHE TASTATUR?" - BEIM ERSTEN START (W2b,
 * 28.09.2026). Die Entscheidung, OB gefragt wird, steht rein in
 * `lib/typing/sprachwahlTastatur.ts`; hier nur das Fenster.
 *
 * Das Fenster spricht die Sprache, die gerade GEWÄHLT wurde - wer im
 * Sprachwähler „Français" anklickt, liest Französisch; die Knöpfe sind bis zur
 * Antwort noch in der bisherigen Sprache, das Fenster selbst nicht. Darum
 * trägt es sein eigenes `lang`. Anrede „du" wie überall auf der Übungsseite.
 * „Nein", Escape und ✕: Sprache und Tastatur bleiben, wie sie waren; der Fokus
 * geht zurück auf den Sprachwähler (das `Modal` gibt ihn dem Auslöser zurück).
 */
import type { RueckfrageWeg } from "@/lib/typing/sprachwahlTastatur";
import { TastaturRueckfrage } from "./TastaturRueckfrage";

/** ★ O2-SONST (30.10.2026): `lang` am Fenster - `br` ist kein Sprachcode. */
const LANG_ABWEICHEND: Partial<Record<RueckfrageWeg, string>> = { pt: "pt-PT", br: "pt-BR" };

const TEXTE: Readonly<
  Record<RueckfrageWeg, { titel: string; achtung: string; nein: string; frage: string; ja: string; nee: string }>
> = {
  fr: {
    titel: "Clavier pour le français",
    achtung: "Attention : le parcours en français n'est possible qu'avec le clavier adapté.",
    nein: "Si tu réponds non, la langue reste celle d'avant.",
    frage: "Utilises-tu un clavier français (France, Belgique, Suisse ou Canada) ?",
    ja: "Oui",
    nee: "Non",
  },
  es: {
    titel: "Teclado para español",
    achtung: "Atención: el recorrido en español solo es posible con el teclado adecuado.",
    nein: "Si respondes que no, el idioma sigue siendo el de antes.",
    frage: "¿Usas un teclado español (España o Latinoamérica)?",
    ja: "Sí",
    nee: "No",
  },
  // ★ F5-F8-it (02.10.2026): Italienisch - Glossar §1 Nr. 1 (Kinder: tu), Tastaturen des Weges: Italien, Schweiz, San Marino.
  it: {
    titel: "Tastiera per l'italiano",
    achtung: "Attenzione: il percorso in italiano è possibile solo con la tastiera adatta.",
    nein: "Se rispondi no, la lingua resta quella di prima.",
    frage: "Usi una tastiera italiana (Italia, Svizzera o San Marino)?",
    ja: "Sì",
    nee: "No",
  },
  // ★ F5-F8-tr (03.10.2026): Türkisch - Kinder: sen (Glossar §1 Regel 1), „kurs" für den Lehrgang, Knöpfe im Stamm; nur die Q-Tastatur
  // gehört zum Weg (Türkei, Zypern; `tr-f` bekommt später einen eigenen Weg).
  tr: {
    titel: "Türkçe için klavye",
    achtung: "Dikkat: Türkçe kursu yalnızca uygun klavyeyle yapılabilir.",
    nein: "Hayır dersen dil eskisi gibi kalır.",
    frage: "Türkçe Q klavye kullanıyor musun (Türkiye ya da Kıbrıs)?",
    ja: "Evet",
    nee: "Hayır",
  },
  // ★ F5-F8-pl (03.10.2026): Polnisch - Glossar §1 Nr. 1 (Kinder: ty, Befehlsform), ohne Geschlecht (Regel 2); Tastaturen des
  // Weges: nur `pl` (Windows „Polski (programisty)", Mac „Polski Pro"). Die Frage im Genitiv wie in `TASTATUR_FRAGE` (WegJeKind).
  pl: {
    titel: "Klawiatura do polskiego",
    achtung: "Uwaga: kurs polski działa tylko z pasującą klawiaturą.",
    nein: "Jeśli odpowiesz „nie”, język zostanie taki, jaki był.",
    frage: "Czy używasz polskiej klawiatury (układ programisty)?",
    ja: "Tak",
    nee: "Nie",
  },
  // ★ F5-F8-cs (03.10.2026): Tschechisch - Glossar §1 Regel 1 (Kinder: ty), nur Gegenwart und Zukunft (Regel 2: kein Geschlecht), „klávesnice"
  // (§2.1). Tastaturen des Weges: Česká (QWERTZ) und Česká (QWERTY). Nicht von einer Person mit Tschechisch als Erstsprache gelesen.
  cs: {
    titel: "Klávesnice pro češtinu",
    achtung: "Pozor: kurz češtiny je možný jen se správnou klávesnicí.",
    nein: "Když odpovíš ne, jazyk zůstane takový, jaký byl.",
    frage: "Používáš českou klávesnici (QWERTZ nebo QWERTY)?",
    ja: "Ano",
    nee: "Ne",
  },
  // ★ O2-SONST (30.10.2026): die neun, nicht von Personen mit der Sprache als Erstsprache gelesen.
  bg: {
    titel: "Клавиатура за български",
    achtung: "Внимание: курсът на български е възможен само с подходящата клавиатура.",
    nein: "Ако отговориш не, езикът остава какъвто беше.",
    frage: "Използваш ли българска клавиатура (БДС или фонетична)?",
    ja: "Да",
    nee: "Не",
  },
  el: {
    titel: "Πληκτρολόγιο για τα Ελληνικά",
    achtung: "Προσοχή: το πρόγραμμα στα Ελληνικά γίνεται μόνο με το κατάλληλο πληκτρολόγιο.",
    nein: "Αν απαντήσεις όχι, η γλώσσα μένει όπως ήταν.",
    frage: "Χρησιμοποιείς ελληνικό πληκτρολόγιο (Windows ή Mac);",
    ja: "Ναι",
    nee: "Όχι",
  },
  hu: {
    titel: "Billentyűzet a magyar nyelvhez",
    achtung: "Figyelem: a magyar nyelvű tanfolyam csak a megfelelő billentyűzettel lehetséges.",
    nein: "Ha nemmel válaszolsz, a nyelv a régi marad.",
    frage: "Magyar billentyűzetet használsz (QWERTZ vagy 101 billentyűs QWERTY)?",
    ja: "Igen",
    nee: "Nem",
  },
  nl: {
    titel: "Toetsenbord voor het Nederlands",
    achtung: "Let op: de Nederlandse cursus kan alleen met het juiste toetsenbord.",
    nein: "Als je nee antwoordt, blijft de taal zoals die was.",
    frage: "Gebruik je een toetsenbord voor Nederlands (Verenigde Staten internationaal, Nederlands of Belgisch)?",
    ja: "Ja",
    nee: "Nee",
  },
  pt: {
    titel: "Teclado para português",
    achtung: "Atenção: o curso em português só é possível com o teclado adequado.",
    nein: "Se responderes que não, a língua fica como estava.",
    frage: "Usas um teclado português (Portugal)?",
    ja: "Sim",
    nee: "Não",
  },
  br: {
    titel: "Teclado para português do Brasil",
    achtung: "Atenção: o curso em português do Brasil só é possível com o teclado adequado.",
    nein: "Se você responder não, o idioma continua como estava.",
    frage: "Você usa um teclado brasileiro (ABNT2)?",
    ja: "Sim",
    nee: "Não",
  },
  ro: {
    titel: "Tastatură pentru limba română",
    achtung: "Atenție: parcursul în limba română este posibil numai cu tastatura potrivită.",
    nein: "Dacă răspunzi nu, limba rămâne cea de dinainte.",
    frage: "Folosești o tastatură română (standard sau programatori)?",
    ja: "Da",
    nee: "Nu",
  },
  sv: {
    titel: "Tangentbord för svenska",
    achtung: "Obs: kursen på svenska går bara med rätt tangentbord.",
    nein: "Om du svarar nej behålls språket du hade innan.",
    frage: "Använder du ett svenskt tangentbord (Sverige eller Finland)?",
    ja: "Ja",
    nee: "Nej",
  },
  uk: {
    titel: "Клавіатура для української",
    achtung: "Увага: курс української можливий лише з відповідною клавіатурою.",
    nein: "Якщо відповіси ні, мова залишиться такою, як була.",
    frage: "Ти користуєшся українською клавіатурою (стандартною або розширеною)?",
    ja: "Так",
    nee: "Ні",
  },
};

export function SprachwahlRueckfrage({
  weg,
  onJa,
  onNein,
}: {
  weg: RueckfrageWeg;
  onJa: () => void;
  onNein: () => void;
}) {
  const t = TEXTE[weg];
  return (
    <TastaturRueckfrage
      titel={t.titel}
      saetze={[t.achtung, t.nein]}
      frage={t.frage}
      ja={t.ja}
      nein={t.nee}
      lang={LANG_ABWEICHEND[weg] ?? weg}
      onJa={onJa}
      onNein={onNein}
    />
  );
}
