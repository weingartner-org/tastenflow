/**
 * Die Bildschirm-Tastatur als ein- und ausklappbarer Bereich.
 *
 * Beim ERSTEN Besuch AUSGEKLAPPT (Wunsch Johannes 09.08.2026 — wer tippen
 * lernt, braucht die Tastatur vor Augen; sie erst suchen zu müssen, war die
 * falsche Vorgabe). Danach merkt sich der Browser den zuletzt gewählten
 * Zustand (localStorage): Wer sie zuklappt, findet sie beim nächsten Einstieg
 * zugeklappt vor — und wer sie wieder aufklappt, offen. Gleiche Mechanik wie
 * die Ton-Schalter in sound.ts; NUR die Vorgabe hat sich gedreht (bis
 * 09.08.2026: eingeklappt, Wunsch vom 07.07.).
 * Ausgeklappt nutzt sie die volle verfügbare Breite, statt klein in der Mitte
 * zu stehen — skaliert über die Schriftgröße, weil die Tasten in `em` bemessen
 * sind. Die em-Breite der Tastatur ist von der Schriftgröße unabhängig
 * (offsetWidth/fontSize), daher schaukelt sich die Messung nicht auf.
 * Siehe [[project_zehnfinger_trainer]].
 */
import { useLayoutEffect, useRef, useState } from "react";
import { useTypingA11y } from "@/lib/typing/a11y";
import { FINGERS } from "@/lib/typing/fingers";
import { useGrosseTastatur } from "@/lib/typing/grosseTastatur";
import { texte, useBedienSprache, type BedienSprache } from "@/lib/bedienSprache";
import { Aufklappen } from "@/components/Aufklappen";
import { Keyboard, type GedrueckteTaste } from "./Keyboard";
import { useKeyboardLayout } from "./useKeyboardLayout";

/** Merkt den Auf-/Zu-Zustand über Sitzungen hinweg (pro Browser). */
const OPEN_KEY = "tippen-keyboard-open";

function readOpen(): boolean {
  try {
    // ★ Die Vorgabe ist AUF: Nur ein ausdrückliches „0" klappt zu. Ein
    // FEHLENDER Eintrag heißt „noch nie entschieden" — und dann soll die
    // Tastatur da sein. (Vorher stand hier `=== "1"`, also war ein fehlender
    // Eintrag „zu".)
    return localStorage.getItem(OPEN_KEY) !== "0";
  } catch {
    // Kein localStorage → wie beim ersten Besuch: offen.
    return true;
  }
}

/**
 * Ist die Bildschirm-Tastatur gerade AUSGEBLENDET? Für das Geheim-Abzeichen
 * „Blindflug" (eine ganze Runde fehlerfrei ohne Tastatur-Hilfe) — die
 * Tipp-Sitzung fragt am Rundenende hier nach, statt einen zweiten Zustand zu
 * führen, der auseinanderlaufen könnte.
 */
export function keyboardHidden(): boolean {
  return !readOpen();
}

/**
 * Warum die Finger-Farben gerade nicht zu haben sind - EIN Wortlaut für den
 * Tooltip, für `aria-describedby` am Kästchen und für die Ansage beim Versuch
 * (R5, 22.08.2026). Bis dahin stand der Grund nur im `title`, den eine
 * Sprachausgabe nicht verlässlich liest.
 */
export const FARBEN_GESPERRT =
  "In den Kontrast-Modi sind die Finger-Farben ausgeschaltet.";

/**
 * Derselbe Satz in der Bedienungssprache (EN1, 19.09.2026) - für das Zahnrad
 * (eigene Etappe), damit es den Wortlaut nicht ein zweites Mal schreibt.
 */
export function farbenGesperrt(sprache: BedienSprache = "de"): string {
  return FARBEN_GESPERRT_JE_SPRACHE[sprache];
}

/**
 * ★ E11a-5 (26.09.2026): Tabelle statt einer Weiche auf „en" - die Weiche
 * lieferte für „fr" still den deutschen Satz (Falle 30, gefunden in E11a-4
 * §5). Deutsch und Englisch wortgleich wie vorher.
 */
const FARBEN_GESPERRT_JE_SPRACHE: Record<BedienSprache, string> = {
  de: FARBEN_GESPERRT,
  en: "Finger colours are switched off in the contrast modes.",
  fr: "Les couleurs des doigts sont désactivées dans les modes de contraste.",
  es: "Los colores de los dedos están desactivados en los modos de contraste.",
  it: "I colori delle dita sono disattivati nei temi a contrasto.",
  // ★ O-PL (02.10.2026): „motywy kontrastu", „kolory palców" (Glossar §2.8).
  pl: "Kolory palców są wyłączone w motywach kontrastu.",
  // ★ O-TR (02.10.2026): „karşıtlık temaları", „parmak renkleri" (Glossar §2.8).
  tr: "Karşıtlık temalarında parmak renkleri kapalıdır.",
  // ★ O-CS (03.10.2026): „kontrastní motivy", „barvy prstů" (Glossar §2.8).
  cs: "V kontrastních motivech jsou barvy prstů vypnuté.",
  // ★ O2-COMP (30.10.2026): bg eigene Fassung.
  bg: "В контрастните теми цветовете на пръстите са изключени.",
  // ★ O2-COMP (30.10.2026): el eigene Fassung.
  el: "Στα θέματα αντίθεσης τα χρώματα δαχτύλων είναι απενεργοποιημένα.",
  // ★ O2-COMP (30.10.2026): hu eigene Fassung.
  hu: "A kontrasztos témákban az ujjszínek ki vannak kapcsolva.",
  // ★ O2-COMP (30.10.2026): nl eigene Fassung.
  nl: "In de contrastthema's zijn de vingerkleuren uitgeschakeld.",
  // ★ O2-COMP (30.10.2026): pt eigene Fassung.
  pt: "Nos temas de contraste, as cores dos dedos estão desligadas.",
  // ★ O2-COMP (30.10.2026): br eigene Fassung.
  br: "As cores dos dedos ficam desligadas nos temas de contraste.",
  // ★ O2-COMP (30.10.2026): ro eigene Fassung.
  ro: "În temele de contrast, culorile degetelor sunt oprite.",
  // ★ O2-COMP (30.10.2026): sv eigene Fassung.
  sv: "Fingerfärgerna är avstängda i kontrastlägena.",
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: "У контрастних темах кольори пальців вимкнено.",
};

/**
 * Die Texte der Tastatur-Fläche (EN1, 19.09.2026). Deutsch wortgleich wie
 * vorher. Fingernamen nach Glossar §3.5 (*little finger*, *index finger*).
 */
const PANEL_TEXTE = texte({
  de: {
    zuSchmal:
      "Die Bildschirm-Tastatur passt bei dieser Fensterbreite nicht mehr lesbar hin und bleibt darum ausgeblendet - die nächste Taste steht weiter oben in der Kachel.",
    kleinerFinger: "kleiner Finger",
    ringfinger: "Ringfinger",
    mittelfinger: "Mittelfinger",
    zeigeLinks: "Zeigefinger links",
    zeigeRechts: "Zeigefinger rechts",
    daumen: "Daumen",
  },
  en: {
    zuSchmal:
      "The on-screen keyboard won't fit legibly in a window this narrow, so it stays hidden - the next key is still shown above.",
    kleinerFinger: "little finger",
    ringfinger: "ring finger",
    mittelfinger: "middle finger",
    zeigeLinks: "left index finger",
    zeigeRechts: "right index finger",
    daumen: "thumb",
  },
  fr: {
    zuSchmal:
      "Le clavier à l'écran ne tient plus lisiblement dans une fenêtre aussi étroite et reste donc masqué - la touche suivante reste indiquée plus haut.",
    kleinerFinger: "auriculaire",
    ringfinger: "annulaire",
    mittelfinger: "majeur",
    zeigeLinks: "index gauche",
    zeigeRechts: "index droit",
    daumen: "pouce",
  },
  es: {
    zuSchmal:
      "El teclado en pantalla ya no cabe de forma legible en una ventana tan estrecha y por eso queda oculto - la tecla siguiente se sigue indicando más arriba.",
    kleinerFinger: "meñique",
    ringfinger: "anular",
    mittelfinger: "medio",
    zeigeLinks: "índice izquierdo",
    zeigeRechts: "índice derecho",
    daumen: "pulgar",
  },
  it: {
    zuSchmal:
      "In una finestra così stretta la tastiera sullo schermo non è più leggibile e quindi resta nascosta - il prossimo tasto viene comunque indicato più in alto.",
    kleinerFinger: "mignolo",
    ringfinger: "anulare",
    mittelfinger: "medio",
    zeigeLinks: "indice sinistro",
    zeigeRechts: "indice destro",
    daumen: "pollice",
  },
  // ★ O-PL (02.10.2026): „klawiatura ekranowa", Fingernamen nach Glossar §2.1.
  pl: {
    zuSchmal:
      "W tak wąskim oknie klawiatura ekranowa nie mieści się czytelnie, dlatego jest ukryta - następny klawisz nadal widać wyżej.",
    kleinerFinger: "mały palec",
    ringfinger: "palec serdeczny",
    mittelfinger: "palec środkowy",
    zeigeLinks: "lewy palec wskazujący",
    zeigeRechts: "prawy palec wskazujący",
    daumen: "kciuk",
  },
  // ★ O-TR (02.10.2026): „ekran klavyesi", Fingernamen nach Glossar §2.1 (MEGEP).
  tr: {
    zuSchmal:
      "Pencere bu kadar dar olunca ekran klavyesi okunaklı biçimde sığmaz, bu yüzden gizli kalır - sıradaki tuş yukarıda görünmeye devam eder.",
    kleinerFinger: "serçe parmak",
    ringfinger: "yüzük parmağı",
    mittelfinger: "orta parmak",
    zeigeLinks: "sol işaret parmağı",
    zeigeRechts: "sağ işaret parmağı",
    daumen: "başparmak",
  },
  // ★ O-CS (03.10.2026): „klávesnice na obrazovce" (Glossar §2.8), Fingernamen nach Glossar §2.1.
  cs: {
    zuSchmal:
      "V takto úzkém okně se klávesnice na obrazovce nevejde čitelně, proto zůstane skrytá - další klávesa je dál vidět nahoře.",
    kleinerFinger: "malíček",
    ringfinger: "prsteníček",
    mittelfinger: "prostředníček",
    zeigeLinks: "levý ukazováček",
    zeigeRechts: "pravý ukazováček",
    daumen: "palec",
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      zuSchmal:
        "При толкова тесен прозорец екранната клавиатура не се побира четливо и затова е скрита - следващият клавиш продължава да се показва по-горе.",
      kleinerFinger: "кутре",
      ringfinger: "безименен пръст",
      mittelfinger: "среден пръст",
      zeigeLinks: "ляв показалец",
      zeigeRechts: "десен показалец",
      daumen: "палец",
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      zuSchmal:
        "Σε τόσο στενό παράθυρο το πληκτρολόγιο οθόνης δεν χωρά ευανάγνωστα, οπότε μένει κρυφό - το επόμενο πλήκτρο φαίνεται πιο πάνω.",
      kleinerFinger: "μικρό δάχτυλο",
      ringfinger: "παράμεσος",
      mittelfinger: "μέσος",
      zeigeLinks: "αριστερός δείκτης",
      zeigeRechts: "δεξιός δείκτης",
      daumen: "αντίχειρας",
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      zuSchmal:
        "A képernyő-billentyűzet ilyen keskeny ablakban már nem fér el olvashatóan, ezért rejtve marad - a következő billentyű továbbra is fent látható.",
      kleinerFinger: "kisujj",
      ringfinger: "gyűrűsujj",
      mittelfinger: "középső ujj",
      zeigeLinks: "bal mutatóujj",
      zeigeRechts: "jobb mutatóujj",
      daumen: "hüvelykujj",
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      zuSchmal:
        "Het schermtoetsenbord past in zo'n smal venster niet meer leesbaar en blijft daarom verborgen - de volgende toets staat nog steeds hierboven.",
      kleinerFinger: "pink",
      ringfinger: "ringvinger",
      mittelfinger: "middelvinger",
      zeigeLinks: "linkerwijsvinger",
      zeigeRechts: "rechterwijsvinger",
      daumen: "duim",
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      zuSchmal:
        "O teclado no ecrã não cabe de forma legível numa janela tão estreita e por isso fica escondido - a próxima tecla continua a aparecer em cima.",
      kleinerFinger: "mindinho",
      ringfinger: "anelar",
      mittelfinger: "médio",
      zeigeLinks: "indicador esquerdo",
      zeigeRechts: "indicador direito",
      daumen: "polegar",
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      zuSchmal:
        "O teclado na tela não cabe de forma legível numa janela tão estreita e por isso fica oculto - a próxima tecla continua aparecendo acima.",
      kleinerFinger: "dedo mínimo",
      ringfinger: "anelar",
      mittelfinger: "médio",
      zeigeLinks: "indicador esquerdo",
      zeigeRechts: "indicador direito",
      daumen: "polegar",
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      zuSchmal:
        "Tastatura de pe ecran nu mai încape lizibil într-o fereastră atât de îngustă, așa că rămâne ascunsă - tasta următoare apare în continuare mai sus.",
      kleinerFinger: "degetul mic",
      ringfinger: "inelarul",
      mittelfinger: "mijlociul",
      zeigeLinks: "arătătorul stâng",
      zeigeRechts: "arătătorul drept",
      daumen: "degetul mare",
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      zuSchmal:
        "Skärmtangentbordet får inte plats läsbart i ett så smalt fönster och är därför dolt - nästa tangent visas fortfarande ovanför.",
      kleinerFinger: "lillfinger",
      ringfinger: "ringfinger",
      mittelfinger: "långfinger",
      zeigeLinks: "vänster pekfinger",
      zeigeRechts: "höger pekfinger",
      daumen: "tumme",
    },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: {
      zuSchmal:
        "У такому вузькому вікні екранна клавіатура не вміщується розбірливо, тому вона схована - наступну клавішу й далі показано вище.",
      kleinerFinger: "мізинець",
      ringfinger: "безіменний палець",
      mittelfinger: "середній палець",
      zeigeLinks: "лівий вказівний палець",
      zeigeRechts: "правий вказівний палець",
      daumen: "великий палець",
    },
});

// Farb-Legende: kleiner/Ring/Mittelfinger sind links = rechts (eine Farbe), die
// beiden Zeigefinger tragen zwei Blautöne (links dunkel, rechts hell), der Daumen
// ist neutral-grau.
const LEGENDE = [
  { id: "kleiner-links", label: "kleinerFinger" },
  { id: "ring-links", label: "ringfinger" },
  { id: "mittel-links", label: "mittelfinger" },
  { id: "zeige-links", label: "zeigeLinks" },
  { id: "zeige-rechts", label: "zeigeRechts" },
  { id: "daumen", label: "daumen" },
] as const;

export function KeyboardPanel({
  nextChar,
  unlocked,
  showFingerColors,
  gedrueckt,
  immerOffen = false,
  vollstaendig,
  totasteOffen,
}: {
  nextChar?: string;
  /** Die Totaste des nächsten Zwei-Schritt-Zeichens ist gedrückt (siehe `Keyboard`). */
  totasteOffen?: boolean;
  unlocked: Set<string>;
  /** Effektiv aktiv (Wunsch in den Einstellungen UND vom Kontrast-Modus erlaubt). */
  showFingerColors: boolean;
  /** Die zuletzt gedrückte Taste - wird auf der Tastatur markiert (Tasten erkunden). */
  gedrueckt?: GedrueckteTaste;
  /**
   * Tastatur zeigen, egal ob sie ein- oder ausgeblendet ist (Tasten erkunden,
   * 12.09.2026: dort IST die Tastatur der Inhalt). Der gemerkte Zustand
   * `tastaturOffen` bleibt dabei unberührt - wer im Üben ausgeblendet hat,
   * findet sie dort weiter ausgeblendet vor.
   */
  immerOffen?: boolean;
  /** Esc, F-Reihe (und unter Windows Win/Menü-Taste) zeichnen - nur „Tasten erkunden", siehe `Keyboard`. */
  vollstaendig?: "windows" | "mac";
}) {
  // ★ 25.08.2026: Der Ein-/Ausblenden-Schalter steht nicht mehr hier, sondern
  // in der Zeile mit „Umschalttaste zweimal drücken …" (eine Zeile weniger),
  // und das Finger-Farben-Häkchen ist in die Einstellungen gezogen (Gruppe
  // „Anzeige") - eine Einmal-Entscheidung gehört nicht unter das Übungsfeld.
  // Beides liegt jetzt im gemeinsamen Speicher, damit es nur EINE Wahrheit gibt.
  const tastaturOffen = useTypingA11y((z) => z.tastaturOffen);
  const t = PANEL_TEXTE[useBedienSprache().sprache];
  const open = immerOffen || tastaturOffen;
  const layout = useKeyboardLayout();
  const boxRef = useRef<HTMLDivElement>(null);
  const kbRef = useRef<HTMLDivElement>(null);
  // Unsichtbare Messvorlage, IMMER gerendert (fester 16-px-Bezug) - unabhängig
  // davon, ob die sichtbare Tastatur gerade gezeichnet wird oder (zu schmal)
  // ausgeblendet ist. Ohne sie bräuchte man die sichtbare Kopie zum Messen,
  // und könnte dann nie mehr feststellen, dass wieder genug Platz da ist.
  // ★ 25.09.2026: Sie misst IMMER die Tastatur OHNE Ziffernblock (`ohneZiffernblock`
  // fest an) - der Massstab für die normale Schriftgrösse. Ob der Ziffernblock
  // ZUSÄTZLICH passt, misst `messVollRef` (nur gerendert, wenn „Große Tastatur"
  // eingestellt ist) - siehe `fit()` unten.
  const messRef = useRef<HTMLDivElement>(null);
  const messVollRef = useRef<HTMLDivElement>(null);
  const grosseTastaturEinstellung = useGrosseTastatur((s) => s.aktiv);
  // Passt der Ziffernblock bei dieser Fensterbreite nicht mehr daneben, wird
  // ER unterdrückt statt die ganze Tastatur unleserlich klein zu skalieren
  // oder seitlich aufzureissen (Auftrag Johannes: „lieber skalieren oder den
  // Ziffernblock unterdrücken als horizontal scrollen"). Die EINSTELLUNG
  // selbst bleibt unberührt - nur diese Anzeige weicht kurzfristig aus.
  const [ohneZiffernblock, setOhneZiffernblock] = useState(false);
  const [fontPx, setFontPx] = useState(18);
  // Bei dieser Fensterbreite bräuchte die Tastatur eine Schrift UNTER dem
  // Lesbarkeits-Boden (14 px) - dann lieber ausblenden als entweder
  // unleserlich zeichnen (nutzt niemandem) oder die Seite waagrecht
  // aufreissen (Prüfpunkt 8.2, gemessen 25./26.08.2026: bei 320 px bräuchte
  // die volle ~35-em-Reihe eine Schrift von rund 8 px, weit unter dem Boden).
  // Die nächste Taste steht weiterhin oben in der Kachel und im Finger-
  // Hinweis - hier geht keine Information verloren, nur die Grafik.
  const [zuSchmal, setZuSchmal] = useState(false);
  /**
   * ★ Bewegung beim Einblenden (19.09.2026, siehe unten bei `Aufklappen`):
   * Die Tastatur wächst sichtbar auf - und dafür muss ihre Schriftgrösse
   * stimmen, BEVOR `Aufklappen` ihre Höhe misst. Sonst wüchse sie auf die Höhe
   * der alten Grösse (beim ersten Einblenden: 18 px) und spränge am Ende auf
   * die richtige. Darum geht der Bereich erst auf, wenn die Messvorlage
   * gemessen hat - im selben Durchgang vor dem Zeichnen (`useLayoutEffect`),
   * also ohne sichtbare Verzögerung.
   */
  const [gemessen, setGemessen] = useState(open);
  if (!open && gemessen) setGemessen(false);

  useLayoutEffect(() => {
    if (!open) return;
    const box = boxRef.current;
    const mess = messRef.current;
    if (!box || !mess) {
      setGemessen(true);
      return;
    }
    const BODEN = 14;
    const fit = () => {
      const avail = box.clientWidth;
      if (avail <= 0) return; // noch nicht vermessen (z. B. Testumgebung)
      const cur = parseFloat(getComputedStyle(mess).fontSize) || 16;
      const emWidth = mess.offsetWidth / cur; // unabhängig von der Schriftgröße
      if (emWidth <= 0) return;
      // Passt die VOLLE Tastatur (mit Ziffernblock) noch lesbar hin? Nur
      // versucht, wenn die Einstellung überhaupt an ist - sonst gibt es
      // `messVollRef` nicht (siehe unten).
      let voll = false;
      let massstab = emWidth;
      const messVoll = messVollRef.current;
      if (grosseTastaturEinstellung && messVoll) {
        const vollEmWidth = messVoll.offsetWidth / cur;
        if (vollEmWidth > 0 && avail / vollEmWidth >= BODEN) {
          voll = true;
          massstab = vollEmWidth;
        }
      }
      const roh = avail / massstab;
      if (roh < BODEN) {
        setZuSchmal(true);
        return;
      }
      setZuSchmal(false);
      setOhneZiffernblock(!voll);
      // Volle Breite ausnutzen, aber nicht winzig/riesig werden lassen.
      setFontPx(Math.max(BODEN, Math.min(46, roh)));
    };
    fit();
    setGemessen(true);
    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(fit);
      ro.observe(box);
    }
    return () => ro?.disconnect();
  }, [open, layout, grosseTastaturEinstellung]);

  return (
    // ★ 19.09.2026: kein `space-y-1.5` mehr hier - der Abstand über der
    // Tastatur steht als `pt-1.5` IM aufklappenden Bereich. So wächst er mit,
    // und beim Schliessen springt nichts, wenn die Messvorlage davor geht.
    <div ref={boxRef}>
      {/* AUSNAHME (E7, §2.7): Die 16 px hier sind keine Schrift, die jemand
         liest - sie sind der BEZUG, an dem die em-Breite der Tastatur
         gemessen wird. Unsichtbare Messvorlage - immer da (auch wenn
         `zuSchmal`), fest
         bei 16 px, per `overflow-hidden` ohne jede Wirkung auf die
         Seitenbreite. Nur zum Messen, nie zu sehen. `flex` auf dem
         Wrapper ist Pflicht: erst als Flex-Kind bemisst sich `messRef`
         an seinem EIGENEN Inhalt (Breite nach Bedarf) statt sich auf die
         volle Wrapper-Breite zu strecken (block-Kinder tun das sonst
         immer - genau das hätte die Messung auf 288 px statt der echten
         ~35 em verfälscht, erstes Mal beim Nachmessen aufgefallen). */}
      {open && (
        <div aria-hidden className="invisible flex h-0 overflow-hidden">
          <div ref={messRef} style={{ fontSize: "16px" }}>
            <Keyboard
              layout={layout}
              nextChar={nextChar}
              unlocked={unlocked}
              showFingerColors={showFingerColors}
              gedrueckt={gedrueckt}
              ohneZiffernblock
              vollstaendig={vollstaendig}
              totasteOffen={totasteOffen}
            />
          </div>
          {/* Zweite Messvorlage NUR mit Ziffernblock - nur nötig, wenn die
              Einstellung überhaupt an ist. `fit()` vergleicht beide und
              unterdrückt den Ziffernblock, wenn er nicht mehr daneben passt. */}
          {grosseTastaturEinstellung && (
            <div ref={messVollRef} style={{ fontSize: "16px" }}>
              <Keyboard
                layout={layout}
                nextChar={nextChar}
                unlocked={unlocked}
                showFingerColors={showFingerColors}
                gedrueckt={gedrueckt}
                vollstaendig={vollstaendig}
                totasteOffen={totasteOffen}
              />
            </div>
          )}
        </div>
      )}
      {/*
        ★ Bewegung beim Ein- und Ausblenden (Johannes 19.09.2026: „man weiß
        nicht, wie groß der neue Bereich ist … der Rest rutscht nach unten und
        der andere kommt nach"). Die Tastatur ist der grösste Bereich, den ein
        Schalter unter dem Übungsfeld öffnet - sie wächst jetzt sichtbar auf.
        Die Übungszeile steht DARÜBER und bewegt sich dabei nicht; aufgehen
        tut die Tastatur nur auf den Schalter hin, nie von selbst beim Tippen.
        Mit `immerOffen` (Tasten erkunden) ist sie von Anfang an offen - dort
        bewegt sich nichts.
      */}
      <Aufklappen offen={open && gemessen}>
        <div className="space-y-1.5 pt-1.5">
          {zuSchmal ? (
            <p className="m-0 text-center text-sm text-ink-muted">
              {t.zuSchmal}
            </p>
          ) : (
            <div className="flex justify-center">
              {/* `data-tastatur`: Die Tastatur selbst ist `aria-hidden` (rein
                 optische Hilfe) und hat darum keine Rolle, an der ein Test sie
                 fassen könnte. Diese Marke ist der Griff. Sie sitzt bewusst an
                 der SICHTBAREN Tastatur, nicht an der Messvorlage - und fehlt
                 damit richtigerweise, wenn `zuSchmal` sie ausblendet. */}
              <div ref={kbRef} data-tastatur="an" style={{ fontSize: `${fontPx}px` }}>
                <Keyboard
                  layout={layout}
                  nextChar={nextChar}
                  unlocked={unlocked}
                  showFingerColors={showFingerColors}
                  gedrueckt={gedrueckt}
                  ohneZiffernblock={ohneZiffernblock}
                  vollstaendig={vollstaendig}
                  totasteOffen={totasteOffen}
                />
              </div>
            </div>
          )}
          {/* Farb-Legende UNTERHALB der Tastatur. */}
          {showFingerColors && (
            <ul className="m-0 flex list-none flex-wrap justify-center gap-x-3 gap-y-1 p-0 text-sm text-ink-soft">
              {LEGENDE.map((f) => (
                <li key={f.id} className="inline-flex items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className="inline-block h-3 w-3 rounded-[3px] border"
                    style={{
                      background: FINGERS[f.id].farbe + "55",
                      borderColor: FINGERS[f.id].farbe,
                    }}
                  />
                  {t[f.label]}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Aufklappen>
    </div>
  );
}
