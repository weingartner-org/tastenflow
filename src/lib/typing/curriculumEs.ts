/**
 * ★★★ DIE LEKTIONEN DES WEGES „es" (ES-S, 27.09.2026).
 *
 * Bauplan `BAUPLAN-2026-09-27-SPANISCHER-LEHRGANG.md` §4.3 (Reihenfolge
 * Fassung A) und §5.1 („24 Lektionen"): die Grundreihe in vier Schritten, eine
 * EIGENE Lektion für die Ñ, die häufigen Buchstaben, eine eigene Lektion für
 * die Totaste ´ (á é í ó ú), Mayús (samt Á É Í Ó Ú), die übrigen Buchstaben,
 * die Diérese ü, die W, die Satzzeichen mit ¿ ? und ¡ ! als je EINER Lektion
 * (hartes Paar, §4.4), Ziffern, Sonderzeichen und zum Schluss Texte. Neu auf
 * Spanisch geschrieben, nicht übersetzt; die Kinder werden geduzt („tú", S9);
 * Tastenwege statt Maus; Fingernamen aus dem Glossar (§7: índice, medio,
 * anular, meñique, pulgar).
 *
 * ── DIE REGEL, AN DER ALLES HÄNGT (wie `curriculumFr.ts`) ───────────────────
 * Jede Lektion führt NUR Tasten ein, die in der Reihenfolge des Weges
 * (`lernweg.ts#ES_LETTER_ORDER`) bis dahin dran sind: Die Tasten aller
 * Lektionen hintereinander SIND `introOrder("es")`. Wächter:
 * `tests/tastenflow-lektionen-es.test.ts`.
 *
 * ── ZWEI TASTATUREN, EINE LISTE ─────────────────────────────────────────────
 * Anders als Französisch liegt die Grundreihe auf Spanien (ISO) und
 * Lateinamerika PHYSISCH gleich (`a s d f j k l ñ`) - die Lektionen haben auf
 * beiden dieselben Tasten; nur „€" fehlt auf Lateinamerika (P9) und fällt dort
 * aus seiner Lektion. Verschieden sind die GRIFFE: der Akzent liegt auf
 * Spanien in der Grundreihe (rechts von Ñ), auf Lateinamerika oben (rechts von
 * P); ¿ und ¡ sind vertauscht (Falle 6, 8). Die Griffe werden darum aus den
 * Daten der Tastatur gerechnet (`layouts.ts`), nie geschrieben.
 *
 * ⚠️ Beispielwörter stehen in geraden Anführungszeichen (S4) und sind an der
 * Stelle ihrer Lektion auf BEIDEN Tastaturen tippbar (Wächter prüft jedes).
 */
import type { Lesson, LessonKind } from "./curriculum";
import { lernwegDef } from "./lernweg";
import { layoutById, layoutIndex, type KeyboardLayout, type LayoutId } from "./layouts";
import { FINGERS, fingerName, type FingerId } from "./fingers";
// ★ G2b-1: Gross-/Klein ausdrücklich in der Sprache dieser Lektionen ("es") - siehe curriculumFr.ts.
import { grossFuer, kleinFuer } from "./sprachRegister";

interface EsLektionsBauplan {
  id: string;
  kind: LessonKind;
  /** Die neuen Einheiten, genau in der Reihenfolge des Weges. */
  einheiten: readonly string[];
  enablesShift?: boolean;
  corpusKinds?: Lesson["corpusKinds"];
  titel: (tasten: readonly string[]) => string;
  /** Der geschriebene erste Absatz der Einführung - gilt auf beiden Tastaturen. */
  vorspann: string;
  /** Statt der gerechneten Griffe ein eigener Teil (Mayús, Ziffern, Texte). */
  griffe?: (tasten: readonly string[], layout: KeyboardLayout) => string;
}

// ── Tastennamen ───────────────────────────────────────────────────────────────

/** Buchstaben a-z und ñ gross (wie auf der Kappe), sonst das Zeichen. */
function kappe(k: string): string {
  return /^[a-zñ]$/.test(k) ? grossFuer(k, "es") : k;
}

/** Satz- und Sonderzeichen haben im Satz einen NAMEN vor dem Zeichen. */
const ZEICHEN_NAMEN_ES: Readonly<Record<string, string>> = {
  ".": "el punto", ",": "la coma", ";": "el punto y coma", ":": "los dos puntos",
  "¿": "el signo de apertura de interrogación", "?": "el signo de cierre de interrogación",
  "¡": "el signo de apertura de exclamación", "!": "el signo de cierre de exclamación",
  '"': "las comillas", "-": "el guion", "(": "el paréntesis de apertura", ")": "el paréntesis de cierre",
  "´": "la tilde", "¨": "la diéresis", "%": "el signo de porcentaje", "€": "el símbolo del euro",
  $: "el signo de peso o dólar", "@": "la arroba", "/": "la barra", "&": "la y comercial",
  "*": "el asterisco", "+": "el signo más", "=": "el signo igual", _: "el guion bajo",
  "<": "el signo menor que", ">": "el signo mayor que", "[": "el corchete de apertura",
  "]": "el corchete de cierre", "{": "la llave de apertura", "}": "la llave de cierre",
  "#": "el signo numeral", "|": "la barra vertical",
  // ★ D1 Nr. 13 (28.09.2026): der Apostroph als letzte Zeichen-Sprosse.
  "'": "el apóstrofo",
};

/** Das Zeichen im Satz: in geraden Anführungszeichen, das Anführungszeichen selbst in Klammern. */
function zeichenZeigen(u: string): string {
  return u === '"' ? `(")` : `"${u}"`;
}

/** Der Anfang eines Griff-Satzes: „E", „El punto "."". */
function satzAnfang(u: string): string {
  const name = ZEICHEN_NAMEN_ES[u];
  if (!name) return kappe(u);
  return `${grossFuer(name.charAt(0), "es")}${name.slice(1)} ${zeichenZeigen(u)}`;
}

/** Eine Taste im Satz: Buchstaben und Ziffern für sich, Zeichen gezeigt. */
function tasteImSatz(k: string): string {
  return /^[\p{L}\p{N}]$/u.test(k) ? kappe(k) : zeichenZeigen(k);
}

/** „F y J", „C, I y M". */
function aufzaehlen(teile: readonly string[]): string {
  if (teile.length <= 1) return teile.join("");
  return `${teile.slice(0, -1).join(", ")} y ${teile[teile.length - 1]}`;
}

function kappen(tasten: readonly string[]): string {
  return aufzaehlen(tasten.map(kappe));
}

// ── Griffe aus den Daten der Tastatur ────────────────────────────────────────

const REIHE_ES = ["fila de los números", "fila superior", "fila guía", "fila inferior"];

/** Finger → seine Taste in der Grundstellung (die Heimattasten des Weges, auf DIESER Tastatur). */
function heimTasten(layout: KeyboardLayout): ReadonlyMap<FingerId, string> {
  const m = new Map<FingerId, string>();
  for (const k of lernwegDef("es").homeKeys) {
    const f = layoutIndex(layout).finger.get(k);
    if (f) m.set(f, k);
  }
  return m;
}

function platz(layout: KeyboardLayout, taste: string): { reihe: number; spalte: number } | null {
  for (let r = 0; r < layout.rows.length; r++) {
    const s = layout.rows[r].keys.indexOf(taste);
    if (s >= 0) return { reihe: r, spalte: s };
  }
  return null;
}

/** Die Spalte in der Zählung der Grundreihe (Ziffernreihe und ISO-Unterreihe beginnen eine Taste weiter links). */
function grundreihenSpalte(layout: KeyboardLayout, reihe: number, spalte: number): number {
  if (reihe === 0) return spalte - 1;
  if (reihe === 3 && layout.rows[3].keys.length === 11) return spalte - 1;
  return spalte;
}

/** „medio izquierdo, justo encima de D" - Finger und Lage einer Taste. */
function lage(layout: KeyboardLayout, taste: string): string | null {
  const p = platz(layout, taste);
  const fingerId = layoutIndex(layout).finger.get(taste);
  if (!p || !fingerId || fingerId === "daumen") return null;
  const finger = fingerName(FINGERS[fingerId], "es");
  const h = heimTasten(layout).get(fingerId);
  const hp = h ? platz(layout, h) : null;
  if (!h || !hp || hp.reihe !== 2) return `${finger}, ${REIHE_ES[p.reihe]}`;
  const H = kappe(h);
  const s = grundreihenSpalte(layout, p.reihe, p.spalte);
  const abstand = Math.abs(s - hp.spalte);
  const richtung = s < hp.spalte ? "a la izquierda" : "a la derecha";
  const weit = abstand >= 3 ? "tres teclas " : abstand === 2 ? "dos teclas " : "";
  if (p.reihe === 2) return taste === h ? `${finger}, en la posición de partida` : `${finger}, ${weit}${richtung} de ${H}`;
  const vorne = p.reihe === 0 ? "en la fila de los números, " : "";
  if (abstand === 0) return `${finger}, ${vorne}${p.reihe === 3 ? "justo debajo de" : "justo encima de"} ${H}`;
  return `${finger}, ${vorne}${p.reihe === 3 ? "abajo" : "arriba"}, ${weit}${richtung} de ${H}`;
}

/** Ein Satz: wie wird diese Einheit auf dieser Tastatur getippt? */
function griffSatz(layout: KeyboardLayout, u: string): string {
  const zugang = layout.access[u];
  const anfang = satzAnfang(u);
  if (zugang?.dead) {
    const wo = lage(layout, zugang.base);
    const beispiel = u === "¨" ? "¨ y luego u da ü" : "´ y luego a da á";
    const muerta =
      "Es una tecla muerta: sola no escribe nada, pone su signo sobre la vocal que pulsas " +
      `después - ${beispiel}.`;
    if (zugang.base === u && !zugang.mod) return `${anfang}: ${wo ?? "su propia tecla"}. ${muerta}`;
    const mod = zugang.mod === "shift" ? "mantén pulsada Mayús de la otra mano y pulsa " : zugang.mod === "altgr" ? "mantén pulsada Alt Gr y pulsa " : "";
    return `${anfang}: ${mod}la tecla ${tasteImSatz(zugang.base)}${wo ? ` (${wo})` : ""}. ${muerta}`;
  }
  if (zugang?.mod) {
    const wo = lage(layout, zugang.base);
    const mod = zugang.mod === "shift" ? "Mayús de la otra mano" : "Alt Gr";
    return `${anfang}: mantén pulsada ${mod} y pulsa ${tasteImSatz(zugang.base)}${wo ? ` (${wo})` : ""}.`;
  }
  const wo = lage(layout, u);
  if (wo) return `${anfang}: ${wo}.`;
  // Nicht geraten: Die Daten dieser Tastatur zeigen keinen Griff.
  return `${anfang}: su lugar en este teclado todavía no está descrito aquí.`;
}

function griffeGerechnet(tasten: readonly string[], layout: KeyboardLayout): string {
  return tasten.map((u) => griffSatz(layout, u)).join(" ");
}

// ── Die Sonderteile ──────────────────────────────────────────────────────────

function mayusTeil(_t: readonly string[], layout: KeyboardLayout): string {
  const tilde = lage(layout, layout.access["´"]?.base ?? "´");
  return (
    "Para una mayúscula, mantén pulsada la tecla Mayús con la OTRA mano: una letra de la " +
    "mitad izquierda del teclado pide la Mayús de la derecha, una letra de la mitad derecha, " +
    "la Mayús de la izquierda. De eso se encargan los dos meñiques. Solo cuenta la Mayús de " +
    "la otra mano. Para Á, É, Í, Ó y Ú, pulsa primero la tilde ´" +
    `${tilde ? ` (${tilde})` : ""} y después Mayús con la vocal.`
  );
}

function numerosTeil(_t: readonly string[], layout: KeyboardLayout): string {
  const uno = lage(layout, "1");
  return (
    "En tu teclado, los números se escriben sin Mayús. Cada dedo sube por su columna hasta " +
    "la fila de los números: 1 2 3 4 5 con la mano izquierda, 6 7 8 9 0 con la derecha" +
    `${uno ? ` (1: ${uno})` : ""}.`
  );
}

// ── Die Folge ────────────────────────────────────────────────────────────────

const FILA = (t: readonly string[]) => `La fila guía: ${kappen(t)}`;

const BAUPLAENE: readonly EsLektionsBauplan[] = [
  {
    id: "es-guia-1", kind: "home", einheiten: ["f", "j"], titel: FILA,
    vorspann:
      "Coloca los dedos en la fila guía: es la posición de partida. Las pequeñas marcas de F " +
      "y J te ayudan a encontrarla sin mirar. Empezamos con estas dos teclas: los dos índices. " +
      "Cada dedo sale de aquí y vuelve aquí después de cada tecla.",
  },
  {
    id: "es-guia-2", kind: "home", einheiten: ["d", "k"], titel: FILA,
    vorspann: "Los dedos medios se unen a los índices: D a la izquierda, K a la derecha. Los índices se quedan en sus marcas.",
  },
  {
    id: "es-guia-3", kind: "home", einheiten: ["s", "l"], titel: FILA,
    vorspann: "Ahora llegan los anulares: S a la izquierda, L a la derecha.",
  },
  {
    id: "es-guia-4", kind: "home", einheiten: ["a"], titel: FILA,
    vorspann:
      "El meñique izquierdo se coloca sobre la A. Con ella salen las primeras palabras: " +
      "\"la\", \"las\", \"sal\", \"sala\", \"alas\", \"falda\".",
  },
  {
    id: "es-enye", kind: "home", einheiten: ["ñ"], titel: () => "La letra Ñ",
    vorspann:
      "La Ñ es la letra característica del español, y en tu teclado tiene su tecla en la fila guía, " +
      "bajo el meñique derecho. Con ella, la fila guía está completa: ocho dedos sobre ocho " +
      "teclas y los pulgares sobre la barra espaciadora. Por ahora la practicas en sílabas; " +
      "en cuanto lleguen más vocales, escribirás palabras con ella.",
  },
  {
    id: "es-frecuentes-1", kind: "letters", einheiten: ["e", "o"], titel: (t) => `Las letras más frecuentes: ${kappen(t)}`,
    vorspann:
      "La E y la O están entre las letras más frecuentes del español. Con ellas llegan muchas " +
      "palabras cortas: \"el\", \"de\", \"se\", \"los\", \"sol\", \"oso\", \"lado\", \"dedo\", \"año\", \"leña\".",
  },
  {
    id: "es-frecuentes-2", kind: "letters", einheiten: ["n", "t"], titel: (t) => `Las letras más frecuentes: ${kappen(t)}`,
    vorspann: "Con N y T escribes \"no\", \"en\", \"nada\", \"todo\", \"este\", \"nota\", \"tanto\" y \"señal\".",
  },
  {
    id: "es-frecuentes-3", kind: "letters", einheiten: ["u", "r"], titel: (t) => `Las letras más frecuentes: ${kappen(t)}`,
    vorspann: "Con U y R llegan muchas palabras nuevas: \"una\", \"luna\", \"rosa\", \"tren\", \"tres\", \"rueda\", \"fuerte\", \"sueño\".",
  },
  {
    id: "es-frecuentes-4", kind: "letters", einheiten: ["c", "i", "m"], titel: (t) => `Las letras más frecuentes: ${kappen(t)}`,
    vorspann:
      "Con C, I y M ya puedes escribir frases enteras, como \"mi casa es tu casa\", y muchas palabras: " +
      "\"casa\", \"mesa\", \"mano\", \"cine\", " +
      "\"cinco\", \"camino\", \"niño\", \"niña\", \"ciudad\", \"mañana\".",
  },
  {
    id: "es-tilde", kind: "letters", einheiten: ["´"], titel: () => "La tilde: á, é, í, ó, ú",
    vorspann:
      "En español, la tilde cambia el sentido de muchas palabras: no es lo mismo \"mas\" que " +
      "\"más\", ni \"esta\" que \"está\". Con la tilde escribes \"sí\", \"día\", \"mamá\", \"café\", " +
      "\"sofá\", \"adiós\", \"canción\", \"ratón\", \"limón\" y \"león\". Más adelante, con Mayús, " +
      "escribirás también Á, É, Í, Ó y Ú.",
  },
  {
    id: "es-mayus", kind: "shift", einheiten: [], enablesShift: true, titel: () => "Las mayúsculas con la tecla Mayús",
    vorspann:
      "Hasta ahora Tastenflow ponía las mayúsculas por ti. Desde aquí las escribe tu mano: " +
      "\"Ana\", \"Tomás\", \"Madrid\", \"Toledo\", \"Sucre\", \"Asunción\", \"Ecuador\", \"Óscar\", \"África\".",
    griffe: mayusTeil,
  },
  // ★★★ D-1 (28.09.2026, Didaktik-Synthese): Punkt und Komma direkt nach
  // Mayús - in den spanischen Lehrgängen kommen sie mit der unteren Reihe,
  // wie Buchstaben (ARTypist, typingpractice.org); „ein Satz = Grossbuchstabe
  // + Punkt". Die Lektion bleibt dieselbe, nur ihr Platz ist neu.
  {
    id: "es-puntuacion-1", kind: "punctuation", einheiten: [".", ","], titel: () => "El punto y la coma: . ,",
    vorspann: "El punto cierra la frase, la coma separa sus partes. Detrás de los dos va un espacio.",
  },
  {
    id: "es-pqb", kind: "letters", einheiten: ["p", "q", "b"], titel: (t) => `Más letras: ${kappen(t)}`,
    vorspann:
      "P, Q y B traen \"papá\", \"pan\", \"que\", \"qué\", \"queso\", \"bien\", \"barco\", \"bebé\", " +
      "\"pequeño\" y tres capitales: \"Quito\", \"Panamá\", \"Buenos Aires\".",
  },
  {
    id: "es-ghv", kind: "letters", einheiten: ["g", "h", "v"], titel: (t) => `Más letras: ${kappen(t)}`,
    vorspann:
      "La H no suena, pero se escribe: \"hola\", \"hermano\", \"hablar\". Con G y V llegan " +
      "\"gato\", \"agua\", \"gracias\", \"vaca\", \"verde\", \"vida\", \"Guatemala\", \"Honduras\" y \"Bolivia\".",
  },
  {
    id: "es-yzx", kind: "letters", einheiten: ["y", "z", "x"], titel: (t) => `Letras menos frecuentes: ${kappen(t)}`,
    vorspann:
      "Con Y, Z y X escribes \"yo\", \"hoy\", \"muy\", \"luz\", \"voz\", \"zorro\", \"taxi\", \"examen\" " +
      "y los nombres de \"México\", \"Paraguay\", \"Uruguay\" y \"Venezuela\".",
  },
  {
    id: "es-dieresis", kind: "letters", einheiten: ["¨"], titel: () => "La diéresis: ü",
    vorspann:
      "La diéresis hace sonar la U entre la G y la E o la I: \"pingüino\", \"cigüeña\", \"bilingüe\", \"agüita\".",
  },
  {
    id: "es-w", kind: "letters", einheiten: ["w"], titel: () => "La letra W",
    vorspann: "La W aparece sobre todo en palabras de otras lenguas: \"kiwi\", \"wifi\", \"web\". Con ella tienes todo el alfabeto.",
  },
  {
    id: "es-interrogacion", kind: "punctuation", einheiten: ["¿", "?"], titel: () => "La pregunta: ¿ ?",
    vorspann:
      "El español abre y cierra las preguntas: \"¿Qué hora es?\", \"¿Dónde vives?\". Por eso los dos " +
      "signos llegan juntos, y Tastenflow nunca te da uno sin el otro.",
  },
  {
    id: "es-exclamacion", kind: "punctuation", einheiten: ["¡", "!"], titel: () => "La exclamación: ¡ !",
    vorspann: "Lo mismo pasa con la exclamación: \"¡Hola!\", \"¡Qué bien!\", \"¡Gol!\". Los dos signos van siempre en pareja.",
  },
  {
    id: "es-puntuacion-2", kind: "punctuation", einheiten: [";", ":", '"', "-", "(", ")"], titel: (t) => `Más signos: ${t.join(" ")}`,
    vorspann:
      "Punto y coma, dos puntos, comillas, guion y paréntesis: con ellos escribes listas, " +
      "citas y aclaraciones.",
  },
  {
    id: "es-numeros", kind: "numbers", einheiten: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    titel: () => "La fila de los números",
    vorspann: "Fechas, horas, precios y resultados: ahora los números.",
    griffe: numerosTeil,
  },
  {
    id: "es-especiales-1", kind: "symbols", einheiten: ["%", "€", "$", "@", "/", "&", "*", "+", "="],
    titel: (t) => `Caracteres especiales: ${t.join(" ")}`,
    vorspann: "Estos signos aparecen en precios, en cuentas y en direcciones de correo electrónico.",
  },
  {
    // ★ D1 Nr. 13 (28.09.2026): „'" dazu - die letzte Sprosse des Weges „es"
    // (ES_SYMBOL_ORDER, lernweg.ts), Wörter aus Maya-Sprachen und Programmcode.
    id: "es-especiales-2", kind: "symbols", einheiten: ["_", "<", ">", "[", "]", "{", "}", "#", "|", "'"],
    titel: (t) => `Más caracteres especiales: ${t.join(" ")}`,
    vorspann:
      "Y estos, sobre todo en programación y en fórmulas. El apóstrofo aparece también en palabras de lenguas mayas, como ma'alob.",
  },
  {
    id: "es-textos", kind: "text", einheiten: [], corpusKinds: ["satz"], titel: () => "Textos de todo el mundo hispano",
    vorspann:
      "Ya tienes todo el teclado. Ahora escribes textos enteros, de España y de toda América: " +
      "fiestas, animales, comidas y la vida de cada día.",
    griffe: () => "",
  },
];

// ── Bauen je Tastatur ────────────────────────────────────────────────────────

/** Die Folge der Bauplan-IDs, zum Nachprüfen im Wächter. */
export const ES_LEKTIONS_IDS: readonly string[] = BAUPLAENE.map((b) => b.id);

/** Der GESCHRIEBENE erste Absatz jeder Lektion - für den Beispielwort-Wächter. */
export const ES_LEKTIONS_VORSPANN: Readonly<Record<string, string>> = Object.fromEntries(
  BAUPLAENE.map((b) => [b.id, b.vorspann]),
);

function baueLektionen(layout: KeyboardLayout): Lesson[] {
  const fehlt = layoutIndex(layout).missing;
  return BAUPLAENE.map((b) => {
    // Nur, was es auf dieser Tastatur gibt (Lateinamerika: kein „€", P9).
    const tasten = b.einheiten.filter((u) => !fehlt.has(kleinFuer(u, "es")));
    const griffe = b.griffe ? b.griffe(tasten, layout) : griffeGerechnet(tasten, layout);
    const lektion: Lesson = {
      id: b.id,
      title: b.titel(tasten),
      kind: b.kind,
      newKeys: tasten,
      intro: griffe ? `${b.vorspann} ${griffe}` : b.vorspann,
    };
    if (b.enablesShift) lektion.enablesShift = true;
    if (b.corpusKinds) lektion.corpusKinds = b.corpusKinds;
    return lektion;
  });
}

/** Die spanischen Pflicht-Tastaturen (Bauplan S3). */
const ES_LAYOUTS: readonly LayoutId[] = ["es", "latam"];

const CACHE = new Map<LayoutId, readonly Lesson[]>();

/**
 * Die Lektionen des Weges „es" auf dieser Tastatur - gecacht, damit
 * `lektionenFuer("es")` bei gleicher Tastatur immer DIESELBE Liste liefert.
 * Eine nicht-spanische Tastatur (ein Kind auf Weg „es" mit deutscher
 * Tastatur) bekommt die Griffe der spanischen Tastatur Spaniens nicht
 * untergeschoben: gerechnet wird mit der Tastatur, die eingestellt ist.
 * Jede Lektion trägt in {@link Lesson.introByLayout} die Einführung der
 * anderen spanischen Tastatur, wo sie abweicht.
 */
export function esLektionenFuerLayout(layoutId: LayoutId): readonly Lesson[] {
  const cached = CACHE.get(layoutId);
  if (cached) return cached;
  const eigene = baueLektionen(layoutById(layoutId));
  const andere = ES_LAYOUTS.filter((id) => id !== layoutId).map(
    (id) => [id, new Map(baueLektionen(layoutById(id)).map((l) => [l.id, l.intro]))] as const,
  );
  for (const l of eigene) {
    const je: Partial<Record<LayoutId, string>> = {};
    for (const [id, intros] of andere) {
      const text = intros.get(l.id);
      if (text !== undefined && text !== l.intro) je[id] = text;
    }
    if (Object.keys(je).length > 0) l.introByLayout = je;
  }
  const fertig = Object.freeze(eigene);
  CACHE.set(layoutId, fertig);
  return fertig;
}

