/**
 * Korpus nur für Lernweg "es", frühe Sprossen 7-18 - Altersstufe Teens,
 * Jugendliche 12-16 (ES-T2, 27.09.2026, Bauplan
 * `BAUPLAN-2026-09-27-SPANISCHER-LEHRGANG.md` §4.3/§5/§9,
 * `BAUPLAN-2026-09-26-NEUE-SPRACHE-EFFIZIENT.md` §0 Punkt 6 und P5).
 *
 * Johannes' Regeln, wörtlich: „keine texte werden übersetzt, Texte aus den
 * regionen, altersgemäß und zeitgemäß" und „die texte sollen einen bezug zum
 * land und sprache haben". ALLES NEU AUF SPANISCH VERFASST - keine Text-Datei
 * einer anderen Sprache geöffnet, nichts übersetzt, kein Satz aus einer
 * Satzsammlung (darum kein `herkunft`). Keine Zeile der Kinder-Charge
 * (`corpusEsWegFruehKids.ts`) ist kopiert oder nur abgewandelt - der Wächter
 * prüft Text, Ledger-Schlüssel und Paare auch gegen sie.
 *
 * ALTERSGEMÄSS 12-16: die Welt von Jugendlichen, so weit die Buchstaben es
 * hergeben - Schule (liceo, instituto, secundaria), Freundschaft, Sport,
 * Musik, Technik (Netz, Passwort, Memes, Nachrichten - ohne Moralkeule),
 * Stadt, Natur und Klima, Humor.
 *
 * ZEICHENSATZ wie ES-T1 (Fassung A, `lernweg.ts` `ES_LETTER_ORDER`; auf ES
 * und LatAm gleich, der Wächter misst beides): Sprosse 7 (+a) f j d k s l a ·
 * 8 (+ñ) · 9 (+e) · 10 (+o) · 11 (+n) · 12 (+t) · 13 (+u) · 14 (+r) · 15 (+c) ·
 * 16 (+i) · 17 (+m) · 18 (+´, á é í ó ú; danach kommt Mayús). Vor Sprosse 18
 * gibt es kein p q b g h v y z - darum fehlen „que", „por", „para", „y", „muy",
 * „fútbol", „amigo", „escuchar"; die Zeilen finden andere Wege.
 * `minTier` ist 0 bis Sprosse 8, 1 für 9-17, 2 für 18 - gerechnet von
 * `minTierFor(text, "es")`, nicht von Hand.
 *
 * VOR MAYÚS: jede Zeile klein, keine Satzzeichen, keine Namen. JEDE ZEILE ist
 * ENTWEDER eine Reihe echter Wörter ODER ein grammatisch richtiger kleiner
 * Satz (Leitfaden Falle 26) - nie Wortsalat. An Sprosse 7 und 8 (nur der Vokal
 * „a") stehen darum nur wenige Zeilen (Befund
 * `BEFUND-2026-09-27-ES-T2-TEENS-FRUEH.md` §2).
 *
 * BEZUG ZU LAND UND SPRACHE: die Sprache selbst als Thema (seseo, ceceo,
 * tuteo, Akzente der Regionen, tú mit und tu ohne Tilde, die Buchstaben der
 * spanischen Grundreihe mit eñe, liceo/instituto/secundaria), Musik, Essen
 * und Natur aus allen Ländern, Wörter aus indigenen Sprachen.
 * Variantenneutral: kein vosotros, kein coger, keine Wörter der Sperrliste
 * (`scripts/messe-worthaeufigkeit-es.py`), RAE 2010.
 *
 * Wächter: `tests/tastenflow-texte-es-teens-frueh.test.ts`. Nur anhängen -
 * Korpus-Anker im selben Commit (`npx tsx scripts/erzeuge-korpus-anker.mts`).
 */

import type { CorpusItem } from "./corpus";

export const CORPUS_ES_WEG_FRUEH_TEENS: CorpusItem[] = [
  // ── Sprosse 7 (+a) - nur f j d k s l a: Lachen im Chat, kurze Wortgruppen ─────
  { text: "jajaja", kind: "satz", stufen: ["teens"], minTier: 0, nurWeg: "es" },
  { text: "la falla", kind: "satz", stufen: ["teens"], minTier: 0, nurWeg: "es" },
  { text: "salsa salada", kind: "satz", stufen: ["teens"], minTier: 0, nurWeg: "es" },
  { text: "las salas", kind: "satz", stufen: ["teens"], minTier: 0, nurWeg: "es" },
  // ── Sprosse 8 (+ñ) - mit dem einzigen Vokal „a" nur dañada und lasaña ─────────
  { text: "la sala dañada", kind: "satz", stufen: ["teens"], minTier: 0, nurWeg: "es" },
  { text: "sal salsa lasaña", kind: "satz", stufen: ["teens"], minTier: 0, nurWeg: "es" },
  // ── Sprosse 9 (+e) - la jefa, el seseo als Thema ──────────────────────────────
  { text: "ella es la jefa", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "la salsa le da sed", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "ella sesea", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "el jefe de sala", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "ella les deja la sala", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "la señal falla", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  // ── Sprosse 10 (+o) - a solas, de lado a lado, dados ──────────────────────────
  { text: "leo a solas", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "de lado a lado", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "dos dados", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "se lo deseo", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "la ola se aleja", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "el solo de ella", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  // ── Sprosse 11 (+n) - fan de la salsa, al fondo de la sala ────────────────────
  { text: "ella es fan de la salsa", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "no lo dejes solo", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "nada de nada", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "al fondo de la sala", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "ellas nadan en las olas", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "donde sea", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  // ── Sprosse 12 (+t) - la tele, las fotos, die Grundreihe mit eñe ──────────────
  { text: "todos desentonan", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "las fotos del festejo", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "tanto talento", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "efe jota de ka ese ele a eñe", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "los lentes de sol", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "la tele de fondo", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "ojo al dato", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "el oso de anteojos", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  // ── Sprosse 13 (+u) - el tuteo, un duelo de talentos ──────────────────────────
  { text: "todos se tutean", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "no te asustes", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "saludos a todos", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "no lo dudes", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "suena tu tono", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "un duelo de talentos", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "nos une la salsa", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  // ── Sprosse 14 (+r) - torneo, turno, tarjeta roja, estreno, la red ────────────
  { text: "suerte en el torneo", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "es tu turno", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "otra ronda de dardos", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "la tarjeta roja", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "entre todos ordenan el aula", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "el estreno es a las tres", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "te lo juro", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "un error de la red", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "ella surfea en las olas del sur", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "ella entrena duro", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "el tren del terror", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "solo un rato", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "la letra es de ella", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "el trofeo es nuestro", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "fue tres a dos", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "la ruta del salar", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "la frase del año", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  // ── Sprosse 15 (+c) - acentos, cante jondo, el cuatro, la contraseña ──────────
  { text: "cada acento cuenta", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "ceceo o seseo", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "otra ola de calor", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "el cante jondo", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "ella toca el cuatro", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "con tres acordes", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "en la cuerda floja", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "no cuesta nada", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "desconectados un rato", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "tu contraseña es secreta", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "la carrera de fondo", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "entra tarde a clase", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "el ocelote se esconde", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "el concurso de talentos", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "se cae la red", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "trucos de cartas", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "un corto de terror", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "todos de acuerdo", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  // ── Sprosse 16 (+i) - liceo o instituto, el final de la serie, desierto florido ───
  { text: "liceo o instituto", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "el final de la serie", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "la radio del liceo", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "el diccionario lo dice", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "cree en ti", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "a un clic de distancia", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "una tarde sin internet", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "la ciclista no se rinde", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "el desierto florido", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "frijoles refritos", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "la ciudad en silencio", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "incendios forestales", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "cuida tus datos", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "sardinas asadas", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "un selfi en la cordillera", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "solo sin tilde", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "una idea loca", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "noticias falsas en la red", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "fotos sin filtros", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  // ── Sprosse 17 (+m) - memes, mensajes, el mundial femenino, mate y salmorejo ───
  { text: "nos mandamos memes", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "mensajes sin leer", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "sin miedo al error", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "canta la letra de memoria", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "te animamos desde la meta", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "la nadadora suma otra medalla", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "el mundial femenino", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "los flamencos del salar", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "un mate en la costanera", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "un salmorejo casero", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "mandioca frita", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "camote asado", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "milanesa con ensalada", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "me da lo mismo", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "en el metro con auriculares", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "los murales del centro", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "calentamos antes de entrenar", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "oda al tomate", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "sin mirar las teclas", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "sin saldo a fin de mes", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "la marinera norteña", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "dos idiomas en casa", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  { text: "la mitad del aula duerme", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "es" },
  // ── Sprosse 18 (+´) - tú con tilde, la canción de moda, en línea, cámara lenta ───
  { text: "tú con tilde tu sin tilde", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "es" },
  { text: "atención a las tildes", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "es" },
  { text: "la canción de moda", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "es" },
  { text: "el micrófono no funciona", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "es" },
  { text: "la última canción", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "es" },
  { text: "un cómic de ciencia ficción", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "es" },
  { text: "memes de matemáticas", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "es" },
  { text: "un coatí curioso", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "es" },
  { text: "el delfín rosado del río", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "es" },
  { text: "a las cinco en la estación", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "es" },
  { text: "el semáforo en rojo", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "es" },
  { text: "un récord mundial", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "es" },
  { text: "una maratón de series", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "es" },
  { text: "no está mal", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "es" },
  { text: "ojalá termine la clase", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "es" },
  { text: "una canción en aimara", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "es" },
  { text: "cada miércoles entrenamos", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "es" },
  { text: "tú decides", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "es" },
  { text: "en cámara lenta", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "es" },
  { text: "los ríos se secan", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "es" },
  { text: "ella está en línea", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "es" },
  { text: "el último mensaje", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "es" },
  { text: "es tu decisión", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "es" },
  { text: "sandía fresca", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "es" },
  { text: "risas en la fila de atrás", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "es" },
  { text: "el menú del día", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "es" },
  { text: "música en directo", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "es" },
  { text: "un acordeón norteño", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "es" },
  { text: "detrás de cámaras", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "es" },
  { text: "la sesión de fotos", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "es" },
];
