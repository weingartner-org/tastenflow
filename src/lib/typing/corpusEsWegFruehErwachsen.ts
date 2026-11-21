/**
 * Korpus nur für Lernweg "es", frühe Sprossen 7-18 - Altersstufe Erwachsene
 * (ES-T3, 27.09.2026, Bauplan `BAUPLAN-2026-09-27-SPANISCHER-LEHRGANG.md`
 * §5.4/§5.5/§9, `BAUPLAN-2026-09-26-NEUE-SPRACHE-EFFIZIENT.md` §0 Punkt 6 und P5).
 *
 * Johannes' Regeln, wörtlich: „keine texte werden übersetzt, Texte aus den
 * regionen, altersgemäß und zeitgemäß" und „die texte sollen einen bezug zum
 * land und sprache haben". ALLES NEU AUF SPANISCH VERFASST - keine Text-Datei
 * einer anderen Sprache geöffnet, nichts übersetzt, kein Satz aus einer
 * Satzsammlung (darum kein `herkunft`). Keine Zeile der Kinder- oder
 * Jugend-Charge (`corpusEsWegFruehKids.ts`, `corpusEsWegFruehTeens.ts`) ist
 * kopiert oder nur abgewandelt - der Wächter prüft Text, Ledger-Schlüssel und
 * Paare gegen beide.
 *
 * ERWACHSENENWELT (Erwachsenenbildung, Umschulung, Beruf - auch Menschen mit
 * Sehbehinderung im Beruf), so weit die frühen Buchstaben es hergeben: Arbeit
 * (Schicht, Lohn, Vertrag, Büro, Landwirtschaft, Handwerk, Pflege), Behörden
 * (Formular, Stempel, Ausweis, Konsulat), Wohnen, Familie, Gesundheit, Kultur,
 * Nachrichten-Stil. Nichts Kindliches, nichts Belehrendes.
 *
 * ZEICHENSATZ wie ES-T1/T2 (Fassung A, `lernweg.ts` `ES_LETTER_ORDER`; auf ES
 * und LatAm gleich, der Wächter misst beides): Sprosse 7 (+a) f j d k s l a ·
 * 8 (+ñ) · 9 (+e) · 10 (+o) · 11 (+n) · 12 (+t) · 13 (+u) · 14 (+r) · 15 (+c) ·
 * 16 (+i) · 17 (+m) · 18 (+´, á é í ó ú; danach kommt Mayús). Vor Sprosse 18
 * gibt es kein p q b g h v y z - darum fehlen „trabajo", „empleo", „pagar",
 * „alquiler", „vecino"; die Zeilen finden andere Wege (sueldo, contrato,
 * arriendo, renta). `minTier` ist 0 bis Sprosse 8, 1 für 9-17, 2 für 18 -
 * gerechnet von `minTierFor(text, "es")`, nicht von Hand.
 *
 * VOR MAYÚS: jede Zeile klein, keine Satzzeichen, keine Namen (auch keine
 * Festtags-Namen, die gross geschrieben würden). JEDE ZEILE ist ENTWEDER eine
 * Reihe echter Wörter ODER ein grammatisch richtiger kleiner Satz (Leitfaden
 * Falle 26) - nie Wortsalat. An Sprosse 7-10 stehen darum nur wenige Zeilen
 * (Befund `BEFUND-2026-09-27-ES-T3-ERWACHSEN-FRUEH.md` §2).
 *
 * BEZUG ZU LAND UND SPRACHE: Wortpaare der Varianten als Thema (llenar o
 * rellenar · enfadarse o enojarse · costo o coste · la cola o la fila ·
 * atasco o trancón · camarero o mesero …), Arbeit auf dem Land (cafetal,
 * caña, aceitunas, soja), Essen (cortado, tinto, mate cocido, cocido
 * madrileño, olla común), Kultur (tertulia, ateneo, flamenco, altar de
 * muertos, tejidos andinos). Variantenneutral: kein vosotros, kein coger,
 * keine Wörter der Sperrliste (`scripts/messe-worthaeufigkeit-es.py`), RAE 2010.
 *
 * Wächter: `tests/tastenflow-texte-es-erwachsen-frueh.test.ts`. Nur anhängen -
 * Korpus-Anker im selben Commit (`npx tsx scripts/erzeuge-korpus-anker.mts`).
 */

import type { CorpusItem } from "./corpus";

export const CORPUS_ES_WEG_FRUEH_ERWACHSEN: CorpusItem[] = [
  // ── Sprosse 7 (+a) - nur f j d k s l a: die Faja (auch die Stützbinde bei der Arbeit)
  { text: "la faja", kind: "satz", stufen: ["erwachsen"], minTier: 0, nurWeg: "es" },
  // ── Sprosse 8 (+ñ) - der Jahrgang beim Wein, eine Anweisung im Rezept ──────────
  { text: "la añada", kind: "satz", stufen: ["erwachsen"], minTier: 0, nurWeg: "es" },
  { text: "añada sal", kind: "satz", stufen: ["erwachsen"], minTier: 0, nurWeg: "es" },
  // ── Sprosse 9 (+e) - Büro: der Sitz, der Chef ─────────────────────────────────
  { text: "desde la sede", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "ese es el jefe", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  // ── Sprosse 10 (+o) - Nachrichten, Amt, Unterkunft ────────────────────────────
  { text: "se desaloja la sede", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "ella lo sella", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "eso es falso", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "ella se aloja lejos", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  // ── Sprosse 11 (+n) - Senat, Augenarzt, Arbeit ────────────────────────────────
  { text: "los fondos del senado", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "de año en año", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "el fondo de ojo", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "ella no se deja", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "dos años de faena", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  // ── Sprosse 12 (+t) - Bank, Amt, Einkauf, Alter ───────────────────────────────
  { text: "el saldo total", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "falta la foto", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "le falta el sello", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "anote el total", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "todas las tallas", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "a los sesenta años", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "todo al detalle", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "talan a destajo", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  // ── Sprosse 13 (+u) - Lohn, Schulden, Erwachsenenbildung, Haus ────────────────
  { text: "ella salda su deuda", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "el sueldo neto", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "la junta anual", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "la salud ante todo", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "ella enseña a adultos", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "tejas sueltas", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "la estufa de leña", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "la edad adulta", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "es una estafa", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  // ── Sprosse 14 (+r) - Formular, Grenze, Schicht, Miete, Wetterwarnung ─────────
  { text: "llenar o rellenar", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "del otro lado de la frontera", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "el turno de tarde", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "enfadarse o enojarse", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "alerta naranja en el sur", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "reforestar la ladera", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "un terreno en las afueras", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "todo en orden", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "atrasos de la renta", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "el reajuste del sueldo", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "tarta o torta", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "un trato justo", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "la ofrenda de flores", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "el retraso del tren", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "tejen en el telar", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  // ── Sprosse 15 (+c) - Arztpraxis, Büro, Kaffee und Zuckerrohr, Abendschule ────
  { text: "el ascensor se atasca", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "costo o coste", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "el cafetal en flor", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "cortan caña", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "la consulta es a las once", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "el asunto del correo", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "las cuentas claras", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "clases nocturnas", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "la escuela de adultos", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "nunca es tarde", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "el taller de costura", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "la tos seca", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "alto contraste", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "se reanudan las clases", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "dos cortados", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "el conserje de turno", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "la contadora cuadra las cuentas", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "el cartero trae la factura", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "leer con los dedos", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  // ── Sprosse 16 (+i) - Ämter, Vertrag, Gesundheit, Pflege, Nachrichten, Umschulung
  { text: "usted es el titular", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "la cola o la fila", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "noticiero o telediario", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "catarro o resfriado", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "un contrato indefinido", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "la licencia de conducir", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "denuncia una estafa", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "fraude fiscal", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "lentejas con tocino", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "la cita con el oculista", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "la silla de ruedas", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "cuidadora de ancianos", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "la tarjeta de residencia", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "el certificado de estudios", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "añora su tierra", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "la tertulia del ateneo", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "un silo de soja", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "la dieta sin sal", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "cuida a los nietos", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "el oficio de sastre", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "estudiar a los cuarenta", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "curso a distancia", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "se arrienda cuarto", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "se necesita cocinero", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "la alcaldesa anuncia recortes", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "cierran la carretera", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "el tren no circula", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "las cifras del censo", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "la edad de retiro", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "aceitunas aliñadas", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "tejidos andinos", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "el cine nacional", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "el diario en audio", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  // ── Sprosse 17 (+m) - Schicht, Familie, Küche der Länder, Museum, Gemeinde ─────
  { text: "a media jornada", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "sismo o terremoto", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "manda remesas a su madre", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "la enfermera de turno", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "le duele la muela", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "el museo de arte moderno", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "un cocido madrileño", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "el mate cocido", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "ella camina a diario", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "el informe mensual", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "las cuentas del mes", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "la merienda o las onces", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "camarero o mesero", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "el comedor comunitario", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "almendros en flor", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "clases de flamenco", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "mi cuñada se muda", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "su marido cocina", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "la farmacia de turno", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "el teclado latinoamericano", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "el turismo rural", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "el comercio local", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "el altar de muertos", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  // ── Sprosse 18 (+´) - Wortpaare der Länder, Formularfelder, Arzt, Arbeit, Kultur
  { text: "un tinto es un café", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "atasco o trancón", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "tráfico o tránsito", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "judías o frijoles", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "el acta de la reunión", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "los trámites en línea", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "la cédula de identidad", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "el currículum al día", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "la cita médica", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "el médico de familia", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "la tensión alta", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "estrés en la oficina", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "la inflación anual", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "sin calefacción", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "la olla común", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "la recolección de aceituna", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "el café de altura", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "lectura fácil", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "el sueldo mínimo", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "atención al cliente", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "técnica en enfermería", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "su dirección actual", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "el número de teléfono", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "su correo electrónico", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "la matrícula del curso", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "formación continua", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "el sindicato se reúne", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "la artesanía local", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "la carnicería cierra tarde", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
];
