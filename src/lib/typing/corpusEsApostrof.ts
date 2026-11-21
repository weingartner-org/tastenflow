import type { CorpusItem } from "./corpus";

/**
 * Korpus nur für Lernweg "es", LETZTE Zeichen-Sprosse: der APOSTROPH `'`
 * (seit D1 Nr. 13 die letzte Einheit von `introOrder("es")`, auf ES und
 * LatAm die Grundtaste rechts neben der 0) - alle drei Altersstufen,
 * ES-T10, 28.09.2026 (Befund `BEFUND-2026-09-28-ES-T10-APOSTROPH.md`).
 *
 * Johannes' Regeln, wörtlich: „keine texte werden übersetzt, Texte aus den
 * regionen, altersgemäß und zeitgemäß" und „die texte sollen einen bezug zum
 * land und sprache haben". ALLES NEU AUF SPANISCH VERFASST - nichts
 * übersetzt, kein fremder Satz (darum kein `herkunft`).
 *
 * WO DER APOSTROPH IM SPANISCHEN ECHT VORKOMMT - nur dort steht er hier
 * (RAE, DPD „apóstrofo": im heutigen Spanisch selten):
 *  - Namen irischer Herkunft, die in Spanien und Amerika so geschrieben
 *    werden: O'Higgins (Chile), O'Reilly (La Habana), O'Donnell (Madrid),
 *    O'Gorman (México);
 *  - Wörter und Namen aus indigenen Sprachen, deren amtliche Schreibung den
 *    Apostroph als Buchstabenteil trägt: Quechua (Q'eswachaka, ch'ullu),
 *    Maya-Sprachen Guatemalas nach der Academia de Lenguas Mayas (k'iche',
 *    q'eqchi', q'anjob'al), Maya yucateco (Ek' Balam, ko'ox), Maya der
 *    Inschriften (K'inich Janaab' Pakal), Guaraní (mba'éichapa, che ra'a,
 *    ka'a - Guaraní ist Amtssprache Paraguays);
 *  - das Habla popular nach RAE/DPD („pa'l río");
 *  - Programmcode (Zeichenketten in Python, JavaScript, SQL) - nur Jugend
 *    und Erwachsene.
 * NICHT: Jahreszahlen wie '90 (RAE: falsch), „rock'n'roll" (RAE: rocanrol),
 * „pa'lante" (RAE und Fundéu uneins).
 *
 * Der Apostroph ist für `fitText` HART (nie weggelassen): jede Zeile
 * erscheint erst, wenn `'` gelernt ist - an der letzten Sprosse, auf ES und
 * LatAm. Kein „€" (die Zeilen sollen auf LatAm tippbar sein), jede Zeile
 * EIN Satz (keine frühe Fassung nötig - vor der Sprosse wird sie ohnehin
 * nie serviert). Gerades `'` (U+0027), nie ’.
 *
 * Wächter: `tests/tastenflow-texte-es-apostrof.test.ts`. Nur anhängen - der
 * Korpus-Anker kommt in denselben Commit
 * (`npx tsx scripts/erzeuge-korpus-anker.mts`).
 */
export const CORPUS_ES_APOSTROF: CorpusItem[] = [
  // ── Kinder ──
  { text: "Cada junio, familias de Cusco tejen de nuevo el puente Q'eswachaka.", kind: "satz", stufen: ["kids"], minTier: 5, nurWeg: "es" },
  { text: "El puente Q'eswachaka está hecho de cuerdas de hierba y cruza el río Apurímac.", kind: "satz", stufen: ["kids"], minTier: 5, nurWeg: "es" },
  { text: "Mi tía de Puno me tejió un ch'ullu de lana de alpaca con orejeras.", kind: "satz", stufen: ["kids"], minTier: 5, nurWeg: "es" },
  { text: "En Asunción saludamos a los amigos con un alegre \"mba'éichapa\".", kind: "satz", stufen: ["kids"], minTier: 5, nurWeg: "es" },
  { text: "Derlis me saluda con \"che ra'a\", que en guaraní significa mi amigo.", kind: "satz", stufen: ["kids"], minTier: 5, nurWeg: "es" },
  { text: "En maya, balam significa jaguar, como en Ek' Balam, en Yucatán.", kind: "satz", stufen: ["kids"], minTier: 5, nurWeg: "es" },
  { text: "Mi prima de Yucatán grita \"¡Ko'ox!\" y todos salimos corriendo al parque.", kind: "satz", stufen: ["kids"], minTier: 5, nurWeg: "es" },
  { text: "Bernardo O'Higgins, héroe de la independencia chilena, era de Chillán.", kind: "satz", stufen: ["kids"], minTier: 5, nurWeg: "es" },
  { text: "En Guatemala, mucha gente habla k'iche' en casa y en el mercado.", kind: "satz", stufen: ["kids"], minTier: 5, nurWeg: "es" },
  { text: "La Carretera Austral termina cerca de Villa O'Higgins, en la Patagonia.", kind: "satz", stufen: ["kids"], minTier: 5, nurWeg: "es" },
  // ── Jugendliche ──
  { text: "En Guatemala se hablan 22 idiomas mayas, entre ellos el mam y el q'anjob'al.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "es" },
  { text: "Desde 2013, la UNESCO protege la renovación del puente Q'eswachaka.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "es" },
  { text: "En Python, print('Hola, Oruro') muestra un saludo en la pantalla.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "es" },
  { text: "En JavaScript da igual si escribes 'Sucre' o \"Sucre\" para un texto.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "es" },
  { text: "Juan O'Gorman hizo el mural de piedras de la Biblioteca Central de la UNAM.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "es" },
  { text: "El club de fútbol O'Higgins, de Rancagua, se llama así por el prócer chileno.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "es" },
  { text: "K'inich Janaab' Pakal gobernó Palenque, en Chiapas, entre 615 y 683.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "es" },
  { text: "En Paraguay, la yerba mate se llama ka'a en guaraní.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "es" },
  { text: "Rigoberta Menchú, mujer k'iche', lucha por los derechos indígenas en Guatemala.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "es" },
  { text: "Ek' Balam, en Yucatán, se traduce del maya como jaguar negro o lucero jaguar.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "es" },
  // ── Erwachsene ──
  { text: "El nombre oficial de la Alameda de Santiago es Avenida Libertador Bernardo O'Higgins.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "es" },
  { text: "La calle O'Reilly une la Plaza de Armas con el Parque Central en La Habana Vieja.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "es" },
  { text: "La estación O'Donnell, de la línea 6 del metro madrileño, abrió en 1979.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "es" },
  { text: "La RAE admite el apóstrofo para reflejar el habla popular, como en \"pa'l río\".", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "es" },
  { text: "El manuscrito del Popol Wuj, escrito en k'iche', se guarda hoy en Chicago.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "es" },
  { text: "En Alta Verapaz, la mayor parte de la población pertenece al pueblo q'eqchi'.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "es" },
  { text: "En SQL, WHERE ciudad = 'Asunción' deja solo los clientes de esa ciudad.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "es" },
  { text: "La tumba de K'inich Janaab' Pakal, en Palenque, se descubrió en junio de 1952.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "es" },
  { text: "Ambrosio O'Higgins, padre de Bernardo, gobernó el Perú como virrey entre 1796 y 1801.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "es" },
  { text: "El guaraní es idioma oficial de Paraguay, y en Asunción se oye \"mba'éichapa\" a diario.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "es" },
];
