/**
 * ★★ SCHRIFTWAHL im Zahnrad (09.10.2026) - siehe `src/lib/typing/schriftart.ts`.
 *
 * Eine Liste statt eines `<select>`: Jede Zeile zeigt eine Probe IN ihrer
 * Schrift - das ist die Vorschau. Ein `<option>` lässt sich in den meisten
 * Browsern nicht in eigener Schrift zeichnen.
 *
 * ★★★ KONTROLLKÄSTCHEN, keine Optionsfelder (Bauart §4, Wächter
 * `arbeitsblatt-bauart-ratsche`): Wer eine Optionsgruppe mit den Pfeiltasten
 * durchliest, wählt dabei jede Schrift aus. Hier geht Tab weiter, die
 * Leertaste kreuzt an, das vorige Kreuz verschwindet; ein zweiter Druck nimmt
 * das Kreuz weg - dann gilt wieder die Vorgabe (Atkinson).
 *
 * Die Probe ist in jeder Sprache gleich - sie zeigt die Buchstaben, die man
 * verwechseln kann (b d, I l 1, 0 O, 6 9), nicht einen Satz.
 */
import { useEffect, useId, useRef, useState } from "react";
import { texte, useBedienSprache } from "@/lib/bedienSprache";
import { ansageGewaehlt } from "@/lib/typing";
import { SCHRIFT_VORGABE, schriftWirksam, schriftZu, schriftenFuer, useSchriftart, type SchriftId } from "@/lib/typing/schriftart";
import { useBedienStimme } from "./useBedienStimme";

export const SCHRIFT_PROBE = "Aa Bb Dd Gg Il1 0O 69";

export const SCHRIFT_NACHWEIS =
  "Primæ: Titus Nemeth, Martin Tiefenthaler, Wiener Bildungsserver (prima.wien, CC BY-NC-SA 4.0) · " +
  "Luciole: CTRDV, typographies.fr (CC BY 4.0) · " +
  "MM Schuldruck: Judex 2001, lehrerweb.wien (nur nicht kommerziell, schulisch) · " +
  "Atkinson Hyperlegible (auch Mono), Andika, Lexend, OpenDyslexic, Inclusive Sans: SIL OFL 1.1";

export const SCHRIFT_T = texte({
  de: {
    titel: "Schrift",
    name: "Schrift im Übungsfeld",
    hinweis:
      "Ändert nur die Zeile zum Abschreiben und das, was du tippst - das Programm selbst bleibt, wie es ist. Gilt auf diesem Gerät.",
    empfohlen: "empfohlen",
    artAtkinson: "für Menschen mit Sehbehinderung entwickelt, Buchstaben gut unterscheidbar",
    artMono: "jedes Zeichen gleich breit, gut lesbar - Ziffern stehen genau untereinander",
    artPrimaeDruck: "Wiener Schulschrift, Druckschrift",
    artPrimaeSchreib: "Wiener Schulschrift, Schreibschrift",
    artAndika: "für Leseanfängerinnen und Leseanfänger",
    artLexend: "breite Buchstaben, ruhiges Lesen",
    artLuciole: "für Menschen mit Sehbehinderung entwickelt",
    artOpendyslexic: "für Kinder mit Lese-Rechtschreib-Schwierigkeiten",
    artInclusive: "klare, offene Formen",
    artMm: "österreichische Schul-Druckschrift (Blockschrift), wie in Fibeln",
  },
  en: {
    titel: "Font",
    name: "Font in the practice field",
    hinweis:
      "Changes only the line you copy and what you type - the rest of the program stays as it is. Applies on this device.",
    empfohlen: "recommended",
    artAtkinson: "made for people with low vision, letters easy to tell apart",
    artMono: "every character the same width, easy to read - digits line up exactly",
    artPrimaeDruck: "Vienna school font, print",
    artPrimaeSchreib: "Vienna school font, joined-up handwriting",
    artAndika: "for beginning readers",
    artLexend: "wide letters, calm reading",
    artLuciole: "made for people with low vision",
    artOpendyslexic: "for children with dyslexia",
    artInclusive: "clear, open shapes",
    artMm: "Austrian school print (block letters), as in primers",
  },
  fr: {
    titel: "Police",
    name: "Police du champ d'exercice",
    hinweis:
      "Change seulement la ligne à recopier et ce que tu tapes - le reste du programme ne change pas. Vaut pour cet appareil.",
    empfohlen: "recommandée",
    artAtkinson: "conçue pour les personnes malvoyantes, lettres faciles à distinguer",
    artMono: "chaque caractère a la même largeur, très lisible - les chiffres s'alignent",
    artPrimaeDruck: "écriture scolaire de Vienne, script",
    artPrimaeSchreib: "écriture scolaire de Vienne, cursive",
    artAndika: "pour les lecteurs débutants",
    artLexend: "lettres larges, lecture calme",
    artLuciole: "conçue pour les personnes malvoyantes",
    artOpendyslexic: "pour les enfants dyslexiques",
    artInclusive: "formes claires et ouvertes",
    artMm: "écriture scolaire autrichienne en script (capitales d'imprimerie)",
  },
  es: {
    titel: "Letra",
    name: "Letra del campo de práctica",
    hinweis:
      "Cambia solo la línea que copias y lo que escribes; el resto del programa no cambia. Vale para este dispositivo.",
    empfohlen: "recomendada",
    artAtkinson: "creada para personas con baja visión, letras fáciles de distinguir",
    artMono: "todos los caracteres con el mismo ancho, muy legible - las cifras quedan alineadas",
    artPrimaeDruck: "letra escolar de Viena, imprenta",
    artPrimaeSchreib: "letra escolar de Viena, cursiva",
    artAndika: "para quienes empiezan a leer",
    artLexend: "letras anchas, lectura tranquila",
    artLuciole: "creada para personas con baja visión",
    artOpendyslexic: "para niños y niñas con dislexia",
    artInclusive: "formas claras y abiertas",
    artMm: "letra escolar austriaca de imprenta (de palo)",
  },
  it: {
    titel: "Carattere",
    name: "Carattere del campo di esercizio",
    hinweis:
      "Cambia solo la riga da ricopiare e ciò che scrivi - il resto del programma resta com'è. Vale su questo dispositivo.",
    empfohlen: "consigliato",
    artAtkinson: "creato per persone ipovedenti, lettere facili da distinguere",
    artMono: "ogni carattere ha la stessa larghezza, molto leggibile - le cifre restano allineate",
    artPrimaeDruck: "scrittura scolastica di Vienna, stampatello",
    artPrimaeSchreib: "scrittura scolastica di Vienna, corsivo",
    artAndika: "per chi inizia a leggere",
    artLexend: "lettere larghe, lettura tranquilla",
    artLuciole: "creato per persone ipovedenti",
    artOpendyslexic: "per bambini con dislessia",
    artInclusive: "forme chiare e aperte",
    artMm: "stampatello scolastico austriaco, come nei sillabari",
  },
  pl: {
    titel: "Czcionka",
    name: "Czcionka w polu ćwiczeń",
    hinweis:
      "Zmienia tylko wiersz do przepisania i to, co piszesz - reszta programu zostaje bez zmian. Obowiązuje na tym urządzeniu.",
    empfohlen: "zalecana",
    artAtkinson: "stworzona dla osób słabowidzących, litery łatwo odróżnić",
    artMono: "każdy znak tej samej szerokości, dobrze czytelna - cyfry leżą dokładnie pod sobą",
    artPrimaeDruck: "wiedeńskie pismo szkolne, drukowane",
    artPrimaeSchreib: "wiedeńskie pismo szkolne, odręczne",
    artAndika: "dla początkujących czytelników",
    artLexend: "szerokie litery, spokojne czytanie",
    artLuciole: "stworzona dla osób słabowidzących",
    artOpendyslexic: "dla dzieci z dysleksją",
    artInclusive: "wyraźne, otwarte kształty",
    artMm: "austriackie szkolne pismo drukowane (blokowe)",
  },
  tr: {
    titel: "Yazı tipi",
    name: "Alıştırma alanının yazı tipi",
    hinweis:
      "Yalnızca kopyalanacak satırı ve yazdıklarını değiştirir - programın geri kalanı aynı kalır. Bu cihazda geçerlidir.",
    empfohlen: "önerilen",
    artAtkinson: "az gören kişiler için geliştirildi, harfler kolayca ayırt edilir",
    artMono: "her karakter aynı genişlikte, kolay okunur - rakamlar tam alt alta gelir",
    artPrimaeDruck: "Viyana okul yazısı, matbaa harfleri",
    artPrimaeSchreib: "Viyana okul yazısı, bitişik el yazısı",
    artAndika: "okumaya yeni başlayanlar için",
    artLexend: "geniş harfler, sakin okuma",
    artLuciole: "az gören kişiler için geliştirildi",
    artOpendyslexic: "disleksisi olan çocuklar için",
    artInclusive: "net, açık biçimler",
    artMm: "Avusturya okul matbaa yazısı (blok harfler)",
  },
  cs: {
    titel: "Písmo",
    name: "Písmo v poli na cvičení",
    hinweis:
      "Mění jen řádek k opisování a to, co píšeš - zbytek programu zůstane stejný. Platí na tomto zařízení.",
    empfohlen: "doporučeno",
    artAtkinson: "vytvořeno pro lidi se zrakovým postižením, písmena se snadno rozliší",
    artMono: "každý znak stejně široký, dobře čitelné - číslice jsou přesně pod sebou",
    artPrimaeDruck: "vídeňské školní písmo, tiskací",
    artPrimaeSchreib: "vídeňské školní písmo, psací",
    artAndika: "pro začínající čtenáře",
    artLexend: "široká písmena, klidné čtení",
    artLuciole: "vytvořeno pro lidi se zrakovým postižením",
    artOpendyslexic: "pro děti s dyslexií",
    artInclusive: "jasné, otevřené tvary",
    artMm: "rakouské školní tiskací písmo (bloková abeceda)",
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      titel: "Шрифт",
      name: "Шрифт в полето за писане",
      hinweis:
        "Променя само реда за преписване и това, което пишеш - останалата част от програмата остава същата. Важи за това устройство.",
      empfohlen: "препоръчан",
      artAtkinson: "създаден за хора със зрителни увреждания, буквите се различават лесно",
      artMono: "всеки знак е еднакво широк, лесно се чете - цифрите стоят точно една под друга",
      artPrimaeDruck: "виенски училищен шрифт, печатни букви",
      artPrimaeSchreib: "виенски училищен шрифт, ръкописни букви",
      artAndika: "за деца, които тепърва се учат да четат",
      artLexend: "широки букви, спокойно четене",
      artLuciole: "създаден за хора със зрителни увреждания",
      artOpendyslexic: "за деца с трудности при четене и писане",
      artInclusive: "ясни, отворени форми",
      artMm: "австрийски училищен печатен шрифт (главни печатни букви), като в букварите",
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      titel: "Γραμματοσειρά",
      name: "Γραμματοσειρά στο πεδίο γραφής",
      hinweis:
        "Αλλάζει μόνο τη γραμμή που αντιγράφεις και ό,τι γράφεις - το υπόλοιπο πρόγραμμα μένει όπως είναι. Ισχύει σε αυτή τη συσκευή.",
      empfohlen: "προτείνεται",
      artAtkinson: "φτιάχτηκε για άτομα με προβλήματα όρασης, τα γράμματα ξεχωρίζουν εύκολα",
      artMono: "κάθε χαρακτήρας έχει το ίδιο πλάτος, διαβάζεται εύκολα - τα ψηφία στοιχίζονται ακριβώς",
      artPrimaeDruck: "σχολική γραμματοσειρά της Βιέννης, έντυπα γράμματα",
      artPrimaeSchreib: "σχολική γραμματοσειρά της Βιέννης, καλλιγραφικά γράμματα",
      artAndika: "για όσους μόλις μαθαίνουν να διαβάζουν",
      artLexend: "φαρδιά γράμματα, ήρεμο διάβασμα",
      artLuciole: "φτιάχτηκε για άτομα με προβλήματα όρασης",
      artOpendyslexic: "για παιδιά με δυσλεξία",
      artInclusive: "καθαρά, ανοιχτά σχήματα",
      artMm: "αυστριακή σχολική έντυπη γραφή (κεφαλαία), όπως στα αναγνωστικά",
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      titel: "Betűtípus",
      name: "Betűtípus a gépelési mezőben",
      hinweis:
        "Csak a másolandó sort és azt változtatja meg, amit gépelsz - a program többi része marad, ahogy van. Ezen az eszközön érvényes.",
      empfohlen: "ajánlott",
      artAtkinson: "látássérült emberek számára fejlesztették, a betűk jól megkülönböztethetők",
      artMono: "minden karakter egyforma széles, jól olvasható - a számjegyek pontosan egymás alatt állnak",
      artPrimaeDruck: "bécsi iskolai betűtípus, nyomtatott",
      artPrimaeSchreib: "bécsi iskolai betűtípus, írott",
      artAndika: "kezdő olvasóknak",
      artLexend: "széles betűk, nyugodt olvasás",
      artLuciole: "látássérült emberek számára fejlesztették",
      artOpendyslexic: "diszlexiával élő gyerekeknek",
      artInclusive: "tiszta, nyitott formák",
      artMm: "osztrák iskolai nyomtatott betű (blokkbetű), mint az ábécéskönyvekben",
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      titel: "Lettertype",
      name: "Lettertype in het typveld",
      hinweis:
        "Verandert alleen de regel die je overtypt en wat je typt - de rest van het programma blijft zoals het is. Geldt op dit apparaat.",
      empfohlen: "aanbevolen",
      artAtkinson: "ontwikkeld voor mensen met een visuele beperking, letters goed te onderscheiden",
      artMono: "elk teken even breed, goed leesbaar - cijfers staan precies onder elkaar",
      artPrimaeDruck: "Weense schoolletter, drukletters",
      artPrimaeSchreib: "Weense schoolletter, schrijfletters",
      artAndika: "voor beginnende lezers",
      artLexend: "brede letters, rustig lezen",
      artLuciole: "ontwikkeld voor mensen met een visuele beperking",
      artOpendyslexic: "voor kinderen met dyslexie",
      artInclusive: "heldere, open vormen",
      artMm: "Oostenrijkse schooldrukletter (blokletters), zoals in leesboekjes",
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      titel: "Letra",
      name: "Letra no campo de escrita",
      hinweis:
        "Muda só a linha a copiar e o que escreves - o resto do programa fica igual. Aplica-se a este dispositivo.",
      empfohlen: "recomendada",
      artAtkinson: "criada para pessoas com baixa visão, letras fáceis de distinguir",
      artMono: "todos os carateres com a mesma largura, fácil de ler - os algarismos ficam alinhados",
      artPrimaeDruck: "letra escolar de Viena, letra de imprensa",
      artPrimaeSchreib: "letra escolar de Viena, letra manuscrita ligada",
      artAndika: "para quem está a começar a ler",
      artLexend: "letras largas, leitura tranquila",
      artLuciole: "criada para pessoas com baixa visão",
      artOpendyslexic: "para crianças com dislexia",
      artInclusive: "formas claras e abertas",
      artMm: "letra de imprensa escolar austríaca (letras de bloco), como nos livros de iniciação à leitura",
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      titel: "Fonte",
      name: "Fonte do campo de digitação",
      hinweis:
        "Muda só a linha para copiar e o que você digita - o resto do programa fica como está. Vale neste aparelho.",
      empfohlen: "recomendada",
      artAtkinson: "criada para pessoas com baixa visão, letras fáceis de distinguir",
      artMono: "todos os caracteres com a mesma largura, boa leitura - os algarismos ficam exatamente alinhados",
      artPrimaeDruck: "letra escolar de Viena, letra de forma",
      artPrimaeSchreib: "letra escolar de Viena, letra cursiva",
      artAndika: "para quem está começando a ler",
      artLexend: "letras largas, leitura tranquila",
      artLuciole: "criada para pessoas com baixa visão",
      artOpendyslexic: "para crianças com dislexia",
      artInclusive: "formas claras e abertas",
      artMm: "letra de forma escolar austríaca (letra bastão), como nas cartilhas",
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      titel: "Font",
      name: "Fontul din câmpul de scriere",
      hinweis:
        "Schimbă doar rândul de copiat și ce scrii tu - restul programului rămâne la fel. Se aplică pe acest dispozitiv.",
      empfohlen: "recomandat",
      artAtkinson: "creat pentru persoane cu deficiențe de vedere, litere ușor de deosebit",
      artMono: "fiecare caracter are aceeași lățime, ușor de citit - cifrele stau exact una sub alta",
      artPrimaeDruck: "scrierea școlară vieneză, litere de tipar",
      artPrimaeSchreib: "scrierea școlară vieneză, litere de mână",
      artAndika: "pentru cei care învață să citească",
      artLexend: "litere late, citire liniștită",
      artLuciole: "creat pentru persoane cu deficiențe de vedere",
      artOpendyslexic: "pentru copii cu dificultăți de citire și scriere",
      artInclusive: "forme clare, deschise",
      artMm: "scrierea școlară de tipar din Austria (litere bloc), ca în abecedare",
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      titel: "Typsnitt",
      name: "Typsnitt i skrivfältet",
      hinweis:
        "Ändrar bara raden du skriver av och det du skriver - resten av programmet är som det är. Gäller på den här enheten.",
      empfohlen: "rekommenderas",
      artAtkinson: "utvecklat för personer med synnedsättning, bokstäverna är lätta att skilja åt",
      artMono: "alla tecken lika breda, lättläst - siffrorna står exakt under varandra",
      artPrimaeDruck: "Wiens skolstil, tryckbokstäver",
      artPrimaeSchreib: "Wiens skolstil, skrivstil",
      artAndika: "för den som just har börjat läsa",
      artLexend: "breda bokstäver, lugn läsning",
      artLuciole: "utvecklat för personer med synnedsättning",
      artOpendyslexic: "för barn med läs- och skrivsvårigheter",
      artInclusive: "tydliga, öppna former",
      artMm: "österrikisk skolstil med tryckbokstäver, som i läseböcker",
    },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: {
      titel: "Шрифт",
      name: "Шрифт у полі для друку",
      hinweis:
        "Змінює лише рядок для переписування і те, що ти друкуєш, - решта програми залишається незмінною. Діє на цьому пристрої.",
      empfohlen: "рекомендовано",
      artAtkinson: "створено для людей з порушенням зору, літери легко розрізнити",
      artMono: "усі знаки однакової ширини, добре читається - цифри стоять точно одна під одною",
      artPrimaeDruck: "віденський шкільний шрифт, друковані літери",
      artPrimaeSchreib: "віденський шкільний шрифт, рукописні літери",
      artAndika: "для тих, хто тільки вчиться читати",
      artLexend: "широкі літери, спокійне читання",
      artLuciole: "створено для людей з порушенням зору",
      artOpendyslexic: "для дітей із труднощами читання й письма",
      artInclusive: "чіткі, відкриті форми",
      artMm: "австрійський шкільний друкований шрифт (блокові літери), як у букварях",
    },
});

export interface SchriftWahlProps {
  /** Mit der Schrift gleicher Breite (Plus). Ohne: wie in Tastenflow. */
  mitMono?: boolean;
  /** Eigener Name und Hinweis der App - sonst die von Tastenflow („Übungszeile"). */
  name?: string;
  hinweis?: string;
}

export function SchriftWahl({ mitMono = false, name, hinweis }: SchriftWahlProps = {}) {
  const { spracheGewaehlt: sprache } = useBedienSprache();
  const t = SCHRIFT_T[sprache];
  const stimme = useBedienStimme();
  const schrift = schriftWirksam(useSchriftart((s) => s.schrift), mitMono);
  const setSchrift = useSchriftart((s) => s.setSchrift);
  const art: Record<SchriftId, string> = {
    atkinson: t.artAtkinson,
    mono: t.artMono,
    "primae-druck": t.artPrimaeDruck,
    "primae-schreib": t.artPrimaeSchreib,
    andika: t.artAndika,
    lexend: t.artLexend,
    luciole: t.artLuciole,
    opendyslexic: t.artOpendyslexic,
    inclusive: t.artInclusive,
    "mm-schuldruck": t.artMm,
  };
  const nameId = useId();
  const hinweisId = useId();
  const listeId = useId();
  const wahlId = useId();
  // ★ Johannes 09.10.2026 abends: *„die schriftarten nehmen viel platz im
  // einstellungsmenü, mach ein pull downmenü auch mit schriftvorschau"*.
  // Ein natives `<select>` zeigt die Einträge unter macOS nicht in ihrer
  // Schrift - darum ein Knopf, der die Liste aufklappt (`aria-expanded`).
  // Nach der Wahl klappt sie zu, der Fokus steht wieder auf dem Knopf (R1);
  // Escape klappt zu, ohne das Zahnrad zu schliessen (siehe unten).
  const [offen, setOffen] = useState(false);
  const knopfRef = useRef<HTMLButtonElement>(null);
  const aktuell = schriftZu(schrift);
  const nameVon = (id: SchriftId) =>
    `${schriftZu(id).name}${id === SCHRIFT_VORGABE ? ` (${t.empfohlen})` : ""}`;
  const zuklappen = () => {
    setOffen(false);
    knopfRef.current?.focus();
  };
  // ⚠️ Escape: Das Zahnrad (`Modal.tsx`, gehört allen Apps) hört auf
  // `document` in der Fangphase und schliesst sofort - ein `onKeyDown` hier
  // käme zu spät. `window` in der Fangphase liegt davor; solange die Liste
  // offen ist, klappt Escape nur sie zu.
  useEffect(() => {
    if (!offen) return;
    const beiTaste = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      e.stopPropagation();
      setOffen(false);
      knopfRef.current?.focus();
    };
    window.addEventListener("keydown", beiTaste, true);
    return () => window.removeEventListener("keydown", beiTaste, true);
  }, [offen]);

  return (
    <div className="flex w-full flex-col gap-1">
      <span id={nameId} className="text-sm text-ink-soft">
        {name ?? t.name}
      </span>
      <button
        ref={knopfRef}
        type="button"
        aria-expanded={offen}
        aria-controls={listeId}
        aria-labelledby={`${nameId} ${wahlId}`}
        aria-describedby={hinweisId}
        onClick={() => setOffen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-hairline bg-surface px-2 py-1.5 text-left"
      >
        <span className="flex min-w-0 flex-col">
          <span id={wahlId} className="text-sm text-ink">
            <span className="font-semibold">{nameVon(aktuell.id)}</span>
            {" - "}
            {art[aktuell.id]}
          </span>
          <span
            aria-hidden="true"
            className="text-xl leading-snug text-ink"
            style={{ fontFamily: `${aktuell.familie}, "Atkinson Hyperlegible", sans-serif` }}
          >
            {SCHRIFT_PROBE}
          </span>
        </span>
        <span aria-hidden="true" className="text-ink-muted">
          {offen ? "▲" : "▼"}
        </span>
      </button>
      {offen && (
        <div
          id={listeId}
          role="group"
          aria-labelledby={nameId}
          className="flex flex-col gap-1"
        >
          {schriftenFuer(mitMono).map((s) => {
            const gewaehlt = s.id === schrift;
            return (
              <label
                key={s.id}
                className={
                  "flex cursor-pointer items-start gap-2 rounded-lg border px-2 py-1.5 " +
                  (gewaehlt ? "border-accent bg-accent/10" : "border-hairline")
                }
              >
                <input
                  type="checkbox"
                  value={s.id}
                  checked={gewaehlt}
                  className="mt-1.5"
                  onChange={(e) => {
                    const neu = e.target.checked ? s.id : SCHRIFT_VORGABE;
                    setSchrift(neu);
                    stimme.sprich(ansageGewaehlt(`${nameVon(neu)}, ${art[neu]}`, stimme.lang()));
                    zuklappen();
                  }}
                />
                <span className="flex min-w-0 flex-col">
                  <span className="text-sm text-ink">
                    <span className="font-semibold">{nameVon(s.id)}</span>
                    {" - "}
                    {art[s.id]}
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-xl leading-snug text-ink"
                    style={{ fontFamily: `${s.familie}, "Atkinson Hyperlegible", sans-serif` }}
                  >
                    {SCHRIFT_PROBE}
                  </span>
                </span>
              </label>
            );
          })}
          {/* Namensnennung, die CC BY / CC BY-NC-SA verlangen - Eigennamen, in
              jeder Sprache gleich. Volle Angaben: public/fonts/SCHRIFTEN-LIZENZEN.md. */}
          <p className="m-0 text-sm text-ink-muted">{SCHRIFT_NACHWEIS}</p>
        </div>
      )}
      <p id={hinweisId} className="m-0 text-sm text-ink-muted">
        {hinweis ?? t.hinweis}
      </p>
    </div>
  );
}
