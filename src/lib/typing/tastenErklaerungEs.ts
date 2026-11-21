/**
 * Tastenflow - „Tasten erkunden" / „Tasten finden" in der SPANISCHEN
 * Bedienung (★ ES-O, 27.09.2026, Bauplan spanischer Lehrgang §7, S13).
 *
 * Dieselbe Logik wie bei Deutsch, Englisch und Französisch: `erkundeTaste` in
 * `tastenErklaerung.ts` entscheidet weiter, WAS eine Taste ist (Sondertaste,
 * Zeichen, Kombination, dritter Layer, Totaste) und ob sie geschluckt wird.
 * Hier stehen nur die WÖRTER - dieselben Fächer wie in `tastenErklaerungFr.ts`,
 * Eintrag für Eintrag, NEU auf Spanisch geschrieben (nicht übersetzt).
 *
 * ── Glossar (Bauplan S13, §7) ───────────────────────────────────────────────
 *  Mayús · Bloq Mayús · Alt Gr · tecla muerta (tilde, diéresis) · barra
 *  espaciadora · Retroceso · Intro · Esc · Tab · Supr · Inicio · Fin · Re Pág ·
 *  Av Pág. Finger: índice, medio, anular, meñique, pulgar (`fingers.ts`).
 *
 * ── Die Regeln der Sätze ────────────────────────────────────────────────────
 *  · Einfache Sprache, kurze Sätze, ein Kind ist gemeint: **tú** (Bauplan S9).
 *  · Kein -e/-x/@ (S10). Nur Bindestrich `-`. Keine Maus-Wörter. Jeder Satz
 *    endet mit einem Punkt. Der erste Satz von `was` beginnt klein - die Taste
 *    ist sein Subjekt („pasa de un elemento a otro").
 *  · Geübt wird auf der Tastatur Spaniens oder Lateinamerikas - wo eine Taste
 *    dort verschieden liegt (¿ ¡, der Akzent), bleibt der Satz allgemein.
 */
import type { Plattform } from "../computer/model";
import type { TastenName } from "../computer/tastenNamen";
import { spokenLabel } from "./fingers";
import type { LayoutId } from "./layouts";
import type { TastenErklaerung } from "./tastenErklaerung";

/* ══ Sondertasten ═══════════════════════════════════════════════════════════ */

/** Spanische Sondertaste nach der Kennung aus dem Tasten-Wörterbuch. */
export function sondertasteEs(
  id: string,
  plattform: Plattform,
  _layout: LayoutId = "es",
): TastenErklaerung | null {
  const mac = plattform === "macos";
  const pfeilWort = mac ? "Opción" : "Ctrl";
  switch (id) {
    case "tabulator":
      return {
        kurz: "Tab",
        name: "tecla de tabulación",
        was: [
          "pasa de un elemento a otro, por ejemplo a un enlace, una casilla o un botón.",
          "Con Mayús vuelve hacia atrás.",
        ],
      };
    case "eingabe":
    case "zeilenschalter":
      return mac
        ? {
            kurz: "Retorno",
            name: "tecla Retorno",
            was: ["confirma y envía.", "Abre los enlaces y empieza una línea nueva en un texto."],
          }
        : {
            kurz: "Intro",
            name: "tecla Intro",
            was: [
              "confirma y envía.",
              "Abre los enlaces, activa los botones y empieza una línea nueva en un texto.",
            ],
          };
    case "leertaste":
      return {
        kurz: null,
        name: "barra espaciadora",
        was: ["pone un espacio entre dos palabras.", "También activa los botones y marca las casillas."],
      };
    case "loeschtaste":
      return {
        kurz: null,
        name: "tecla Retroceso",
        was: ["borra el carácter a la izquierda del cursor.", "Así se corrige un error."],
      };
    case "entf":
      return mac
        ? {
            kurz: null,
            name: "tecla Suprimir",
            was: [
              "borra el carácter a la derecha del cursor.",
              "Si tu teclado no la tiene, usa fn y la tecla Retroceso.",
            ],
          }
        : {
            kurz: "Supr",
            name: "tecla Suprimir",
            was: ["borra el carácter a la derecha del cursor.", "También borra los archivos seleccionados."],
          };
    case "esc":
      return {
        kurz: "Esc",
        name: "tecla Escape",
        was: [
          "cancela.",
          "Cierra los menús, las ventanas y los mensajes.",
          "En Tastenflow te lleva de vuelta al campo de práctica.",
        ],
      };
    case "umschalt":
      return {
        kurz: "Mayús",
        name: "tecla Mayúsculas",
        was: [
          "escribe letras mayúsculas mientras la mantienes pulsada.",
          "También da el carácter de arriba de una tecla, por ejemplo el signo de interrogación.",
        ],
      };
    case "feststell":
      return {
        kurz: "Bloq Mayús",
        name: "tecla Bloqueo de mayúsculas",
        was: ["escribe todo en mayúsculas hasta que la vuelves a pulsar."],
      };
    case "pfeil-links":
      return {
        kurz: null,
        name: "flecha izquierda",
        was: ["mueve el cursor un carácter a la izquierda.", `Con ${pfeilWort}, salta una palabra entera.`],
      };
    case "pfeil-rechts":
      return {
        kurz: null,
        name: "flecha derecha",
        was: ["mueve el cursor un carácter a la derecha.", `Con ${pfeilWort}, salta una palabra entera.`],
      };
    case "pfeil-auf":
      return {
        kurz: null,
        name: "flecha arriba",
        was: ["mueve el cursor una línea hacia arriba.", "En listas y menús, sube un elemento.", `Con ${pfeilWort}, salta un párrafo hacia arriba.`],
      };
    case "pfeil-ab":
      return {
        kurz: null,
        name: "flecha abajo",
        was: ["mueve el cursor una línea hacia abajo.", "En listas y menús, baja un elemento.", `Con ${pfeilWort}, salta un párrafo hacia abajo.`],
      };
    case "pos1":
      return {
        kurz: null,
        name: "tecla Inicio",
        was: ["va al principio de la línea.", "En una página web, va arriba del todo.", "Con Ctrl, va al principio de todo el texto."],
      };
    case "ende":
      return {
        kurz: null,
        name: "tecla Fin",
        was: ["va al final de la línea.", "En una página web, va abajo del todo.", "Con Ctrl, va al final de todo el texto."],
      };
    case "bild-auf":
      return {
        kurz: "Re Pág",
        name: "tecla Retroceder página",
        was: ["sube una pantalla."],
      };
    case "bild-ab":
      return {
        kurz: "Av Pág",
        name: "tecla Avanzar página",
        was: ["baja una pantalla."],
      };
    case "einfg":
      return {
        kurz: "Insert",
        name: "tecla Insertar",
        was: [
          "es la tecla del lector de pantalla en NVDA y JAWS.",
          "Muchas órdenes del lector de pantalla empiezan con ella.",
        ],
      };
    case "strg":
      return {
        kurz: "Ctrl",
        name: "tecla Control",
        was: [
          "sirve para los atajos de teclado.",
          "Ctrl + C copia, Ctrl + V pega, Ctrl + Z deshace.",
          "Sola, hace callar la voz.",
        ],
      };
    case "alt":
      return {
        kurz: null,
        name: "tecla Alt",
        was: [
          "sirve para los atajos de teclado.",
          "Alt + Tab cambia de ventana.",
          "En Tastenflow, Alt + H abre la ayuda.",
        ],
      };
    case "altgr":
      return {
        kurz: "Alt Gr",
        name: "tecla Alt Gr",
        was: ["escribe el tercer carácter de una tecla, por ejemplo la arroba o el signo del euro."],
      };
    case "windows-taste":
      return {
        kurz: "Win",
        name: "tecla Windows",
        was: [
          "abre el menú Inicio.",
          "Púlsala otra vez para cerrarlo.",
          "Con otras teclas hace más cosas, por ejemplo Win + D muestra el escritorio.",
        ],
      };
    case "befehlstaste":
      return {
        kurz: "cmd",
        name: "tecla Comando",
        was: ["sirve para los atajos de teclado.", "cmd + C copia, cmd + V pega, cmd + Z deshace."],
      };
    case "wahltaste":
      return {
        kurz: "Opción",
        name: "tecla Opción",
        was: ["escribe símbolos, por ejemplo la arroba.", "Con las flechas, salta una palabra entera."],
      };
    case "ctrl":
      return {
        kurz: "ctrl",
        name: "tecla Control",
        was: ["forma parte de los atajos de teclado en un Mac.", "Sola, hace callar VoiceOver."],
      };
    case "fn":
      return {
        kurz: "fn",
        name: "tecla Función",
        was: ["da una segunda tarea a otras teclas, por ejemplo subir y bajar el volumen."],
      };
    default:
      return null;
  }
}

/**
 * Wie die Taste in einer KOMBINATION und gross in der Mitte heisst - kurz,
 * wie man sie schreibt („Ctrl + Inicio", „Mayús + Tab").
 */
export const TASTE_KURZ_ES: Readonly<Record<string, string>> = {
  tabulator: "Tab",
  eingabe: "Intro",
  zeilenschalter: "Retorno",
  leertaste: "Barra espaciadora",
  loeschtaste: "Retroceso",
  entf: "Supr",
  esc: "Esc",
  umschalt: "Mayús",
  feststell: "Bloq Mayús",
  "pfeil-links": "Flecha izquierda",
  "pfeil-rechts": "Flecha derecha",
  "pfeil-auf": "Flecha arriba",
  "pfeil-ab": "Flecha abajo",
  pos1: "Inicio",
  ende: "Fin",
  "bild-auf": "Re Pág",
  "bild-ab": "Av Pág",
  einfg: "Insert",
  strg: "Ctrl",
  alt: "Alt",
  altgr: "Alt Gr",
  "windows-taste": "Win",
  befehlstaste: "cmd",
  wahltaste: "Opción",
  ctrl: "ctrl",
  fn: "fn",
};

/* ══ Tasten ausserhalb des Wörterbuchs ═════════════════════════════════════ */

const F_TASTEN_WINDOWS_ES: Readonly<Record<string, readonly string[]>> = {
  F1: ["abre la ayuda en muchos programas."],
  F2: ["cambia el nombre de un archivo seleccionado."],
  F3: ["inicia una búsqueda."],
  F4: ["cierra la ventana si pulsas Alt a la vez."],
  F5: ["vuelve a cargar una página web.", "Aquí no pasa nada, así puedes seguir explorando."],
  F6: ["va a la barra de direcciones del navegador."],
  F7: ["revisa la ortografía en Word."],
  F10: ["va a la barra de menús de muchos programas."],
  F11: ["activa y desactiva la pantalla completa en el navegador.", "En un portátil, a menudo junto con la tecla Fn."],
  F12: ["abre la ventana Guardar como en Word."],
};

/** Spanisch zu `nachKey` - F-Tasten, Bloq Num, Menü-Taste, Lautstärke, Totaste. */
export function nachKeyEs(
  key: string,
  plattform: Plattform,
  layout: LayoutId = "es",
): TastenErklaerung | null {
  const f = /^F([1-9]|1[0-9]|2[0-4])$/.exec(key);
  if (f) {
    const was =
      plattform === "macos"
        ? [
            "tiene su propia tarea en algunos programas.",
            "En un Mac, estas teclas suelen manejar el brillo y el volumen.",
          ]
        : (F_TASTEN_WINDOWS_ES[key] ?? ["tiene su propia tarea en algunos programas."]);
    return { kurz: key, name: "tecla de función", was };
  }
  switch (key) {
    case "Home":
      return sondertasteEs("pos1", "windows", layout);
    case "End":
      return sondertasteEs("ende", "windows", layout);
    case "PageUp":
      return sondertasteEs("bild-auf", "windows", layout);
    case "PageDown":
      return sondertasteEs("bild-ab", "windows", layout);
    case "Insert":
      return sondertasteEs("einfg", "windows", layout);
    case "NumLock":
      return {
        kurz: null,
        name: "tecla Bloq Num",
        was: ["activa y desactiva los números del teclado numérico."],
      };
    // ★ Testerin 24.10.2026: Numpad 5 bei Num aus (`Clear`) - Vorgabe, ungeprüft von Muttersprachlern.
    case "Clear":
      return {
        kurz: "5",
        name: "tecla 5 del teclado numérico",
        was: ["escribe 5 cuando Bloq Num está activado.", "Ahora Bloq Num está desactivado, por eso no hace nada."],
      };
    case "ContextMenu":
      return {
        kurz: null,
        name: "tecla Menú",
        was: ["abre un menú con órdenes para el sitio donde estás.", "Mayús + F10 hace lo mismo."],
      };
    case "PrintScreen":
      return { kurz: null, name: "tecla Impr Pant", was: ["hace una imagen de la pantalla.", "En Windows suele abrir una herramienta de captura.", "Esc la cierra."] };
    case "ScrollLock":
      return { kurz: null, name: "tecla Bloq Despl", was: ["hoy casi nunca sirve para nada."] };
    case "Pause":
      return { kurz: null, name: "tecla Pausa", was: ["hoy casi nunca sirve para nada."] };
    case "AudioVolumeUp":
      return { kurz: null, name: "tecla Subir volumen", was: ["sube el sonido."] };
    case "AudioVolumeDown":
      return { kurz: null, name: "tecla Bajar volumen", was: ["baja el sonido."] };
    case "AudioVolumeMute":
      return { kurz: null, name: "tecla Silencio", was: ["quita el sonido y lo vuelve a poner."] };
    case "Fn":
      return sondertasteEs("fn", plattform, layout);
    case "Dead":
      return {
        kurz: null,
        name: "tecla muerta",
        was: [
          "pone un signo sobre la letra siguiente, por ejemplo la tilde sobre la a.",
          "El signo solo aparece con la letra siguiente.",
        ],
      };
    default:
      return null;
  }
}

/* ══ Totasten mit Zusatzbezeichnung ═════════════════════════════════════════ */

const ERSCHEINT_SPAETER_ES = "El signo solo aparece con la letra siguiente.";

/** Die vier bekannten Akzente - nach derselben Kennung wie die deutsche Tabelle. */
export const AKZENTE_ES: Readonly<Record<"zirkumflex" | "akut" | "gravis" | "trema", { name: string; was: readonly string[] }>> = {
  zirkumflex: {
    name: "acento circunflejo",
    was: ["pone un pequeño sombrero sobre la letra siguiente, por ejemplo â.", ERSCHEINT_SPAETER_ES],
  },
  akut: {
    name: "tilde",
    was: ["pone la tilde sobre la letra siguiente, por ejemplo á o é.", ERSCHEINT_SPAETER_ES],
  },
  gravis: {
    name: "acento grave",
    was: ["pone una rayita que sube hacia la izquierda sobre la letra siguiente, por ejemplo à.", ERSCHEINT_SPAETER_ES],
  },
  trema: {
    name: "diéresis",
    was: ["pone dos puntos sobre la letra siguiente, por ejemplo ü en pingüino.", ERSCHEINT_SPAETER_ES],
  },
};

/* ══ Zeichen ════════════════════════════════════════════════════════════════ */

const PROGRAMMIEREN_ES = ["sirve para programar."] as const;

/**
 * Dieselben Zeichen wie `ZEICHEN` in `tastenErklaerung.ts`. Der Name kommt
 * aus `spokenLabel(ch, "es")`; `name` steht nur, wo er anders heissen soll.
 * Dazu die spanischen Zeichen ¿ ¡ ñ ç º ª (auf den Tastaturen Spaniens und
 * Lateinamerikas).
 */
export const ZEICHEN_ES: Readonly<Record<string, { name?: string; was: readonly string[] }>> = {
  ".": { was: ["va al final de una frase."] },
  ",": { was: ["separa partes de una frase."] },
  "?": { name: "signo de cierre de interrogación", was: ["cierra una pregunta."] },
  "¿": { name: "signo de apertura de interrogación", was: ["abre una pregunta - en español va al principio."] },
  "!": { name: "signo de cierre de exclamación", was: ["cierra una exclamación."] },
  "¡": { name: "signo de apertura de exclamación", was: ["abre una exclamación - en español va al principio."] },
  ":": { was: ["anuncia algo, por ejemplo una lista."] },
  ";": { was: ["separa dos partes de una frase, más que una coma."] },
  "-": { was: ["une palabras, por ejemplo en teórico-práctico."] },
  "@": { was: ["está en todas las direcciones de correo electrónico."] },
  "+": { was: ["significa más en una cuenta.", "En un atajo de teclado significa pulsar a la vez."] },
  "*": { was: ["significa por en informática, al multiplicar."] },
  "/": { was: ["significa entre en informática, al dividir.", "También está en las direcciones de internet."] },
  "=": { was: ["va antes del resultado de una cuenta."] },
  // ★ D1 Nr. 13 (28.09.2026): seit `'` eine Sprosse des Weges „es" ist, nennt
  // die Erklärung, wo es in den Texten vorkommt (Wörter aus Maya-Sprachen).
  "'": { was: ["se usa en palabras de lenguas mayas, como ma'alob (bien) o tz'utujil, y en programación."] },
  '"': { name: "comillas", was: ["van antes y después de lo que dice alguien."] },
  "«": { name: "comillas angulares de apertura", was: ["abren lo que dice alguien."] },
  "»": { name: "comillas angulares de cierre", was: ["cierran lo que dice alguien."] },
  "(": { name: "paréntesis de apertura", was: ["empieza algo que se añade."] },
  ")": { name: "paréntesis de cierre", was: ["termina lo que se ha añadido."] },
  "%": { name: "por ciento", was: ["significa de cada cien, por ejemplo 50 por ciento."] },
  "&": { name: "et", was: ["significa y."] },
  "#": {
    name: "numeral",
    was: [
      "indica un número, por ejemplo #1, y sirve para las etiquetas (hashtags) en las redes sociales.",
      "En España se llama almohadilla.",
    ],
  },
  "€": { name: "euro", was: ["es el símbolo del euro."] },
  $: { was: ["es el símbolo del dólar y del peso."] },
  "£": { was: ["es el símbolo de la libra esterlina."] },
  "§": { was: ["seguido de un número, indica un apartado de un texto, por ejemplo § 3.", "En español se usa poco."] },
  "°": { was: ["indica grados, por ejemplo de temperatura."] },
  "º": { name: "indicador ordinal masculino", was: ["se escribe detrás de un número, por ejemplo en 1.º, primero."] },
  "ª": { name: "indicador ordinal femenino", was: ["se escribe detrás de un número, por ejemplo en 1.ª, primera."] },
  "<": { name: "menor que", was: ["compara dos números: el de la izquierda es más pequeño."] },
  ">": { name: "mayor que", was: ["compara dos números: el de la izquierda es más grande."] },
  _: { name: "guion bajo", was: ["aparece a menudo en direcciones de correo y nombres de archivo."] },
  "^": { was: ["significa elevado a en una cuenta, por ejemplo 2 elevado a 3."] },
  "²": { name: "elevado al cuadrado", was: ["sirve para las superficies, por ejemplo los metros cuadrados."] },
  "³": { name: "elevado al cubo", was: ["sirve para los volúmenes, por ejemplo los metros cúbicos."] },
  "[": { was: PROGRAMMIEREN_ES },
  "]": { was: PROGRAMMIEREN_ES },
  "{": { was: PROGRAMMIEREN_ES },
  "}": { was: PROGRAMMIEREN_ES },
  "\\": { was: PROGRAMMIEREN_ES },
  "|": { was: PROGRAMMIEREN_ES },
  "~": { was: PROGRAMMIEREN_ES },
  "´": { name: "tilde", was: ["pone la tilde sobre una vocal."] },
  "`": { was: ["pone un acento grave sobre una letra."] },
  "¨": { name: "diéresis", was: ["pone dos puntos sobre una letra, por ejemplo en pingüino."] },
  ñ: { name: "eñe", was: ["es una letra propia del español, por ejemplo en niño."] },
  ç: { name: "ce cedilla", was: ["se usa en palabras de otras lenguas, por ejemplo del catalán o del francés."] },
};

/** Der spanische Name eines Zeichens - aus der Tabelle oder `spokenLabel`. */
export function zeichenNameEs(ch: string): string {
  return ZEICHEN_ES[ch]?.name ?? spokenLabel(ch, "es");
}

/* ══ Kombinationen ═════════════════════════════════════════════════════════ */

/** Wo eine Wirkung gilt - spanisch. */
export const ORT_ES: Readonly<Record<string, string>> = {
  explorer: "en el Explorador",
  finder: "en el Finder",
  word: "en Word",
  excel: "en Excel",
  browser: "en el navegador",
  teams: "en Teams",
  powerpoint: "en PowerPoint",
  outlook: "en Outlook",
  bedienungshilfen: "en el lector de pantalla",
};

/** Die kleine eigene Liste der deutschen Datei, spanisch. */
export const EIGENE_KOMBINATIONEN_ES: Readonly<Record<Plattform, readonly { keys: string; was: string }[]>> = {
  windows: [
    { keys: "Umschalt+Tab", was: "vuelve al elemento anterior." },
    { keys: "Strg+P", was: "abre la ventana de impresión." },
  ],
  macos: [
    { keys: "Umschalt+Tab", was: "vuelve al elemento anterior." },
    { keys: "Cmd+P", was: "abre la ventana de impresión." },
  ],
};

/**
 * Was ein Kürzel BEWIRKT - spanisch, nach der Kennung der Wirkung im
 * Kürzel-Katalog von »Im Griff« (`lib/computer/kuerzelWirkung.ts`, dort nur
 * gelesen). Fehlt eine Kennung, sagt die Zeile, dass es vom Programm abhängt.
 */
export function wirkungEs(id: string, _plattform: Plattform): string | null {
  return WIRKUNG_ES[id] ?? null;
}

const WIRKUNG_ES: Readonly<Record<string, string>> = {
  kopieren: "Copiar",
  einfuegen: "Pegar",
  ausschneiden: "Cortar",
  rueckgaengig: "Deshacer",
  wiederherstellen: "Rehacer lo que se deshizo",
  "alles-markieren": "Seleccionar todo",
  "markieren-zeichen": "Seleccionar carácter a carácter",
  "markieren-wort": "Seleccionar palabra a palabra",
  "spalte-markieren": "Seleccionar la columna entera",
  "zeile-markieren": "Seleccionar la fila entera",
  oeffnen: "Abrir",
  umbenennen: "Cambiar el nombre",
  "neuer-ordner": "Crear una carpeta nueva",
  papierkorb: "Mover a la papelera",
  duplizieren: "Hacer una segunda copia del mismo archivo",
  "ebene-hoeher": "Subir un nivel",
  adressleiste: "Ir a la barra de direcciones",
  eigenschaften: "Mostrar las propiedades",
  uebersicht: "Abrir la vista rápida, un vistazo sin abrir el archivo",
  bewegen: "Mover el archivo a donde debe ir (desaparece del sitio anterior)",
  "ansicht-details": "Cambiar a la vista \"Detalles\"",
  speichern: "Guardar",
  "speichern-unter": "Guardar como, con otro nombre u otro sitio",
  fett: "Poner en negrita",
  kursiv: "Poner en cursiva",
  unterstreichen: "Subrayar",
  ueberschrift1: "Aplicar el título 1",
  ueberschrift2: "Aplicar el título 2",
  "standard-format": "Aplicar el estilo \"Normal\"",
  links: "Alinear a la izquierda",
  zentriert: "Centrar",
  zeilenumbruch: "Salto de línea dentro del mismo párrafo",
  rechtschreibung: "Iniciar la revisión ortográfica",
  fensterbereiche: "Cambiar entre las partes de la ventana",
  suchen: "Buscar",
  ersetzen: "Buscar y reemplazar",
  "gehe-zu-zelle": "Ir a una celda concreta",
  "zelle-bearbeiten": "Seguir escribiendo en la celda",
  "zelle-formatieren": "Abrir la ventana \"Formato de celdas\"",
  "zum-rand": "Ir al borde de los datos",
  autosumme: "Insertar la autosuma",
  "ausfuellen-unten": "Rellenar hacia abajo",
  "ausfuellen-rechts": "Rellenar hacia la derecha",
  "absoluter-bezug": "Fijar una referencia (referencia absoluta con signos de dólar)",
  datum: "Insertar la fecha de hoy",
  uhrzeit: "Insertar la hora actual",
  kommentar: "Insertar un comentario",
  autofilter: "Activar y desactivar el filtro automático",
  blattwechsel: "Cambiar de hoja de cálculo",
  "neues-blatt": "Insertar una hoja de cálculo nueva",
  "neu-laden": "Volver a cargar la página",
  lesezeichen: "Añadir un marcador",
  verlauf: "Abrir el historial",
  senden: "Enviar el mensaje",
  "nachricht-loeschen": "Eliminar el mensaje",
  "sr-stopp": "Detener la voz",
};

/** „a, b y c" - die spanische Aufzählung. */
export function aufzaehlungEs(teile: readonly string[]): string {
  if (teile.length <= 1) return teile[0] ?? "";
  return `${teile.slice(0, -1).join(", ")} y ${teile[teile.length - 1]}`;
}

/** Die festen Wörter des Erkundens, spanisch. */
export const ERKUNDEN_WOERTER_ES = {
  kombination: "combinación de teclas",
  kombiUnbekannt: "lo que hace depende del programa.",
  mit: "Con",
  akzentTaste: "tecla de acento",
  unbekannt: "No reconozco esta tecla.",
  taste: (key: string) => `Tecla ${key}`,
} as const;

/* ══ „Tasten finden" ════════════════════════════════════════════════════════
 *
 * Die Sätze der Suchrunde (`lib/computer/tastenSuche.ts`) spanisch - WAS
 * geschieht, entscheidet weiter `suchSchritt`; hier wird nur gesagt.
 * ═══════════════════════════════════════════════════════════════════════════ */

interface TasteEs {
  /** Im Satz, mit Artikel: „Busca la tecla Tab." */
  nennung: string;
  /** Wo sie liegt - als Weg für eine Hand, nie als Bild. */
  lage: string;
  /** Zusatz nach der Bestätigung (heute nur die Feststelltaste). */
  achtung?: string;
}

const SECHSERBLOCK_ES = "En el bloque de seis teclas encima de las flechas";

/** Die Tasten der Suchrunde, spanisch - nach derselben Kennung wie das Wörterbuch. */
const TASTEN_ES: Readonly<Record<string, TasteEs | ((plattform: Plattform) => TasteEs)>> = {
  tabulator: {
    nennung: "la tecla Tab",
    lage: "Meñique izquierdo: una fila más arriba, en el borde.",
  },
  "pfeil-links": {
    nennung: "la flecha izquierda",
    lage: "Abajo a la derecha, junto a las flechas: la de la izquierda.",
  },
  "pfeil-rechts": {
    nennung: "la flecha derecha",
    lage: "Abajo a la derecha, junto a las flechas: la de la derecha.",
  },
  "pfeil-auf": {
    nennung: "la flecha arriba",
    lage: "Abajo a la derecha, junto a las flechas: la de arriba.",
  },
  "pfeil-ab": {
    nennung: "la flecha abajo",
    lage: "Abajo a la derecha, junto a las flechas: debajo de la flecha arriba.",
  },
  pos1: {
    nennung: "la tecla Inicio",
    lage: `${SECHSERBLOCK_ES}, arriba en el centro. En un portátil, a menudo con fn.`,
  },
  ende: {
    nennung: "la tecla Fin",
    lage: `${SECHSERBLOCK_ES}, abajo en el centro. En un portátil, a menudo con fn.`,
  },
  "bild-auf": {
    nennung: "la tecla Re Pág",
    lage: `${SECHSERBLOCK_ES}, arriba a la derecha. En un portátil, a menudo con fn.`,
  },
  "bild-ab": {
    nennung: "la tecla Av Pág",
    lage: `${SECHSERBLOCK_ES}, abajo a la derecha. En un portátil, a menudo con fn.`,
  },
  leertaste: {
    nennung: "la barra espaciadora",
    lage: "La tecla larga bajo tus pulgares.",
  },
  eingabe: {
    nennung: "la tecla Intro",
    lage: "Mano derecha, en el borde: la tecla grande.",
  },
  zeilenschalter: {
    nennung: "la tecla Retorno",
    lage: "Mano derecha, en el borde: la tecla grande.",
  },
  loeschtaste: {
    nennung: "la tecla Retroceso",
    lage: "Mano derecha, en el borde, dos filas más arriba.",
  },
  entf: (plattform) =>
    plattform === "macos"
      ? {
          nennung: "la tecla Suprimir",
          lage: "Solo en los teclados grandes, junto a Retorno. Si no, fn y Retroceso.",
        }
      : {
          nennung: "la tecla Supr",
          lage: `${SECHSERBLOCK_ES}, abajo a la izquierda. En un portátil, arriba a la derecha.`,
        },
  esc: {
    nennung: "la tecla Esc",
    lage: "En la esquina de arriba a la izquierda.",
  },
  umschalt: {
    nennung: "la tecla Mayús",
    lage: "Hay dos: a la izquierda y a la derecha, en la última fila de letras.",
  },
  feststell: {
    nennung: "la tecla Bloq Mayús",
    lage: "Meñique izquierdo: un paso a la izquierda.",
    achtung: "¿Ahora escribes en mayúsculas? Púlsala otra vez.",
  },
  strg: {
    nennung: "la tecla Ctrl",
    lage: "En la esquina de abajo a la izquierda.",
  },
  alt: { nennung: "la tecla Alt", lage: "Abajo, a la izquierda de la barra espaciadora." },
  altgr: {
    nennung: "la tecla Alt Gr",
    lage: "Abajo, a la derecha de la barra espaciadora.",
  },
  "windows-taste": {
    nennung: "la tecla Windows",
    lage: "Abajo a la izquierda, entre Ctrl y Alt.",
  },
  einfg: {
    nennung: "la tecla Insert",
    lage: `${SECHSERBLOCK_ES}, arriba a la izquierda, encima de Supr. En los portátiles a menudo no está.`,
  },
  befehlstaste: {
    nennung: "la tecla Comando",
    lage: "Abajo a la izquierda, justo al lado de la barra espaciadora.",
  },
  wahltaste: {
    nennung: "la tecla Opción",
    lage: "Abajo a la izquierda, la tercera tecla desde el borde.",
  },
  ctrl: {
    nennung: "la tecla Control",
    lage: "Abajo a la izquierda, la segunda tecla desde el borde.",
  },
  fn: {
    nennung: "la tecla fn",
    lage: "Abajo a la izquierda, la primera tecla, en la esquina. En un MacBook lleva escrito \"fn\".",
  },
};

function tasteEs(t: TastenName, plattform: Plattform): TasteEs {
  const e = TASTEN_ES[t.id];
  if (typeof e === "function") return e(plattform);
  // Sicherheitsnetz: eine neue Wörterbuch-Taste ohne spanischen Eintrag.
  return e ?? { nennung: t.kurz ?? t.name, lage: "" };
}

/** „la tecla Tab" - wie eine Taste im Satz heisst. */
export function tastenNennungEs(t: TastenName, plattform: Plattform): string {
  return tasteEs(t, plattform).nennung;
}

/** Nur die Lage - oder "" (wie bei den anderen Sprachen). */
export function tastenLageEs(t: TastenName, plattform: Plattform): string {
  return tasteEs(t, plattform).lage;
}

/** Der Auftrag beim Suchen: „Busca la tecla Tab. Meñique izquierdo …" */
export function ansageSuchauftragEs(t: TastenName, plattform: Plattform): string {
  const e = tasteEs(t, plattform);
  return e.lage ? `Busca ${e.nennung}. ${e.lage}` : `Busca ${e.nennung}.`;
}

/** Erster Treffer - erst die Wiederholung zählt. */
export function ansageGefundenEs(t: TastenName, plattform: Plattform): string {
  return `¡Encontrada! Pulsa otra tecla, luego otra vez ${tastenNennungEs(t, plattform)}.`;
}

/** Nach der Bestätigung - und, wo nötig, die Warnung (Feststelltaste). */
export function ansageBestaetigtEs(t: TastenName, plattform: Plattform): string {
  const e = tasteEs(t, plattform);
  return e.achtung ? `¡Esa es! ${e.achtung}` : "¡Esa es!";
}

/** Eine Taste, die hier nicht unterrichtet wird. */
export const ANSAGE_UNBEKANNT_ES = "Esa no es una tecla que se aprenda aquí.";

/**
 * Der Satz zu einem Schritt der Suchrunde - spanisch. `art` und `naechste`
 * kommen unverändert aus `suchSchritt`; nur die Wörter sind neu.
 */
export function suchSatzEs(
  art: "daneben" | "gefunden" | "weiter" | "fertig",
  taste: TastenName | null,
  suchbar: readonly TastenName[],
  index: number,
  plattform: Plattform,
): string {
  const gesucht = suchbar[index]!;
  switch (art) {
    case "daneben": {
      const g = tasteEs(gesucht, plattform);
      if (!taste) return `${ANSAGE_UNBEKANNT_ES} Busca ${g.nennung}.`;
      return `Esa es ${tastenNennungEs(taste, plattform)}. Busca ${g.nennung}.${g.lage ? ` ${g.lage}` : ""}`;
    }
    case "gefunden":
      return ansageGefundenEs(gesucht, plattform);
    case "fertig":
      return `${ansageBestaetigtEs(gesucht, plattform)} Has encontrado las ${suchbar.length} teclas. ¡Muy bien!`;
    case "weiter":
      return `${ansageBestaetigtEs(gesucht, plattform)} ${ansageSuchauftragEs(suchbar[index + 1]!, plattform)}`;
  }
}
