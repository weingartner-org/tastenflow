/**
 * Korpus nur für Lernweg "es", frühe Sprossen 7-18 - Altersstufe Kids (ES-T1,
 * 27.09.2026, Bauplan `BAUPLAN-2026-09-27-SPANISCHER-LEHRGANG.md` §4.3/§5/§9,
 * `BAUPLAN-2026-09-26-NEUE-SPRACHE-EFFIZIENT.md` §0 Punkt 6 und P5).
 *
 * Johannes' Regeln, wörtlich: „keine texte werden übersetzt, Texte aus den
 * regionen, altersgemäß und zeitgemäß" und „die texte sollen einen bezug zum
 * land und sprache haben". ALLES NEU AUF SPANISCH VERFASST - keine Text-Datei
 * einer anderen Sprache geöffnet, nichts übersetzt, kein Tatoeba-Satz (darum
 * auch kein `herkunft`). Tatoeba diente nur als WORTLISTE (Häufigkeit der
 * Originalsätze, welche Wörter an welcher Sprosse schreibbar sind).
 *
 * ZEICHENSATZ (Fassung A, `lernweg.ts` `ES_LETTER_ORDER`; „Sprosse" = Anzahl
 * gelernter Einheiten von `introOrder("es")` - vor Mayús ist das dasselbe wie
 * die Zahl der Buchstaben; auf ES und LatAm GLEICH, der Wächter misst beides):
 *   Sprosse  7 (+a):  f j d k s l a           - erste echte Wörter (la, sal, sala)
 *   Sprosse  8 (+ñ):  … + ñ                   - nur lasaña, daña (siehe unten)
 *   Sprosse  9 (+e):  … + e
 *   Sprosse 10 (+o):  … + o
 *   Sprosse 11 (+n):  … + n
 *   Sprosse 12 (+t):  … + t
 *   Sprosse 13 (+u):  … + u
 *   Sprosse 14 (+r):  … + r
 *   Sprosse 15 (+c):  … + c
 *   Sprosse 16 (+i):  … + i
 *   Sprosse 17 (+m):  … + m                   (T1 komplett - `minTier: 1`)
 *   Sprosse 18 (+´):  … + á é í ó ú           (`minTier: 2`; danach kommt Mayús)
 * `minTier` ist 0 bis Sprosse 8 (Grundreihe = T0), 1 für 9-17, 2 für 18 -
 * gerechnet von `minTierFor(text, "es")`, nicht von Hand.
 *
 * VOR MAYÚS GIBT ES KEINE GROSSBUCHSTABEN: jede Zeile ist klein geschrieben,
 * darum auch keine Namen (Länder, Städte, Feste mit Grossbuchstaben kommen
 * erst in den Chargen nach Mayús). Satzzeichen gibt es in diesem Bereich noch
 * keine (`ES_PUNCT_ORDER` liegt hinter dem ganzen Alphabet) - keine Zeile
 * trägt eines, auch keine Frage (¿? sind ein hartes Paar und kommen später).
 *
 * JEDE ZEILE ist ENTWEDER eine kleine Wortgruppe aus echten Wörtern ODER ein
 * grammatisch richtiger, sinnvoller kleiner Satz (Leitfaden Falle 26) - nie
 * Wortsalat. Lieber wenige saubere Zeilen: an Sprosse 7 und 8 gibt es nur den
 * Vokal „a" (und an 8 die ñ nur in „lasaña" und „daña"), dort stehen darum
 * wenige Zeilen (Befund `BEFUND-2026-09-27-ES-T1-KIDS-FRUEH.md` §2).
 *
 * BEZUG ZU LAND UND SPRACHE, soweit die Buchstaben es erlauben: die eñe und
 * die Tilde als Zeichen der Sprache, die erre, Wörter aus dem Náhuatl (atole,
 * elote, ajolote, cenote aus dem Maya, tamal, mole), aus dem Quechua (llama,
 * cóndor), Guaraní (ñandú, tucán), Taíno (canoa, caimán, maní, ají, manatí),
 * aus dem Arabischen (alfalfa, ojalá), Essen (alfajor, tostada, tortilla,
 * mate, turrón de maní), Musik (salsa, cueca, maracas, cajón). Variantenneutral:
 * kein vosotros, kein coger, keine Wörter aus der Sperrliste
 * (`scripts/messe-worthaeufigkeit-es.py`), RAE 2010.
 *
 * Wächter: `tests/tastenflow-texte-es-kids-frueh.test.ts` (Sprosse je Zeile
 * AUSGERECHNET auf ES und LatAm, Kleinschreibung, Wortgrenze 8, Sperrliste,
 * keine Kopien/Paare, jede Einheit hat an ihrer Sprosse eine Zeile). Nur
 * anhängen - Korpus-Anker im selben Commit (`npx tsx
 * scripts/erzeuge-korpus-anker.mts`).
 */
import type { CorpusItem } from "./corpus";

export const CORPUS_ES_WEG_FRUEH_KIDS: CorpusItem[] = [
  // ── Sprosse 7 (+a) - nur f j d k s l a: kleine Wortgruppen ─────────────────
  { text: "la sal", kind: "satz", stufen: ["kids"], minTier: 0, nurWeg: "es" },
  { text: "las alas", kind: "satz", stufen: ["kids"], minTier: 0, nurWeg: "es" },
  { text: "la falda", kind: "satz", stufen: ["kids"], minTier: 0, nurWeg: "es" },
  { text: "la salsa", kind: "satz", stufen: ["kids"], minTier: 0, nurWeg: "es" },
  { text: "la alfalfa", kind: "satz", stufen: ["kids"], minTier: 0, nurWeg: "es" },
  { text: "sal a la sala", kind: "satz", stufen: ["kids"], minTier: 0, nurWeg: "es" },
  // ── Sprosse 8 (+ñ) - mit dem einzigen Vokal „a" nur lasaña und daña ───────
  { text: "la lasaña salada", kind: "satz", stufen: ["kids"], minTier: 0, nurWeg: "es" },
  { text: "sala la lasaña", kind: "satz", stufen: ["kids"], minTier: 0, nurWeg: "es" },
  { text: "las alas dañadas", kind: "satz", stufen: ["kids"], minTier: 0, nurWeg: "es" },
  // ── Sprosse 9 (+e) - die eñe, erste Sätze mit ella/es/lee/sale ───────────
  { text: "esa es la eñe", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "ella es leal", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "ella sale de la sala", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "ella añade sal a la salsa", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "ella lee la señal", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "la leña de la aldea", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "la falda de seda", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  // ── Sprosse 10 (+o) - sol, oso, ola, lodo, ajo ───────────────────────────
  { text: "el sol sale", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "sal al sol", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "el oso sale del lodo", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "el oso se asolea", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "ella lee sola", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "ella lo lee", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "ella se aleja del oso", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "ella deja el ajo de lado", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "la sala es de ellos", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  // ── Sprosse 11 (+n) - no, en, nada, lana, llano, ensalada, flan ──────────
  { text: "no es nada", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "el nene nada", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "no nades en el lodo", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "ella nada lejos", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "la ensalada es sana", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "el oso no deja nada", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "el asno anda en el llano", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "ella desea flan", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "ellos salen al sol", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "la nena lee en la sala", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "la lana de la aldea", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  // ── Sprosse 12 (+t) - atole, elote, ajolote (Náhuatl), otoño ─────────────
  { text: "el ajolote nada solo", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "el atole de elote", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "el atleta salta alto", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "todos atentos", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "ella no lo nota", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "esta tela es de lana", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "ella deja la toalla al sol", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "es otoño en la aldea", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "no te enojes", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "la nota es alta", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "detente ante la señal", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "el oso anda delante", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "el elote asado", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  // ── Sprosse 13 (+u) - un/una/su/tu, luna, flauta, fuente ─────────────────
  { text: "una luna llena", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "todos los lunes nado", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "suena la flauta", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "el ajolote se asusta", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "ella lee junto a la fuente", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "salen todos juntos", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "un duende salta al tejado", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "un nudo de lana", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "ella unta la tostada", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "fue un susto", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "el atleta suda", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  // ── Sprosse 14 (+r) - la erre, alfajor, ruana, estrellas ─────────────────
  { text: "un loro entra al aula", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "una rana salta a la fuente", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "ella trae un alfajor", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "la naranja rueda", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "la fresa es roja", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "el tren sale tarde", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "salen las estrellas", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "una duna de arena", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "la ruana de lana", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "el reloj da las tres", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "tu tarea es leer", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "una araña teje su tela", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "un tesoro enterrado", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "ella entra al teatro", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "una rueda rota", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "la eñe es una letra", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "la erre suena fuerte", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "nadar es sano", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "una jarra de atole", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  // ── Sprosse 15 (+c) - clase, recreo, cenote (Maya), cacao, cueca, canoa ──
  { text: "toda la clase canta", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "el recreo es corto", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "nadar en el cenote", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "el caracol anda lento", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "el cacao se tuesta", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "el cactus crece en la arena", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "ella cena tacos", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "suena una cueca", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "el conejo corre", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "saca tu cuaderno", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "el atole con canela", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "no corras en la calle", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "las casas son de colores", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "cae un coco", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "un secreto entre dos", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "claro de luna", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "son las doce", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "cuenta un cuento", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "una canasta de frutas", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "una canoa en la costa", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  // ── Sprosse 16 (+i) - niño/niña, tortilla, tilde, fresa o frutilla ──────
  { text: "los niños salen al recreo", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "la niña lee un cuento", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "una tortilla caliente", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "la fiesta de fin de curso", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "un cielo lleno de estrellas", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "la isla de los loros", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "ten cuidado en la calle", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "a ella se le ocurre una idea", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "ella sale a la tienda", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "el dado tiene seis caras", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "el caracol tiene su casa", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "la eñe tiene su tilde", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "una sonrisa de oreja a oreja", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "un saludo con cariño", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "la tierra es redonda", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "cuida la tierra", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "un cocodrilo en el lodo", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "fresa o frutilla", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  // ── Sprosse 17 (+m) - llama, mate, tamales, maracas, mercado ────────────
  { text: "la llama camina en la montaña", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "tomamos mate en familia", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "en la fiesta comemos tamales", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "mira el mar", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "un mono salta de rama en rama", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "suenan las maracas", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "el mercado tiene de todo", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "mi casa es tu casa", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "dame la mano", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "el fin de semana dormimos la siesta", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "el camino a la escuela", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "todos a la mesa", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "cuidamos a los animales", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "un mole de olla", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "mañana es lunes", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "tostadas con mermelada", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "me encanta leer", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  { text: "mi idioma tiene eñe", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "es" },
  // ── Sprosse 18 (+´) - á é í ó ú: cóndor, ñandú, tucán, caimán, maní, ají ─
  { text: "el cóndor tiene alas enormes", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "es" },
  { text: "el ñandú corre en el llano", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "es" },
  { text: "el tucán come frutas", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "es" },
  { text: "el caimán duerme en el río", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "es" },
  { text: "un delfín nada junto a la canoa", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "es" },
  { text: "un té con limón", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "es" },
  { text: "mamá toma café", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "es" },
  { text: "el día está soleado", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "es" },
  { text: "el martes tenemos música", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "es" },
  { text: "dame más maní", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "es" },
  { text: "la salsa con ají", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "es" },
  { text: "tú cantas en el coro", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "es" },
  { text: "él toca el cajón", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "es" },
  { text: "una canción de cuna", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "es" },
  { text: "en el jardín crecen flores", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "es" },
  { text: "mamá me lee un cuento", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "es" },
  { text: "el ratón se esconde detrás del sofá", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "es" },
  { text: "turrón de maní", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "es" },
  { text: "ojalá mañana nademos en el mar", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "es" },
  { text: "el océano es inmenso", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "es" },
  { text: "un melón dulce", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "es" },
  { text: "no es difícil", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "es" },
  { text: "una tostada de atún", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "es" },
  { text: "el manatí es enorme", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "es" },
];
