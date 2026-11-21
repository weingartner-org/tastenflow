/**
 * ★★★ DER ABZEICHEN-KATALOG SPANISCH (ES-O, 27.09.2026).
 *
 * Gegenstück zu `badgesFr.ts` - dieselbe Bauart, dieselben Schlüssel, NEU AUF
 * SPANISCH GESCHRIEBEN, nicht übersetzt (Bauplan spanischer Lehrgang D2/§7):
 * übertragen ist die IDEE des Namens. Wo das Spanische eine eigene Wendung zum
 * Motiv hat, steht sie da („Ratón de biblioteca" zum Bücherstapel, „Firme como
 * una roca", „Buena pesca" zum Fisch, „De un tirón"); sonst ein Stabreim wie im
 * Deutschen („Lince lector", „Pingüino preciso", „Tejón tenaz").
 * Variantenneutral: keine Wendung, die nur in Spanien oder nur in einem Land
 * Amerikas verstanden wird (kein „AVE", kein „como los chorros del oro").
 *
 * Grossschreibung wie im Spanischen: nur das erste Wort und Eigennamen. Die
 * trockenen Zweitnamen (`nameNeutral`, ab 11 Jahren) genau dort, wo das
 * Deutsche einen hat.
 *
 * Glossar (Bauplan §7): « insignia », Runde ⇒ « serie », Anschlag ⇒
 * « pulsación », Treffsicherheit ⇒ « precisión », Fehler ⇒ « error »,
 * Grundstellung ⇒ « posición inicial », Grundreihe ⇒ « fila guía », Etappe ⇒
 * « etapa », Eisschollen-Spiel ⇒ « Juego de la Banquisa ». Zahlen nach RAE:
 * vier Ziffern ohne Trenner („1000"), ab fünf mit Leerzeichen („10 000"),
 * „95 %" mit Leerzeichen. Beschreibungen ohne Anrede, wie im Deutschen.
 *
 * ⚠️ Die Monate bei „ferien-held" und „winterkind" (Juli/August, Dezember/
 * Januar) sind auf der Südhalbkugel eine andere Jahreszeit - Name UND
 * Beschreibung nennen darum nur die Zeit im Jahr, nicht „Sommer"/„Winter"/
 * „Ferien" (Prüfung 27.09.2026). Die Bildbeschreibung beschreibt weiter das
 * Emoji (🏖️/⛄, gemeinsam in `badges.ts`) - sie muss sagen, was zu sehen ist.
 * Tiere und Wörter variantenneutral: kein Gämse/Reh (nur Europa), kein „tarta".
 *
 * ⚠️ Wer ein Abzeichen anlegt, trägt es HIER mit ein - der Wächter
 * `tests/tastenflow-spanisch-alles.test.tsx` prüft, dass jede ID einen
 * spanischen Eintrag hat und einen Zweitnamen genau dort, wo es ihn im
 * Deutschen gibt.
 */
import { lernwegDef } from "./lernweg";
import { lektionenFuer } from "./curriculum";
import type { AbzeichenTextEn, AbzeichenZahlen } from "./badgesEn";

/** Dieselbe Form wie der englische Eintrag. */
export type AbzeichenTextEs = AbzeichenTextEn;

/** Die Zeichen von „alltags-ass", die es auf dem Weg des Kindes wirklich gibt (wie `badgesFr.ts`). */
function alltagsZeichen(z: AbzeichenZahlen): string {
  const reihe = new Set(lernwegDef(z.lernweg).introOrder);
  const da = ["@", "€", "$", "§"].filter((c) => reihe.has(c));
  if (da.length <= 1) return da.join("");
  return `${da.slice(0, -1).join(", ")} y ${da[da.length - 1]}`;
}

/** Die Familien (Überschriften im Regal) - Schlüssel ist der deutsche `group`-Name. */
export const ABZEICHEN_GRUPPEN_ES: Readonly<Record<string, string>> = {
  Fehlerfrei: "Sin errores",
  "Saubere Serie": "Series precisas",
  Fleiß: "Constancia",
  Anschläge: "Pulsaciones",
  Dranbleiben: "Perseverancia",
  Übungswochen: "Semanas de práctica",
  Sterne: "Estrellas",
  Lektionen: "Lecciones",
  Stufen: "Niveles",
  Tastenwelt: "El mundo del teclado",
  "Sitzt!": "¡Dominado!",
  Tempo: "Velocidad",
  "Am Stück": "De un tirón",
  Meisterprüfung: "Gran maestría",
  Abenteuer: "Aventuras",
  "Abenteuer-Kunststücke": "Hazañas de aventura",
  Expedition: "Expedición",
  Geschichten: "Cuentos",
  Lesestunde: "Hora de lectura",
  "Lese-Kunststücke": "Hazañas de lectura",
  Geheim: "Secreto",
};

/** Der ganze Katalog spanisch, je Abzeichen-ID. */
export const ABZEICHEN_ES: Readonly<Record<string, AbzeichenTextEs>> = {
  // ── Fehlerfrei ───────────────────────────────────────────────────────────
  volltreffer: { name: "En el blanco", description: "Una serie entera sin ni un solo error.", bildbeschreibung: "una diana con una flecha en el centro" },
  "null-fehler-ninja": { name: "Ninja cero errores", description: "5 series sin ningún error.", bildbeschreibung: "un ninja" },
  "makellos-meister": { name: "Estrella impecable", description: "15 series sin ningún error.", bildbeschreibung: "tres estrellas brillantes" },
  "diamant-finger": { name: "Dedos de diamante", description: "40 series sin ningún error.", bildbeschreibung: "una piedra preciosa azul" },
  "weisse-weste": { name: "Blanco como la nieve", description: "80 series sin ningún error.", bildbeschreibung: "una paloma blanca" },
  "einhorn-finger": { name: "Dedos de unicornio", nameNeutral: "150 series sin errores", description: "150 series sin ningún error.", bildbeschreibung: "un unicornio" },
  // ── Saubere Serie ────────────────────────────────────────────────────────
  "praezisions-pinguin": { name: "Pingüino preciso", nameNeutral: "Tres veces preciso", description: "3 series precisas seguidas (al menos 95 % de precisión).", bildbeschreibung: "un pingüino" },
  adlerauge: { name: "Ojo de águila", description: "7 series precisas seguidas (al menos 95 % de precisión).", bildbeschreibung: "un águila" },
  "laser-lama": { name: "Llama láser", nameNeutral: "Modo láser", description: "15 series precisas seguidas (al menos 95 % de precisión).", bildbeschreibung: "una llama" },
  "eiskalte-serie": { name: "Sangre fría", description: "25 series precisas seguidas (al menos 95 % de precisión).", bildbeschreibung: "un cubito de hielo" },
  // ── Fleiß ────────────────────────────────────────────────────────────────
  "tasten-kueken": { name: "Pollito del teclado", nameNeutral: "Primera serie", description: "La primerísima serie terminada.", bildbeschreibung: "un pollito saliendo del huevo" },
  "ausdauer-ameise": { name: "Hormiga hacendosa", nameNeutral: "Calentamiento hecho", description: "25 series de práctica.", bildbeschreibung: "una hormiga" },
  "marathon-maus": { name: "Ratón maratoniano", nameNeutral: "Cien series", description: "100 series de práctica.", bildbeschreibung: "la cabeza de un ratón" },
  "munteres-murmeltier": { name: "Castor constante", nameNeutral: "Maratón", description: "250 series de práctica.", bildbeschreibung: "un castor" },
  dauerlaeufer: { name: "Gran fondo", description: "500 series de práctica.", bildbeschreibung: "una persona corriendo" },
  tausendsassa: { name: "Las mil y una series", nameNeutral: "Mil series", description: "1000 series de práctica.", bildbeschreibung: "una ballena que echa un chorro de agua" },
  // ── Anschläge ────────────────────────────────────────────────────────────
  "tausend-tasten-tiger": { name: "Tigre de las mil teclas", nameNeutral: "Mil pulsaciones correctas", description: "1000 pulsaciones correctas.", bildbeschreibung: "la cabeza de un tigre" },
  "tasten-t-rex": { name: "T-Rex del teclado", nameNeutral: "Diez mil pulsaciones correctas", description: "10 000 pulsaciones correctas.", bildbeschreibung: "un T-Rex" },
  "galaktische-fingerspitzen": { name: "Dedos galácticos", description: "50 000 pulsaciones correctas.", bildbeschreibung: "un cohete despegando" },
  "hunderttausend-held": { name: "As de las cien mil", nameNeutral: "Cien mil pulsaciones correctas", description: "100 000 pulsaciones correctas.", bildbeschreibung: "un rayo amarillo" },
  viertelmillion: { name: "Un cuarto de millón", description: "250 000 pulsaciones correctas - tantas como en un libro entero.", bildbeschreibung: "un satélite" },
  // ── Dranbleiben ──────────────────────────────────────────────────────────
  "dranbleib-dachs": { name: "Tejón tenaz", nameNeutral: "Perseverancia", description: "Práctica en 3 días distintos.", bildbeschreibung: "un tejón" },
  gewohnheitstier: { name: "Tortuga fiel", description: "Práctica en 7 días distintos.", bildbeschreibung: "una tortuga" },
  "wie-ein-uhrwerk": { name: "Como un reloj", description: "Práctica en 20 días distintos.", bildbeschreibung: "un despertador rojo" },
  unaufhaltsam: { name: "Imparable", description: "Práctica en 50 días distintos.", bildbeschreibung: "una montaña con la cima nevada" },
  "tief-verwurzelt": { name: "Raíces profundas", description: "Práctica en 100 días distintos.", bildbeschreibung: "un árbol grande, verde y frondoso" },
  "fels-in-der-brandung": { name: "Firme como una roca", description: "Práctica en 200 días distintos - más que todos los días de clase de un año escolar.", bildbeschreibung: "una estatua de piedra de la isla de Pascua" },
  // ── Übungswochen ─────────────────────────────────────────────────────────
  "vierteljahr-dabei": { name: "Ya tres meses", description: "Práctica en 12 semanas distintas.", bildbeschreibung: "una hoja marrón de otoño" },
  "halbes-jahr-dabei": { name: "Ya seis meses", description: "Práctica en 26 semanas distintas.", bildbeschreibung: "una nube de la que cae nieve" },
  "ganzes-jahr-dabei": { name: "Un año entero", description: "Práctica en 52 semanas distintas.", bildbeschreibung: "un pastel de cumpleaños con una vela" },
  // ── Sterne ───────────────────────────────────────────────────────────────
  sternschnuppe: { name: "Estrella fugaz", description: "La primera serie con 3 estrellas.", bildbeschreibung: "una estrella fugaz en el cielo nocturno" },
  "sternen-sammler": { name: "Colección de estrellas", description: "10 series con 3 estrellas.", bildbeschreibung: "una estrella amarilla que brilla" },
  sternenhimmel: { name: "Cielo estrellado", description: "30 series con 3 estrellas.", bildbeschreibung: "la Vía Láctea en el cielo nocturno" },
  sternenmeer: { name: "Mar de estrellas", description: "75 series con 3 estrellas.", bildbeschreibung: "una estrella naranja de ocho puntas" },
  // ── Lektionen ────────────────────────────────────────────────────────────
  "lektions-loewe": { name: "León de las lecciones", nameNeutral: "Cinco lecciones", description: "5 lecciones terminadas.", bildbeschreibung: "un león" },
  "kapitel-kaeptn": { name: "Capitán de los capítulos", description: "15 lecciones terminadas.", bildbeschreibung: "un ancla" },
  // Wie im Englischen und Französischen: die Lektionszahl DES WEGES.
  "lehrgangs-legende": { name: "Leyenda del curso", description: (z) => `Las ${lektionenFuer(z.lernweg).length} lecciones terminadas.`, bildbeschreibung: "un trofeo de oro" },
  // ── Stufen (der Punktering) ──────────────────────────────────────────────
  "kletter-koala": { name: "Koala escalador", nameNeutral: "Nivel 5", description: "Nivel 5 alcanzado en el anillo de puntos.", bildbeschreibung: "un koala" },
  "punkte-rakete": { name: "Cohete de puntos", description: "Nivel 10 alcanzado en el anillo de puntos.", bildbeschreibung: "un globo rojo" },
  "gipfel-gaemse": { name: "Cabra de las cumbres", nameNeutral: "Nivel 20", description: "Nivel 20 alcanzado en el anillo de puntos.", bildbeschreibung: "una cabra" },
  hoehenflug: { name: "Vuelo alto", nameNeutral: "Nivel 50", description: "Nivel 50 alcanzado en el anillo de puntos.", bildbeschreibung: "un helicóptero" },
  "ueber-den-wolken": { name: "Por encima de las nubes", nameNeutral: "Nivel 100", description: "Nivel 100 alcanzado en el anillo de puntos.", bildbeschreibung: "un platillo volador" },
  sternenreise: { name: "Viaje a las estrellas", nameNeutral: "Nivel 200", description: "Nivel 200 alcanzado en el anillo de puntos.", bildbeschreibung: "un cometa de cola larga" },
  // ── Tastenwelt ───────────────────────────────────────────────────────────
  // Die Grundreihe DES WEGES: „a s d f j k l ñ" auf Weg „es".
  "grundstellungs-gorilla": {
    name: "Gorila de la fila guía",
    nameNeutral: "Fila guía en su sitio",
    description: (z) =>
      `Las ocho teclas de la posición inicial desbloqueadas: ${lernwegDef(z.lernweg)
        .letterOrder.slice(0, lernwegDef(z.lernweg).homeRowLetters)
        .join(" ")}.`,
    bildbeschreibung: "un gorila",
  },
  "gross-baumeister": { name: "Maestría en mayúsculas", nameNeutral: "Mayúsculas", description: "La tecla Mayús está aprendida - mayúsculas de verdad, escritas de propia mano.", bildbeschreibung: "cuatro letras mayúsculas sobre teclas azules" },
  // ⚠️ „puenktchen-panda" und „schlangen-s" gibt es auf Weg „es" nicht zu
  // verdienen - der Eintrag steht trotzdem da, weil das Regal jedes beschreibt.
  "puenktchen-panda": { name: "Panda de puntitos", nameNeutral: "Las diéresis alemanas", description: "ä, ö y ü desbloqueadas.", bildbeschreibung: "un panda" },
  "schlangen-s": { name: "S serpiente", nameNeutral: "La eszett", description: "ß, la eszett alemana, desbloqueada - la última letra del teclado alemán.", bildbeschreibung: "una serpiente" },
  "alphabet-as": { name: "As del alfabeto", description: "Todas las letras de la A a la Z desbloqueadas.", bildbeschreibung: "letras minúsculas sobre teclas azules" },
  "punkt-und-komma": { name: "Coma y punto", description: "El punto y la coma desbloqueados - los primeros signos de puntuación de verdad.", bildbeschreibung: "una pluma negra" },
  "satzzeichen-sammler": { name: "Colección de signos", nameNeutral: "Toda la puntuación", description: "Los signos de puntuación desbloqueados: . , - ¿? ¡! : ;", bildbeschreibung: "un gran signo de exclamación rojo" },
  "zahlen-zebra": { name: "Cebra de los números", nameNeutral: "La mitad de los números", description: "Cinco números de la fila de los números desbloqueados.", bildbeschreibung: "una cebra" },
  "zahlen-zauberer": { name: "Magia de los números", nameNeutral: "Fila de los números completa", description: "Toda la fila de los números, del 1 al 0, desbloqueada.", bildbeschreibung: "una tecla azul con el número 10" },
  "klammer-krokodil": { name: "Cocodrilo de paréntesis", nameNeutral: "Abrir y cerrar paréntesis", description: "Los paréntesis ( ) desbloqueados - los primeros símbolos.", bildbeschreibung: "un cocodrilo" },
  "alltags-ass": { name: "As de lo cotidiano", nameNeutral: "Los signos de cada día", description: (z) => `${alltagsZeichen(z)} desbloqueados - los signos del correo electrónico y del dinero.`, bildbeschreibung: "un sobre" },
  "tastatur-krone": { name: "Corona del teclado", nameNeutral: "Todo el teclado", description: "TODAS las teclas del teclado desbloqueadas - hasta el último símbolo.", bildbeschreibung: "una corona dorada" },
  // ── Sitzt! ───────────────────────────────────────────────────────────────
  "feste-burg": { name: "Casa firme", nameNeutral: "Fila guía dominada", description: "Las ocho teclas de la posición inicial están dominadas.", bildbeschreibung: "una casa" },
  "buchstaben-baendiger": { name: "Letras domadas", nameNeutral: "Todas las letras dominadas", description: "Cada letra está dominada - ya no duda ninguna.", bildbeschreibung: "un cuadrado rojo con una gran A" },
  "zahlen-fels": { name: "Números de piedra", nameNeutral: "Todos los números dominados", description: "Toda la fila de los números está dominada.", bildbeschreibung: "un ábaco con cuentas de colores" },
  "nichts-wackelt": { name: "Nada se tambalea", description: "Cada tecla del teclado está dominada - todo el teclado, no solo desbloqueado.", bildbeschreibung: "un rombo azul con un punto en el centro" },
  // ── Tempo ────────────────────────────────────────────────────────────────
  "flinker-fuchs": { name: "Zorro veloz", nameNeutral: "Rápido y preciso", description: "Meta de velocidad alcanzada Y al menos 95 % de precisión - la velocidad solo cuenta si se escribe con precisión.", bildbeschreibung: "un zorro" },
  "tempo-60": { name: "Liebre ligera", nameNeutral: "60 por minuto, con precisión", description: "Una serie a 60 pulsaciones por minuto con al menos 95 % de precisión.", bildbeschreibung: "un conejo" },
  "tempo-90": { name: "Venado veloz", nameNeutral: "90 por minuto, con precisión", description: "Una serie a 90 pulsaciones por minuto con al menos 95 % de precisión.", bildbeschreibung: "un venado" },
  "tempo-120": { name: "Caballo al galope", nameNeutral: "120 por minuto, con precisión", description: "Una serie a 120 pulsaciones por minuto con al menos 98 % de precisión.", bildbeschreibung: "un caballo galopando" },
  "tempo-160": { name: "Locomotora de vapor", nameNeutral: "160 por minuto, con precisión", description: "Una serie a 160 pulsaciones por minuto con al menos 98 % de precisión.", bildbeschreibung: "una locomotora de vapor" },
  "tempo-200": { name: "Tren bala", nameNeutral: "200 por minuto, con precisión", description: "Una serie a 200 pulsaciones por minuto con al menos 98 % de precisión.", bildbeschreibung: "un tren de alta velocidad" },
  "tempo-300": { name: "Avión a reacción", nameNeutral: "300 por minuto, con precisión", description: "Una serie a 300 pulsaciones por minuto con al menos 99 % de precisión - nivel profesional.", bildbeschreibung: "un avión pequeño" },
  // ── Am Stück ─────────────────────────────────────────────────────────────
  "kette-100": { name: "Reacción en cadena", nameNeutral: "100 seguidas", description: "100 pulsaciones correctas seguidas, sin ni un solo error.", bildbeschreibung: "dos eslabones de cadena" },
  "kette-250": { name: "Sin tropezar", description: "250 pulsaciones correctas seguidas.", bildbeschreibung: "una cadena de varios eslabones" },
  "kette-500": { name: "Hilo conductor", nameNeutral: "500 seguidas", description: "500 pulsaciones correctas seguidas - una serie entera y más.", bildbeschreibung: "un carrete de hilo" },
  "kette-1000": { name: "Mil sin error", description: "1000 pulsaciones correctas seguidas.", bildbeschreibung: "el monte Fuji con su gorro de nieve" },
  "kette-2000": { name: "La cadena de hierro", nameNeutral: "2000 seguidas", description: "2000 pulsaciones correctas seguidas - cuatro o cinco series sin el menor tropiezo.", bildbeschreibung: "un volcán del que sale lava" },
  // ── Abenteuer (das Spiel heisst in der Hilfe « el Juego de la Banquisa ») ─
  "erste-expedition": { name: "Primera expedición", description: "La primera aventura de la banquisa en juego libre, hasta el iglú.", bildbeschreibung: "una brújula" },
  polarforscher: { name: "Exploración polar", description: "10 aventuras de la banquisa terminadas en juego libre.", bildbeschreibung: "un copo de nieve" },
  "eismeer-legende": { name: "Leyenda de los mares helados", description: "30 aventuras de la banquisa terminadas en juego libre.", bildbeschreibung: "una ola azul alta" },
  "packeis-profi": { name: "As de la banquisa", nameNeutral: "60 aventuras", description: "60 aventuras de la banquisa terminadas en juego libre.", bildbeschreibung: "una maleta" },
  // ── Abenteuer-Kunststücke ────────────────────────────────────────────────
  // „Trockener Frack": Der Frack ist der Pinguin selbst - spanisch « el frac ».
  "trockener-frack": { name: "Frac seco", description: "Una aventura entera sin caer ni una vez al agua o a la nieve.", bildbeschreibung: "un sombrero de copa negro" },
  "immer-trocken": { name: "Siempre seco", description: (z) => `${z.trockeneAbenteuer} aventuras sin un solo chapuzón.`, bildbeschreibung: "un paraguas cerrado" },
  fischfaenger: { name: "Buena pesca", description: (z) => `${z.fische} peces extra atrapados en la aventura de la banquisa.`, bildbeschreibung: "un pez azul" },
  // ── Expedition ───────────────────────────────────────────────────────────
  // Die Zonennamen wie im Spiel (`course.ts`, ES-O): la Cueva del Eco, la
  // Tormenta de Nieve, la Estación Polar. Nie „ciego" als Tipp-Wort.
  "hoehlen-lauscher": { name: "A la escucha en la cueva", description: "La Cueva del Eco recorrida hasta la salida, a oscuras, solo con el oído.", bildbeschreibung: "un murciélago" },
  "sturm-trotzer": { name: "Más fuerte que la tormenta", description: "La Tormenta de Nieve atravesada - las secuencias escritas de memoria.", bildbeschreibung: "una cara que sopla viento" },
  "funker-freund": { name: "Amistad por radio", description: "Un mensaje de radio entero descifrado y enviado a la Estación Polar.", bildbeschreibung: "una radio" },
  "polarlicht-entdecker": { name: "Bajo la aurora austral", description: "Toda la Expedición polar sin un solo error - la aurora austral baila.", bildbeschreibung: "una estrella con una estela de chispas" },
  // ── Geschichten ──────────────────────────────────────────────────────────
  "lese-luchs": { name: "Lince lector", nameNeutral: "Primer cuento", description: "El primer cuento leído y escrito hasta el final.", bildbeschreibung: "un leopardo" },
  buecherwurm: { name: "Oruga lectora", description: "3 cuentos leídos hasta el final.", bildbeschreibung: "una oruga verde" },
  "buecherei-baer": { name: "Oso de biblioteca", nameNeutral: "Ocho cuentos", description: "8 cuentos leídos hasta el final.", bildbeschreibung: "un oso" },
  vielleser: { name: "Ratón de biblioteca", description: "15 cuentos leídos hasta el final.", bildbeschreibung: "una pila de libros de colores" },
  // ── Lesestunde ───────────────────────────────────────────────────────────
  "seiten-spatz": { name: "Gorrión de las páginas", nameNeutral: "Primera página", description: "La primera etapa de un cuento escrita.", bildbeschreibung: "un pajarito azul" },
  "kapitel-krake": { name: "Pulpo de los capítulos", nameNeutral: "Diez etapas", description: "10 etapas leídas y escritas.", bildbeschreibung: "un pulpo" },
  "geschichten-gigant": { name: "Gigante de los cuentos", description: "30 etapas leídas y escritas.", bildbeschreibung: "un elefante" },
  leseratte: { name: "Devoralibros", nameNeutral: "75 etapas", description: "75 etapas leídas y escritas.", bildbeschreibung: "un pergamino" },
  // ── Lese-Kunststücke ─────────────────────────────────────────────────────
  federleicht: { name: "Ligero como una pluma", description: "Una etapa entera escrita sin ni un solo error.", bildbeschreibung: "una pluma blanca" },
  "in-einem-rutsch": { name: "De un tirón", description: "Un cuento entero leído hasta el final en un solo día.", bildbeschreibung: "una espiral azul" },
  "lesezeichen-held": { name: "As del marcapáginas", description: "Otro día, la lectura siguió justo donde se había quedado.", bildbeschreibung: "un marcapáginas" },
  // ── Meisterprüfung ───────────────────────────────────────────────────────
  "zehn-minuten-abschrift": { name: "La transcripción de 10 minutos", description: "Diez minutos seguidos copiando un texto con un máximo de 0.5 % de errores - como una prueba de transcripción de verdad.", bildbeschreibung: "un cronómetro" },
  "lehrgangs-meister": { name: "Curso dominado", description: (z) => `Las ${lektionenFuer(z.lernweg).length} lecciones terminadas con tres estrellas.`, bildbeschreibung: "un birrete universitario negro" },
  "goldene-tastatur": { name: "El teclado de oro", description: "Todas las teclas desbloqueadas, todas dominadas - y una vez 160 pulsaciones por minuto con 98 % de precisión. La última insignia.", bildbeschreibung: "una medalla deportiva con cinta" },
  // ── Geheim ───────────────────────────────────────────────────────────────
  "gemuetliches-faultier": { name: "Perezoso tranquilo", description: "Muy despacio, y sin ni un solo error - ¡la precisión va antes que la velocidad!", bildbeschreibung: "un perezoso" },
  "comeback-kaenguru": { name: "El salto del canguro", description: "Una serie con 3 estrellas justo después de una serie con 1 estrella.", bildbeschreibung: "un canguro" },
  nachteule: { name: "Búho nocturno", description: "Una serie terminada después de las 21.", bildbeschreibung: "un búho" },
  "frueher-vogel": { name: "Con el canto del gallo", description: "Una serie terminada antes de las 7.", bildbeschreibung: "un gallo" },
  nimmersatt: { name: "Lectura glotona", description: "3 etapas devoradas en un solo día.", bildbeschreibung: "una manzana verde" },
  "ferien-held": { name: "Mitad de año", description: "Práctica en julio o en agosto.", bildbeschreibung: "una playa con una sombrilla" },
  "wochenend-schreiber": { name: "Escritura de fin de semana", description: "Práctica un sábado y un domingo.", bildbeschreibung: "una hoja de calendario" },
  "zurueck-im-sattel": { name: "De vuelta", description: (z) => `Práctica retomada después de una pausa de más de ${z.pauseTage} días - volver también cuenta.`, bildbeschreibung: "dos flechas que giran en círculo" },
  "doppelt-genaeht": { name: "Por partida doble", description: "Dos series sin errores, una justo después de la otra.", bildbeschreibung: "una aguja de coser con hilo" },
  winterkind: { name: "Entre dos años", description: "Práctica en diciembre o en enero.", bildbeschreibung: "un muñeco de nieve" },
  jahreswechsel: { name: "Cambio de año", description: "Práctica el último día del año o el primer día del año nuevo.", bildbeschreibung: "fuegos artificiales en el cielo nocturno" },
  "tages-marathon": { name: "Maratón de un día", description: "Diez series en un solo día.", bildbeschreibung: "un jinete sobre un caballo de carreras" },
  sternentag: { name: "Día de estrellas", description: "Tres series con tres estrellas en un solo día.", bildbeschreibung: "un sol con cara" },
  blitzsauber: { name: "Reluciente", description: "Tres series sin errores en un solo día.", bildbeschreibung: "un jabón con burbujas" },
  "volle-woche": { name: "Semana completa", description: "Práctica en cinco días distintos en UNA semana.", bildbeschreibung: "un libro verde" },
  // „Blindflug" ⇒ « Sin mirar »: zum Affen, der sich die Augen zuhält - ohne
  // das Wort „ciego".
  blindflug: { name: "Sin mirar", description: "Una serie entera sin errores - con el teclado en pantalla oculto. Ese es todo el arte de escribir con diez dedos.", bildbeschreibung: "un mono que se tapa los ojos con las manos" },
  // ★ D1 Randfund (28.09.2026): die Bedingung ist „zwei verschiedene Sprachen
  // geübt" (`badges.ts`) - auf Weg „es" Español und Inglés.
  sprachwechsler: { name: "Viaje entre idiomas", description: "Práctica en dos idiomas - por ejemplo, en español y en inglés.", bildbeschreibung: "el globo terráqueo con Europa y África" },
  lesenacht: { name: "Lectura de noche", description: "Una etapa de un cuento leída después de las 20.", bildbeschreibung: "una luna con cara" },
  "zaehe-taste": { name: "Tecla terca", description: "Una tecla que costó mucho tiempo ahora está dominada.", bildbeschreibung: "un caracol" },
  aufsteiger: { name: "En ascenso", description: "Cinco niveles de dificultad por encima del principio.", bildbeschreibung: "un gráfico con una línea que sube" },
};
