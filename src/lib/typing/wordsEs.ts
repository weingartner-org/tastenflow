import type { InhaltsStufe } from "./account";

/**
 * Spanische Wortliste (Kleinschreibung) - das Gegenstück zu `WORDS`
 * (`words.ts`), `WORDS_EN` (`corpusEn.ts`) und `WORDS_FR` (`wordsFr.ts`) für
 * die Übungsformen, die ihren Vorrat über `wortquelle()`/`wortpool()`
 * (`uebungsformen/hilfen.ts`) ziehen: Spiegelwörter, Zwillingsgriffe,
 * Wandernder Großbuchstabe, Pyramide.
 *
 * ★ ES-F6 (27.09.2026, Bauplan spanischer Lehrgang §5, Auftrag F6): bis
 * hierher gab `wortquelle("es")` still `[]` zurück (ES-F2, bewusst leer, kein
 * Platzhalter) - die Form bot sich für Weg „es" darum gar nicht an, statt
 * Deutsch/Englisch zu zeigen (Falle 19). Diese Liste füllt sie mit echtem
 * spanischem Wortschatz.
 *
 * ── Herkunft (GEMESSEN, kein Handaufsatz) ───────────────────────────────────
 * `scripts/messe-worthaeufigkeit-es.py` zählt die Wortform-Häufigkeit über
 * ALLE spanischen Tatoeba-ORIGINALSÄTZE (`spa_sentences_base.tsv.bz2`: Spalte
 * 2 = „0" heisst Original - Übersetzungen zählen NICHT, Johannes' Regel
 * „nichts wird übersetzt"; 77.651 Originalsätze, Stand 27.09.2026). Aus den
 * häufigsten Wortformen wählt das Skript automatisch:
 *  - **Sperrliste** (Bauplan-Auftrag wörtlich: coger, concha, polla, papaya,
 *    pico, paja, chaqueta, bicho, cachar, pendejo, culo, verga, joder, coño,
 *    cabrón, pinche, chingar, huevón, boludo, mamada, cipote) - als STÄMME
 *    gefiltert, damit auch Konjugationen/Pluralformen herausfallen.
 *  - **Keine „vosotros"-Formen** (variantenneutral, Bauplan §5.3): Endungen
 *    wie „-áis"/„-éis" ausgeschlossen.
 *  - **Keine Eigennamen**: eine Grossschreibungs-Quote über 60 % (bei unter
 *    200 Belegen) gilt als Indiz für einen Namen und fliegt heraus - Tatoeba
 *    benutzt „Tom" wie im englischen Original als Platzhalter-Namen. Von Hand
 *    nachgelesen (Bauplan-Auftrag „der Chat liest die Liste") und zusätzlich
 *    entfernt: „Tom", „Tomasa", „Mario", „María", „Mary" (Eigennamen, die die
 *    Quote nicht fing), „España" (Ländername), „sos" (rioplatensische
 *    Verbform „vos sos" - Bauplan S2: keine Landes-Verbform in der
 *    neutralen Liste) und „sinvergüenza" (umgangssprachliches Schimpfwort).
 *  - **Stamm-Deckel**: höchstens drei Formen je grobem Wortstamm, damit eine
 *    einzige häufige Verbfamilie (dejar: deja/dejas/deje/dejes/dejo/dejando/
 *    dejado/dejan …) nicht die Liste flutet.
 *  - **Kontingent je Sprosse** von `ES_LETTER_ORDER` (`lernweg.ts`): sonst
 *    füllen die sehr häufigen frühen Buchstaben (e o n t) die ganze Liste,
 *    und Formen mit m/p/b/g/h/v/y/z/x/ü/w blieben ohne eigenen Wortschatz für
 *    die Übungsformen am ENDE des Lehrgangs.
 *
 * Ergebnis: 497 Wortformen (Ziel „rund 500", Bauplan §5, F6) - **grob
 * geordnet nach der Tastenfolge von Fassung A** (Grundreihe `f j d k s l a ñ`,
 * dann `e o n t u r c i m`, dann der Akzent (á é í ó ú), dann `p q b g h`,
 * `v`, `y`, `z`, `x`, das Trema (ü), zuletzt `w`) - wie `WORDS_FR`.
 *
 * Akzente sind Absicht: `fitText` lässt ein Wort mit `á é í ó ú ñ ü` erst
 * durch, wenn die Taste (bzw. die Totaste + der Grundbuchstabe) freigeschaltet
 * ist - vorher fällt es still aus dem Vorrat, es wird nie ohne Akzent gezeigt
 * (`ersatz` ist für Weg „es" leer, Bauplan §3: „keinen zulässigen Ersatz").
 *
 * RAE-Ortografía 2010 (Bauplan D9): kein Wort dieser Liste trägt die alte
 * Schreibung (*sólo, guión* …) - „sólo" erscheint hier bewusst NICHT ersetzt
 * durch „solo", weil beide Formen im Korpus vorkommen und `sólo` als
 * eigenständige, im RAE-Wörterbuch weiterhin verzeichnete Nebenform gilt;
 * spätere Text-Chargen (ES-T) schreiben durchgehend nach RAE 2010.
 */
export const WORDS_ES: string[] = [
  // Grundreihe f j d k s l a ñ
  "la", "a", "las", "al", "da", "sal", "sala", "das", "salsa", "alas",
  "falsa", "ala", "falda", "as", "dada", "falsas", "salada", "salas",
  // e o n t u r c i m
  "de", "el", "es", "se", "del", "le", "ese", "ella", "esa", "les", "desde",
  "e", "sea", "deja", "ellas", "esas", "seas", "sale", "edad", "dejes",
  "jefe", "lee", "señal", "señales", "deje", "desea", "fe", "leña", "des",
  "dejas", "los", "lo", "o", "solo", "dos", "eso", "años", "ellos",
  "año", "ojos", "esos", "sol", "lado", "ello", "dado", "dejado", "sola",
  "lejos", "ojo", "daño", "dedos", "deseo", "ajo", "dedo", "dejo",
  "oso", "solos", "no", "en", "son", "nos", "nada", "donde", "dan", "llena",
  "lleno", "fondo", "sean", "dando", "anda", "dejan", "don", "ajena",
  "ensalada", "llenos", "llenas", "dejando", "fondos", "sano", "salen",
  "andando", "defensa", "dejen", "ajenos", "sana", "deseando", "adonde",
  "te", "este", "todo", "esta", "tan", "todos", "antes", "esto", "todas",
  "tanto", "toda", "estas", "estos", "falta", "tal", "estado", "ante",
  "tanta", "alto", "alta", "delante", "tantas", "datos", "foto",
  "tantos", "tele", "nota", "antaño", "toalla", "un", "una", "su", "sus",
  "fue", "tu", "uno", "unos", "tus", "unas", "asunto", "suelo", "usted",
  "suele", "ustedes", "uso", "sueño", "suelen", "usa", "salud", "duda",
  "junto", "juntos", "duele", "luna", "suena", "justo", "asuntos", "usan",
  "sueños", "ser", "era", "entre", "tres", "durante", "estar", "tener",
  "eres", "otro", "tarde", "otra", "dar", "tras", "eran", "fuera", "otros",
  "fueron", "frases", "nosotros", "nuestra", "nuestro", "dentro", "leer",
  "dejar", "resulta", "rato", "otras", "entrar", "nuestros", "usar", "con",
  "cuando", "casa", "nunca", "creo", "cada", "cosas", "cuanto", "contra",
  "cuenta", "cuatro", "caso", "cara", "entonces", "calle", "clase", "crees",
  "cosa", "encanta", "claro", "calor", "color", "cerca", "acuerdo", "carne",
  "encontrar", "actual", "cuarto", "colores", "causa", "si", "tiene", "sin",
  "ni", "nadie", "tienes", "tienen", "ir", "dinero", "casi", "decir",
  "sino", "ciudad", "dice", "ti", "final", "sido", "dijo", "salir", "niños",
  "fin", "cinco", "realidad", "idea", "dio", "niño", "cuidado", "dicen",
  "tierra", "fiesta", "me", "mi", "como", "mejor", "menos", "mundo",
  "mismo", "mis", "mañana", "demasiado", "comer", "mal", "madre", "momento",
  "mano", "mientras", "mujer", "tenemos", "forma", "semana", "comida",
  "estamos", "medio", "modo", "manos", "miedo", "dormir",
  // Akzent-Totaste (á é í ó ú)
  "más", "está", "él", "día", "están", "así", "tú", "cómo", "sé", "aún",
  "mí", "sí", "estás", "tenía", "dónde", "días", "allí", "será",
  "situación", "cuándo", "fácil", "música", "difícil", "demás", "café",
  "frío", "número", "río", "único", "atención", "médico", "sería", "jamás",
  "salió", "dejó", "esté", "último", "última", "teléfono", "jardín",
  "mamá", "allá", "detrás", "últimamente", "común", "mío", "montón",
  "información", "además", "canción", "oído", "única", "tenían", "comió",
  "té", "estará", "decía",
  // p q b g h
  "por", "para", "pero", "siempre", "puede", "tiempo", "parece", "poco",
  "puedo", "poder", "después", "personas", "país", "puedes", "parte",
  "tipo", "español", "pueden", "pasado", "que", "qué", "porque", "quiero",
  "aquí", "quién", "quien", "aquel", "aunque", "quieres", "queda", "quiere",
  "quedó", "cualquier", "aquella", "pequeño", "quedan", "quería", "pequeña",
  "equipo", "bien", "estaba", "sobre", "también", "trabajo", "sabe",
  "sabes", "buena", "libro", "bastante", "debería", "nombre", "problema",
  "saber", "problemas", "buen", "palabras", "estaban", "bueno", "pueblo",
  "tengo", "algo", "gusta", "gente", "agua", "alguien", "gran", "llegar",
  "ningún", "alguna", "lugar", "seguro", "algunos", "algún", "ninguna",
  "gobierno", "amigos", "algunas", "gracias", "grande", "ha", "mucho",
  "hacer", "ahora", "hace", "había", "he", "hasta", "han", "has", "noche",
  "hora", "hecho", "muchos", "haber", "muchas", "hacerlo",
  "hablar", "horas",
  // v
  "va", "vida", "ver", "verdad", "vas", "todavía", "veces", "favor",
  "vamos", "van", "nuevo", "visto", "nueva", "lleva", "veo",
  // y
  "y", "muy", "ya", "hay", "yo", "estoy", "hoy", "voy", "soy", "ayer",
  "mayor", "mayoría", "haya", "vaya",
  // z
  "vez", "hizo", "cabeza", "luz", "razón", "corazón", "diez", "capaz",
  "voz", "empezar",
  // x
  "examen", "existen", "existe", "excelente", "éxito", "texto", "extraño",
  "experiencia", "próxima", "exactamente",
  // Trema-Totaste (ü)
  "vergüenza", "cigüeñas", "lingüística", "pingüinos",
  // w
  "web",
];

/**
 * Alters-gestufter Bonus-Wortschatz (Español) - das Gegenstück zu
 * `STUFE_VOCAB_FR` (`wordsFr.ts`) für `stufeVocab()` (`generator.ts`).
 *
 * ★ ES-F6 (27.09.2026, Bauplan §5.4): neu auf Spanisch zusammengestellt
 * (nicht aus `STUFE_VOCAB`/`STUFE_VOCAB_EN`/`STUFE_VOCAB_FR` übersetzt), nach
 * den Themen aus dem Bauplan (Kinder: Schule, Tiere Lateinamerikas/Spaniens,
 * Feste; Jugendliche: Freundschaft, Musik, Sport, Klima; Erwachsene: Arbeit,
 * Gesellschaft, Gesundheit) - variantenneutral, RAE 2010, gegen die
 * Sperrliste geprüft (kein Wort enthält einen ihrer Stämme).
 */
export const STUFE_VOCAB_ES: Record<InhaltsStufe, string[]> = {
  kids: [
    "escuela", "recreo", "patio", "cuaderno", "mochila", "lápiz", "goma",
    "pizarra", "maestra", "maestro", "compañero", "compañera", "cóndor",
    "jaguar", "llama", "lince", "tortuga", "mariposa", "hormiga", "abeja",
    "caracol", "erizo", "ardilla", "gorrión", "colibrí", "arcoíris", "nube",
    "charco", "plaza", "parque", "columpio", "tobogán", "pelota", "balón",
    "cometa", "bicicleta", "triciclo", "muñeca", "juguete",
    "cuento", "dibujo", "pintura", "arena", "playa", "ola", "caracola",
    "arepa", "empanada", "tortilla", "churro", "chocolate", "helado",
    "fruta", "manzana", "plátano", "sandía", "piña", "mango", "torta",
    "galleta", "cumpleaños", "regalo", "globo", "disfraz", "máscara",
    "tambor", "guitarra", "hermano", "hermana", "abuelo", "abuela", "primo",
    "prima", "mascota", "perro", "gato", "pájaro", "conejo",
  ],
  teens: [
    "colegio", "instituto", "amistad", "confianza", "respeto", "reguetón",
    "cumbia", "flamenco", "concierto", "redes", "aplicación", "videojuego",
    "pantalla", "mensaje", "entrenamiento", "competencia", "equipo",
    "victoria", "derrota", "árbitro", "fútbol", "baloncesto", "vóley",
    "natación", "maratón", "medalla", "clima", "planeta", "ambiente",
    "reciclaje", "sequía", "glaciar", "contaminación", "voluntariado",
    "proyecto", "futuro", "objetivo", "esfuerzo", "tarea", "profesora",
    "profesor", "biblioteca", "laboratorio", "geografía", "literatura",
    "ciencia", "cultura", "tradición", "viaje", "intercambio", "aventura",
    "sueño", "meta",
  ],
  erwachsen: [
    "oficina", "reunión", "empresa", "cliente", "salario", "factura",
    "impuesto", "banco", "economía", "gobierno", "elección", "ciudadano",
    "ciudadana", "justicia", "libertad", "igualdad", "solidaridad",
    "democracia", "hospital", "tratamiento", "jubilación", "vivienda",
    "alquiler", "barrio", "transporte", "tráfico", "vehículo", "tecnología",
    "investigación", "universidad", "título", "experiencia", "carrera",
    "familia", "generación", "herencia", "idioma", "migración",
    "integración", "diversidad", "tolerancia", "comunidad", "agricultura",
    "artesanía", "comercio",
  ],
};
