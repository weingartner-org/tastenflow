/**
 * Groß-Ansicht eines Abzeichens (Wunsch Johannes 10.07.): Eine Medaille in der
 * Statistik betätigen → die Medaille erscheint groß und gestochen scharf (SVG
 * skaliert verlustfrei) mit festlichem Effekt: Aufpopp-Schwung, wandernder
 * Glanz-Streifen übers Metall, Konfetti und der Abzeichen-Jingle (nur bei
 * verdienten Medaillen; Geheim-Abzeichen bleiben die graue „?"-Medaille).
 *
 * ── Was am 28.08.2026 hier geradegerückt wurde (§0.5, Johannes 22.08.) ──────
 *
 * 1. **Fokus-Falle** (Pflicht für jeden modalen Dialog, R1). Sie fehlte: Tab
 *    lief aus dem Dialog hinaus in die verdeckte Statistik dahinter, und wer
 *    mit der Braillezeile arbeitet, stand plötzlich in einer Seite, die die
 *    Sprachausgabe zugleich als verdeckt meldet. Jetzt hält `useFocusTrap` den
 *    Fokus im Dialog; der Anfangsfokus bleibt „Schließen".
 *
 * 2. **Rückgabe auf das betätigte Abzeichen** - Entscheidung des Chefs:
 *    „Schließen-Knopf und ESC ⇒ zurück auf das betätigte Abzeichen (das Kind
 *    bleibt im Regal); das ist die Ebene ‚Aufklapper im Regal'." Anders als
 *    sonst geht Escape hier also NICHT in die Eingabezeile - die Statistik hat
 *    gar keine. Escape in der Statistik selbst schließt weiterhin die Statistik
 *    und führt ins Tippfeld (R6, unverändert).
 *
 *    ⚠️ Damit das nicht zwei Ebenen auf einmal schließt, fängt dieser Dialog
 *    Escape im CAPTURE ab und hält ihn an (`stopPropagation`) - genau wie
 *    `Modal.tsx`. Sonst hätte derselbe Tastendruck den Dialog UND die Statistik
 *    geschlossen; das Kind wäre mit einem Druck zwei Ebenen tiefer gelandet.
 *
 * 3. **Genau EINMAL zurückgeben.** Der frühere Effekt hing an
 *    `[zoom, onClose]` - und `onClose` ist bei jedem Rendern des Regals eine
 *    frische Funktion. Bei jedem Rendern lief also die Aufräum-Funktion (Fokus
 *    zurück auf die Medaille) und gleich darauf der Effekt (Fokus auf
 *    „Schließen"): ein Fokus-Pingpong, das nur deshalb nicht auffiel, weil das
 *    Regal bei offenem Dialog selten neu rendert. Jetzt hängt der Effekt allein
 *    an `zoom`, und `onClose` liegt in einem Ref (dieselbe Falle wie in
 *    `Modal.tsx`, dort seit dem 04.06.2026 dokumentiert).
 *
 * 4. **Ist der Öffner weg**, fällt der Fokus nicht auf `body`, sondern auf die
 *    Überschrift der Statistik (`document.contains`-Prüfung, R2).
 *
 * 5. **Kein Text-Emoji mehr neben dem Namen.** Die Medaille ist seit dem
 *    22.08.2026 ein festes Bild aus `public/abzeichen/fluent/`; ein Emoji
 *    daneben wäre eine zweite, widersprüchliche Abbildung desselben Motivs
 *    (und auf älteren Schul-Rechnern oft nur ein leeres Rechteck). Wie die
 *    Medaille aussieht, sagt weiterhin `medaillenBeschreibung`.
 */
import { useEffect, useRef } from "react";
import {
  BadgeDef,
  Skin,
  badgeBeschreibung,
  badgeName,
  fmtTagMonatJahr,
  itPrepTag,
  playBadgeSound,
  speakUi,
} from "@/lib/typing";
import { texte, useBedienSprache, type BedienSprache } from "@/lib/bedienSprache";
import { istGeruestSprache } from "@/lib/typing/sprachRegister";
import { datumAbzeichenNeun } from "./BadgeMedal";
import { BadgeMedal, datumOdznaki, datumOdznaku, datumRozet, medaillenBeschreibung } from "./BadgeMedal";
import type { Lernweg } from "@/lib/typing/lernweg";
import { useFocusTrap } from "./useFocusTrap";

/**
 * ★ Die Groß-Ansicht in beiden Bedienungssprachen (EN3, 19.09.2026). Deutsch
 * wortgleich wie vorher. Glossar §1.6: Schließen ⇒ *Close*; §3.6 *badge* ★,
 * *medal*, *earned on*. Das Lob für das Kind („das schaffst du noch!") bleibt
 * ein Ausrufezeichen, britisch warm: *you'll get there!*
 */
const ZOOM_TEXTE = texte({
  de: {
    geheimName: "Geheim-Abzeichen",
    geheimWie: "Finde selbst heraus, wie es zu holen ist!",
    ansage: (name: string, wofuer: string, medaille: string, verdient: boolean) =>
      `Medaille: ${name}. ${wofuer} ${medaille} ${verdient ? "Schon verdient." : "Noch nicht verdient."}`,
    dialogName: (name: string) => `Abzeichen groß: ${name}`,
    geheimSatz: "Ein Geheim-Abzeichen. Finde selbst heraus, wie es zu holen ist!",
    verdientAm: (datum: string) => `Verdient am ${datum}`,
    verdient: "Verdient",
    nochNichtSelbst: "Noch nicht verdient - das schaffst du noch!",
    nochNicht: "Noch nicht verdient.",
    schliessen: "Schließen",
  },
  en: {
    geheimName: "Secret badge",
    geheimWie: "Find out for yourself how to earn it!",
    ansage: (name: string, wofuer: string, medaille: string, verdient: boolean) =>
      `Medal: ${name}. ${wofuer} ${medaille} ${verdient ? "Already earned." : "Not earned yet."}`,
    dialogName: (name: string) => `Badge, large view: ${name}`,
    geheimSatz: "A secret badge. Find out for yourself how to earn it!",
    verdientAm: (datum: string) => `Earned on ${datum}`,
    verdient: "Earned",
    nochNichtSelbst: "Not earned yet - you'll get there!",
    nochNicht: "Not earned yet.",
    schliessen: "Close",
  },
  fr: {
    geheimName: "Badge secret",
    geheimWie: "Trouve toi-même comment l'obtenir !",
    ansage: (name: string, wofuer: string, medaille: string, verdient: boolean) =>
      `Médaille : ${name}. ${wofuer} ${medaille} ${verdient ? "Déjà obtenu." : "Pas encore obtenu."}`,
    dialogName: (name: string) => `Badge en grand : ${name}`,
    geheimSatz: "Un badge secret. Trouve toi-même comment l'obtenir !",
    verdientAm: (datum: string) => `Obtenu le ${datum}`,
    verdient: "Obtenu",
    nochNichtSelbst: "Pas encore obtenu - tu vas y arriver !",
    nochNicht: "Pas encore obtenu.",
    schliessen: "Fermer",
  },
  es: {
    geheimName: "Insignia secreta",
    geheimWie: "¡Descubre tú cómo conseguirla!",
    ansage: (name: string, wofuer: string, medaille: string, verdient: boolean) =>
      `Medalla: ${name}. ${wofuer} ${medaille} ${verdient ? "Ya conseguida." : "Todavía no conseguida."}`,
    dialogName: (name: string) => `Insignia en grande: ${name}`,
    geheimSatz: "Una insignia secreta. ¡Descubre tú cómo conseguirla!",
    verdientAm: (datum: string) => `Conseguida el ${datum}`,
    verdient: "Conseguida",
    nochNichtSelbst: "Todavía no conseguida - ¡lo vas a lograr!",
    nochNicht: "Todavía no conseguida.",
    schliessen: "Cerrar",
  },
  it: {
    geheimName: "Medaglia segreta",
    geheimWie: "Scopri tu come ottenerla!",
    ansage: (name: string, wofuer: string, medaille: string, verdient: boolean) =>
      `Medaglia: ${name}. ${wofuer} ${medaille} ${verdient ? "Già ottenuta." : "Non ancora ottenuta."}`,
    dialogName: (name: string) => `Medaglia in grande: ${name}`,
    geheimSatz: "Una medaglia segreta. Scopri tu come ottenerla!",
    verdientAm: (datum: string) => `Ottenuta ${itPrepTag("il", parseInt(datum, 10))}${datum}`,
    verdient: "Ottenuta",
    nochNichtSelbst: "Non ancora: ci arriverai!",
    nochNicht: "Non ancora ottenuta.",
    schliessen: "Chiudi",
  },
  // ★ O-PL (02.10.2026): „odznaka", zdobyta / jeszcze niezdobyta - das
  // Partizip gehört zu „odznaka", nie zum Kind (Glossar §2.4, Regel 2).
  pl: {
    geheimName: "Tajna odznaka",
    geheimWie: "Odkryj, jak ją zdobyć!",
    ansage: (name: string, wofuer: string, medaille: string, verdient: boolean) =>
      `Odznaka: ${name}. ${wofuer} ${medaille} ${verdient ? "Już zdobyta." : "Jeszcze niezdobyta."}`,
    dialogName: (name: string) => `Odznaka w powiększeniu: ${name}`,
    geheimSatz: "Tajna odznaka. Odkryj, jak ją zdobyć!",
    verdientAm: (datum: string) => `Zdobyta ${datum}`,
    verdient: "Zdobyta",
    nochNichtSelbst: "Jeszcze nie - dasz radę!",
    nochNicht: "Jeszcze niezdobyta.",
    schliessen: "Zamknij",
  },
  // ★ O-TR (02.10.2026): "rozet", kazanıldı / henüz kazanılmadı, "Henüz değil -
  // yakında!" (Glossar §2.4); Datum nach Doppelpunkt (Regel 6); Knopf "Kapat".
  tr: {
    geheimName: "Gizli rozet",
    geheimWie: "Nasıl kazanılacağını kendin bul!",
    ansage: (name: string, wofuer: string, medaille: string, verdient: boolean) =>
      `Rozet: ${name}. ${wofuer} ${medaille} ${verdient ? "Kazanıldı." : "Henüz kazanılmadı."}`,
    dialogName: (name: string) => `Rozet, büyük görünüm: ${name}`,
    geheimSatz: "Gizli rozet. Nasıl kazanılacağını kendin bul!",
    verdientAm: (datum: string) => `Kazanıldığı tarih: ${datum}`,
    verdient: "Kazanıldı",
    nochNichtSelbst: "Henüz değil - yakında!",
    nochNicht: "Henüz kazanılmadı.",
    schliessen: "Kapat",
  },
  // ★ O-CS (03.10.2026): „odznak", získaný / zatím nezískaný - das Partizip
  // gehört zu „odznak", nie zum Kind (Glossar §2.4, Regel 2); „Zatím ne - ale
  // přijde to!" (§2.4); Knopf „Zavřít". Kein Satz endet mit dem Datum (Falle 4).
  cs: {
    geheimName: "Tajný odznak",
    geheimWie: "Jak ho získat? To zjistíš!",
    ansage: (name: string, wofuer: string, medaille: string, verdient: boolean) =>
      `Odznak: ${name}. ${wofuer} ${medaille} ${verdient ? "Už získaný." : "Zatím nezískaný."}`,
    dialogName: (name: string) => `Odznak ve velkém: ${name}`,
    geheimSatz: "Tajný odznak. Jak ho získat? To zjistíš!",
    verdientAm: (datum: string) => `Získáno ${datum}`,
    verdient: "Získaný",
    nochNichtSelbst: "Zatím ne - ale přijde to!",
    nochNicht: "Zatím nezískaný.",
    schliessen: "Zavřít",
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      geheimName: "Тайна значка",
      // „Открий сам" wäre männlich (Glossar §4 Falle 6) - darum als Frage.
      geheimWie: "Как се печели? Открий го!",
      ansage: (name: string, wofuer: string, medaille: string, verdient: boolean) =>
        `Значка: ${name}. ${wofuer} ${medaille} ${verdient ? "Вече е спечелена." : "Още не е спечелена."}`,
      dialogName: (name: string) => `Значка в голям размер: ${name}`,
      geheimSatz: "Тайна значка. Как се печели? Открий го!",
      verdientAm: (datum: string) => `Спечелена на ${datum}`,
      verdient: "Спечелена",
      nochNichtSelbst: "Още не е спечелена - но ще дойде!",
      nochNicht: "Още не е спечелена.",
      schliessen: "Затвори",
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      geheimName: "Μυστικό μετάλλιο",
      geheimWie: "Ανακάλυψε εσύ πώς θα το κερδίσεις!",
      ansage: (name: string, wofuer: string, medaille: string, verdient: boolean) =>
        `Μετάλλιο: ${name}. ${wofuer} ${medaille} ${verdient ? "Κερδισμένο." : "Δεν κερδήθηκε ακόμα."}`,
      dialogName: (name: string) => `Μετάλλιο σε μεγέθυνση: ${name}`,
      geheimSatz: "Ένα μυστικό μετάλλιο. Ανακάλυψε εσύ πώς θα το κερδίσεις!",
      // Datum nach Doppelpunkt (Glossar Regel 13 - kein Artikel vor der Zahl).
      verdientAm: (datum: string) => `Κερδήθηκε: ${datum}`,
      verdient: "Κερδισμένο",
      nochNichtSelbst: "Δεν κερδήθηκε ακόμα - αλλά θα έρθει!",
      nochNicht: "Δεν κερδήθηκε ακόμα.",
      schliessen: "Κλείσιμο",
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      geheimName: "Titkos jelvény",
      geheimWie: "Fedezd fel magad, hogyan szerezheted meg!",
      ansage: (name: string, wofuer: string, medaille: string, verdient: boolean) =>
        `Jelvény: ${name}. ${wofuer} ${medaille} ${verdient ? "Már megszerezted." : "Még nem szerezted meg."}`,
      dialogName: (name: string) => `Jelvény nagyban: ${name}`,
      geheimSatz: "Titkos jelvény. Fedezd fel magad, hogyan szerezheted meg!",
      verdientAm: (datum: string) => `Megszerezve: ${datum}`,
      verdient: "Megszerezve",
      nochNichtSelbst: "Még nem - de sikerülni fog!",
      nochNicht: "Még nincs megszerezve.",
      schliessen: "Bezárás",
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      geheimName: "Geheime medaille",
      geheimWie: "Ontdek zelf hoe je deze medaille behaalt!",
      ansage: (name: string, wofuer: string, medaille: string, verdient: boolean) =>
        `Medaille: ${name}. ${wofuer} ${medaille} ${verdient ? "Al behaald." : "Nog niet behaald."}`,
      dialogName: (name: string) => `Medaille, groot: ${name}`,
      geheimSatz: "Een geheime medaille. Ontdek zelf hoe je deze medaille behaalt!",
      verdientAm: (datum: string) => `Behaald op ${datum}`,
      verdient: "Behaald",
      nochNichtSelbst: "Nog niet behaald - maar dat komt!",
      nochNicht: "Nog niet behaald.",
      schliessen: "Sluiten",
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      geheimName: "Medalha secreta",
      geheimWie: "Descobre por ti como a conquistar!",
      ansage: (name: string, wofuer: string, medaille: string, verdient: boolean) =>
        `Medalha: ${name}. ${wofuer} ${medaille} ${verdient ? "Já conquistada." : "Ainda não conquistada."}`,
      dialogName: (name: string) => `Medalha em grande: ${name}`,
      geheimSatz: "Uma medalha secreta. Descobre por ti como a conquistar!",
      verdientAm: (datum: string) => `Conquistada em ${datum}`,
      verdient: "Conquistada",
      nochNichtSelbst: "Ainda não conquistada - mas vais chegar lá!",
      nochNicht: "Ainda não conquistada.",
      schliessen: "Fechar",
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      geheimName: "Medalha secreta",
      geheimWie: "Descubra por conta própria como conquistá-la!",
      ansage: (name: string, wofuer: string, medaille: string, verdient: boolean) =>
        `Medalha: ${name}. ${wofuer} ${medaille} ${verdient ? "Já conquistada." : "Ainda não conquistada."}`,
      dialogName: (name: string) => `Medalha em tamanho grande: ${name}`,
      geheimSatz: "Uma medalha secreta. Descubra por conta própria como conquistá-la!",
      verdientAm: (datum: string) => `Conquistada em ${datum}`,
      verdient: "Conquistada",
      nochNichtSelbst: "Ainda não conquistada - mas você chega lá!",
      nochNicht: "Ainda não conquistada.",
      schliessen: "Fechar",
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      geheimName: "Medalie secretă",
      geheimWie: "Descoperă tu cum se obține!",
      ansage: (name: string, wofuer: string, medaille: string, verdient: boolean) =>
        `Medalie: ${name}. ${wofuer} ${medaille} ${verdient ? "Obținută deja." : "Încă neobținută."}`,
      dialogName: (name: string) => `Medalie mărită: ${name}`,
      geheimSatz: "O medalie secretă. Descoperă tu cum se obține!",
      verdientAm: (datum: string) => `Obținută pe ${datum}`,
      verdient: "Obținută",
      nochNichtSelbst: "Încă neobținută - dar vine!",
      nochNicht: "Încă neobținută.",
      schliessen: "Închideți",
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      geheimName: "Hemligt märke",
      geheimWie: "Lista ut själv hur du tar det!",
      ansage: (name: string, wofuer: string, medaille: string, verdient: boolean) =>
        `Märke: ${name}. ${wofuer} ${medaille} ${verdient ? "Redan taget." : "Inte taget än."}`,
      dialogName: (name: string) => `Märke i stort format: ${name}`,
      geheimSatz: "Ett hemligt märke. Lista ut själv hur du tar det!",
      verdientAm: (datum: string) => `Taget ${datum}`,
      verdient: "Taget",
      nochNichtSelbst: "Inte än - men det kommer!",
      nochNicht: "Inte taget än.",
      schliessen: "Stäng",
    },
  // ★ O2-COMP (30.10.2026): uk eigene Fassung.
  uk: {
      geheimName: "Таємна медаль",
      geheimWie: "Дізнайся, як її здобути!",
      ansage: (name: string, wofuer: string, medaille: string, verdient: boolean) =>
        `Медаль: ${name}. ${wofuer} ${medaille} ${verdient ? "Уже здобута." : "Ще не здобута."}`,
      dialogName: (name: string) => `Медаль, великий перегляд: ${name}`,
      geheimSatz: "Таємна медаль. Дізнайся, як її здобути!",
      verdientAm: (datum: string) => `Здобуто ${datum}`,
      verdient: "Здобута",
      nochNichtSelbst: "Ще не здобута - але ти її здобудеш!",
      nochNicht: "Ще не здобута.",
      schliessen: "Закрити",
    },
});

/** ★ O-PL (02.10.2026): „5 września 2026" für pl, sonst wie bisher `fmtTagMonatJahr`. */
function datumDerOdznaki(ts: number, sprache: BedienSprache): string {
  // ★ O2-COMP (30.10.2026): die neun Sprachen ausgeschrieben nach ihrem Gebiet.
  if (istGeruestSprache(sprache)) return datumAbzeichenNeun(ts, sprache);
  // ★ O-TR (02.10.2026): "21 Eylül 2026" für tr.
  if (sprache === "tr") return datumRozet(ts);
  // ★ O-CS (03.10.2026): „21. září 2026" für cs.
  if (sprache === "cs") return datumOdznaku(ts);
  return sprache === "pl" ? datumOdznaki(ts) : fmtTagMonatJahr(ts, sprache);
}

/** Konfetti-Stückchen (rein dekorativ) — gleiche Streuung wie die Freischalt-Feier. */
const CONFETTI = Array.from({ length: 14 }, (_, i) => ({
  x: `${(i % 2 ? 1 : -1) * (3 + (i % 7) * 1.6)}rem`,
  delay: `${(i % 5) * 90}ms`,
  color: ["--c-accent-solid", "--c-warning", "--c-success", "--c-accent-solid"][i % 4],
}));

export interface BadgeZoomState {
  def: BadgeDef;
  /** Verdient? (Sonst hängt auch die große Medaille entsättigt da.) */
  earned: boolean;
  /** Verdien-Zeitpunkt (nur wenn verdient). */
  ts?: number;
  /** Geheim-Abzeichen vor dem Verdienen: graue „?"-Medaille, kein Name. */
  secretHidden: boolean;
}

// (Bis 11.09.2026 stand hier eine eigene `fmtDate()`, entfernt weil
// deckungsgleich mit `fmtTagMonatJahr()` aus `src/lib/typing/datum.ts` -
// dorthin zusammengeführt.)

export function BadgeZoomDialog({
  zoom,
  onClose,
  selfView = false,
  skin = "kind",
  lernweg = "de",
}: {
  zoom: BadgeZoomState | null;
  onClose: () => void;
  /** Ich-Perspektive (Kind sieht die eigene Statistik)? Sonst neutral (Lehrkraft). */
  selfView?: boolean;
  /** Tonlage für den Abzeichen-Namen (Kinder Maskottchen, ab 11 neutral). */
  skin?: Skin;
  /** ★ E2 (24.09.2026): nur für „grundstellungs-gorilla" - siehe `badgeBeschreibung`. */
  lernweg?: Lernweg;
}) {
  const { sprache, bereichAktiv } = useBedienSprache();
  const t = ZOOM_TEXTE[sprache];
  // Für den Effekt unten, der nur an `zoom` hängt (Punkt 3 im Dateikopf).
  const spracheRef = useRef({ sprache, bereichAktiv });
  spracheRef.current = { sprache, bereichAktiv };
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const oeffnerRef = useRef<HTMLElement | null>(null);
  // `onClose` ist bei jedem Rendern des Regals eine neue Funktion - in der
  // Abhängigkeitsliste würde sie den Effekt bei jedem Rendern neu aufsetzen
  // (Punkt 3 im Dateikopf). Darum über ein Ref.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  /**
   * Öffnen: den Öffner merken (das betätigte Abzeichen), Jingle spielen (nur
   * bei verdienten Medaillen), Escape abfangen. Schließen: den Fokus GENAU
   * EINMAL zurückgeben - auf das Abzeichen, wenn es noch im Baum steht, sonst
   * auf die Überschrift der Statistik.
   *
   * ⚠️ Dieser Effekt steht bewusst VOR `useFocusTrap`: React arbeitet Effekte
   * in der Reihenfolge ab, in der die Haken aufgerufen werden. Käme er danach,
   * hätte die Falle den Fokus längst auf „Schließen" gesetzt - und als Öffner
   * wäre der Schließen-Knopf gemerkt statt des Abzeichens.
   */
  useEffect(() => {
    if (!zoom) return;
    const el = document.activeElement;
    // `body` zählt nicht als Öffner (dasselbe Sieb wie in `Modal.tsx`): Ein
    // `focus()` darauf ist kein Ziel, sondern das Nichts.
    oeffnerRef.current =
      el instanceof HTMLElement && el !== document.body ? el : null;
    if (zoom.earned && !zoom.secretHidden) playBadgeSound();
    // ★ 30.08.2026 (Johannes: „extrem wichtig, Medaillen und Begleittext zu
    //   lesen"): Beim Öffnen liest die App-Stimme die ganze Karte vor - Name,
    //   Bedingung und wie die Medaille AUSSIEHT (dieselbe Beschreibung, die
    //   der Screenreader über den sr-only-Absatz bekommt). `speakUi` prüft
    //   selbst, ob Vorlesen an ist.
    {
      const d = zoom.def;
      const geheim = zoom.secretHidden;
      const { sprache: sp, bereichAktiv } = spracheRef.current;
      const tt = ZOOM_TEXTE[sp];
      const derName = geheim ? tt.geheimName : badgeName(d, skin, sp);
      const wofuer = geheim ? tt.geheimWie : badgeBeschreibung(d, sp, lernweg);
      const satz = tt.ansage(derName, wofuer, medaillenBeschreibung(d, geheim, sp), zoom.earned);
      // ★ EN3: In Tastenflow mit der Stimme der Bedienung, sonst genau wie vorher.
      if (bereichAktiv) speakUi(satz, undefined, undefined, sp);
      else speakUi(satz);
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      // Anhalten, damit nicht zugleich die Statistik dahinter zugeht.
      e.stopPropagation();
      onCloseRef.current();
    };
    // Im Capture UND am `window`: Die Seite hört auf `document` (Bubble), ein
    // Halt am Fenster kommt also zuverlässig zuerst.
    window.addEventListener("keydown", onKey, true);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      const oeffner = oeffnerRef.current;
      oeffnerRef.current = null;
      if (oeffner && document.contains(oeffner)) oeffner.focus();
      else document.getElementById("tippen-statistik-titel")?.focus();
    };
  }, [zoom]);

  // Fokus-Falle: Anfangsfokus auf „Schließen", Tab bleibt im Dialog. Die
  // Rückgabe macht der Effekt oben (die Falle kennt den Fall „Öffner ist weg"
  // nur als Nichtstun, wir brauchen dort die Überschrift).
  useFocusTrap(!!zoom, dialogRef, { initialFocus: closeRef });

  if (!zoom) return null;
  const { def, earned, ts, secretHidden } = zoom;
  const name = secretHidden ? "???" : badgeName(def, skin, sprache);
  const celebrate = earned && !secretHidden;

  return (
    <div
      ref={dialogRef}
      className="tt-celebrate"
      role="dialog"
      aria-modal="true"
      aria-label={t.dialogName(name)}
      onClick={onClose}
    >
      <div className="tt-celebrate-card" onClick={(e) => e.stopPropagation()}>
        {celebrate &&
          CONFETTI.map((c, i) => (
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

        <div className="tt-medal-zoom" aria-hidden="true">
          <BadgeMedal
            def={def}
            earned={earned}
            secretHidden={secretHidden}
            size={280}
          />
          {celebrate && <span className="tt-medal-shine" />}
        </div>

        {/* ★ 28.08.2026: Hier stand vor dem Namen noch einmal das Emoji des
            Abzeichens. Es ist ersatzlos weg (Punkt 5 im Dateikopf) - die
            Medaille darüber IST das Motiv. */}
        {/* ★ E7 (11.09.2026): `text-xl` statt `text-2xl`. */}
        <p className="m-0 mt-2 text-xl font-bold text-ink">
          {secretHidden ? "???" : name}
        </p>
        <p className="mx-auto mb-0 mt-1.5 max-w-prose text-base text-ink-soft">
          {secretHidden ? t.geheimSatz : badgeBeschreibung(def, sprache, lernweg)}
        </p>
        {/* Wie die große Medaille AUSSIEHT — nur für die Sprachausgabe. Ein
            sehendes Kind hat das Bild direkt darüber vor sich; ohne diesen
            Satz hätte ein Kind mit Blindheit an derselben Stelle nichts. */}
        <p className="sr-only">{medaillenBeschreibung(def, secretHidden, sprache)}</p>
        <p className="m-0 mt-1.5 text-sm text-ink-muted">
          {earned && ts
            ? t.verdientAm(datumDerOdznaki(ts, sprache))
            : earned
              ? t.verdient
              : selfView
                ? t.nochNichtSelbst
                : t.nochNicht}
        </p>

        <button
          ref={closeRef}
          type="button"
          className="btn btn-primary mt-4"
          onClick={onClose}
        >
          {t.schliessen}
        </button>
      </div>
    </div>
  );
}
