/**
 * Korpus nur für Lernweg "es", mittlere Sprossen 19-30 (Mayús bis w) -
 * Altersstufe Erwachsene (ES-T6, 27.09.2026, Bauplan
 * `BAUPLAN-2026-09-27-SPANISCHER-LEHRGANG.md` §4.3/§5/§9).
 *
 * Johannes' Regeln, wörtlich: „keine texte werden übersetzt, Texte aus den
 * regionen, altersgemäß und zeitgemäß" und „die texte sollen einen bezug zum
 * land und sprache haben". ALLES NEU AUF SPANISCH VERFASST - keine Text-Datei
 * einer anderen Sprache geöffnet, nichts übersetzt, kein Satz aus einer
 * Satzsammlung (darum kein `herkunft`). Sie setzt die frühe Erwachsenen-Charge
 * (`corpusEsWegFruehErwachsen.ts`, ES-T3) fort, ohne sie zu wiederholen: der
 * Wächter prüft Text, Ledger-Schlüssel und Paare gegen ALLE früheren es-Zeilen
 * und das Wortbudget über beide Erwachsenen-Chargen zusammen.
 *
 * ERWACHSENENWELT (Erwachsenenbildung, Umschulung, Beruf): Arbeit (Vertrag,
 * Lohn, Schicht, Aguinaldo, Arbeitslosengeld, Dienstalter, Stellenanzeige),
 * Familie (Eltern, Enkel, Schwiegersohn), Wohnen und Stadt (Miete, Hypothek,
 * Lift, Nachbarschaft), Behörden (Pass, Termin, Formular, Zoll), Gesundheit
 * (Operation, Bereitschaftsdienst, Impfung, Blutbild), Reisen, Kultur
 * (Persönlichkeiten aus Literatur, Musik und Malerei), Nachrichten-Stil
 * (Wahlen, Gesetz, Streik, Haushalt), Technik im Alltag (wifi, web, wasap,
 * Online-Termine), Ehrenamt (Blutspende, Lebensmittel, Bürgerradio). Menschen
 * mit Behinderung im Beruf, Person zuerst: „Mi colega con baja visión", „La
 * jueza con discapacidad visual", „Trabajo con una línea braille". Nichts
 * Kindliches, nichts Belehrendes. Dazu Lernen im Erwachsenenalter („Esperanza
 * aprendió a leer a los setenta", „Estudio lingüística a los cincuenta").
 *
 * ZEICHENSATZ wie ES-T4/T5 (`lernweg.ts` `ES_LETTER_ORDER`, auf ES und LatAm
 * GLEICH): Sprosse 19 (⇧ Mayús) · 20 (+p) · 21 (+q) · 22 (+b) · 23 (+g) ·
 * 24 (+h) · 25 (+v) · 26 (+y) · 27 (+z) · 28 (+x) · 29 (+¨, also ü) ·
 * 30 (+w, letzter Buchstabe). Die Sprosse einer Zeile ist die kleinste, an der
 * `fitText` sie durchlässt - mindestens 19. Grossbuchstaben lässt `fitText`
 * über die Auto-Grossschreibung schon vor Mayús durch (corpus.ts, KERNREGEL);
 * jede Mayús-Zeile trägt darum ein „m" oder einen Akzent, so rutscht sie
 * höchstens bis Sprosse 17 vor (Befund ES-T4 §2, Wächter). Vor x steht darum
 * nie „México" (die Zeilen nennen Jalisco, Tijuana, Querétaro …).
 * `minTier` gerechnet von `minTierFor(text, "es")`, nicht von Hand.
 *
 * FORM: Satzanfang gross, Namen und Orte gross. NOCH KEINE SATZZEICHEN (die
 * kommen in der Ende-Charge): jede Zeile ist ein kleiner Satz ohne Punkt,
 * Komma, ¿? oder ¡!.
 *
 * BEZUG ZU LAND UND SPRACHE: Orte aus 21 Ländern (höchstens ein Drittel der
 * verorteten Zeilen in Spanien, höchstens ein Drittel in Mexiko - Wächter),
 * Persönlichkeiten aus allen Regionen (Alfonsina Storni, Mercedes Sosa, José
 * Martí, Juan Rulfo, Teresa Carreño, Clara Campoamor, Gabriela Mistral, Rubén
 * Darío, Rubén Blades, Chabuca Granda, Violeta Parra, Rigoberta Menchú, Sor
 * Juana Inés de la Cruz, Celia Cruz, Jorge Drexler, Oswaldo Guayasamín, Elena
 * Poniatowska …), Feste und Bräuche (Candelaria in Puno, Carnaval de
 * Barranquilla, Semana Santa de Ayacucho, Sant Jordi mit Büchern und Rosen,
 * Vendimia in Mendoza), Speisen (ceviche, baleada, pupusas, arroz con gandules,
 * mazamorra morada, quinua, mezcal), die Südhalbkugel (Ski im Juli in
 * Farellones, Weinlese im März, Grippeimpfung im Herbst in Chile), Wörter, die
 * je Land anders heissen und die Zeile erklärt oder verortet (subte, obra
 * social, aguinaldo, mozo in Rosario), die Sprachen neben dem Spanischen
 * (aimara, guaraní, fang, quechua, lengua de señas; die Völker wayuu, wichí,
 * awajún, kawésqar). Variantenneutral: kein vosotros, keine Wörter der
 * Sperrliste (`scripts/messe-worthaeufigkeit-es.py`), RAE 2010 (solo ohne
 * Tilde).
 *
 * Wächter: `tests/tastenflow-texte-es-erwachsen-mitte.test.ts`. Nur anhängen -
 * Korpus-Anker im selben Commit (`npx tsx scripts/erzeuge-korpus-anker.mts`).
 */
import type { CorpusItem } from "./corpus";

export const CORPUS_ES_MITTE_ERWACHSEN: CorpusItem[] = [
  // ── Sprosse 19 (⇧ Mayús) - Namen und Orte, Buchstaben bis ´, je ein m oder Akzent ────────────────────────────────
  { text: "Consuelo termina la carrera a distancia", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "La ministra renuncia tras la crisis", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "Alfonsina Storni enseñó en Rosario", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Carmen firma el contrato en Asunción", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Mercedes Sosa llenó estadios enteros", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "La casa natal de José Martí es un museo", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Juan Rulfo nació en Jalisco", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Los martes Inés cuida a su madre en Murcia", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Tunja es una ciudad fría", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "En Calama el aire es seco", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "Ramón atiende la ferretería del centro", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Nuria cierra la tienda a mediodía", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Mi cuñada es auditora en Montería", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Teresa Carreño nació en Caracas", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Ernesto maneja un camión en Salta", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Martín es enfermero en Oruro", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Mónica arrienda un cuarto en La Serena", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Cerca de La Serena los astrónomos miran el cielo", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "La alcaldía de Cúcuta atiende en línea", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Rocío es notaria en Cáceres", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Lucía atiende el mostrador del mercado", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Mis nietos me llaman desde Almería", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Marisol es controladora aérea en Lima", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "La doctora Morales atiende en Tarija", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "La jornada electoral transcurre en calma", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "es" },
  { text: "Las oficinas del consulado cierran a mediodía", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Iñaki estudia informática en Irún", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  // ── Sprosse 20 (+p) - Pension, Pass, Preise, Puros ───────────────────────────────────────────────────────────────
  { text: "En Estelí se tuercen puros a mano", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "En Leticia se pasa a pie la frontera", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "En Colonia del Sacramento las calles son de piedra", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Raúl cumple treinta años en la empresa", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Mi padre tramita su pensión en Piura", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Clara Campoamor fue diputada por Madrid", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Pedro tiene un puesto en la feria de San Telmo", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Pido cita para el pasaporte", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Los precios del transporte se disparan", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Presento mi currículum en persona", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "La empresa contrata operarias", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "En Puno se festeja la Candelaria", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Un puente une Posadas con Encarnación", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Mi primo repara celulares en Arica", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "En Punta Arenas amanece tarde en junio", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "En Puerto Rico se usa el dólar", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "En Sucre está la sede del poder judicial", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Paula es intérprete en el consulado", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "La planta de reciclaje separa el cartón", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Mis padres se mudan cerca de mi casa", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  // ── Sprosse 21 (+q) - Miete, Quirófano, Quinua, Requisitos ───────────────────────────────────────────────────────
  { text: "Pilar es operaria en una maquiladora de Tijuana", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Quito está casi en la línea ecuatorial", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Querétaro atrae a la industria aeroespacial", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "El alquiler se come la mitad del sueldo", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Iquitos no tiene carretera a Lima", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "La arquitecta presenta los planos", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Esquiamos en Farellones en julio", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "La cirujana entra al quirófano", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "En Tequila se destila el tequila", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Mi esposa quiere terminar la secundaria", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "En Menorca se curan quesos", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Nos quedamos sin señal en la montaña", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "En Iquique se compra sin aranceles", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Quince personas esperan en la fila", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Aquí atienden en aimara", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Piden como requisito un título técnico", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "La orquesta sinfónica toca en el teatro municipal", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Compramos quinua en el mercado de El Alto", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Queremos una casa pequeña cerca del mar", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "La máquina de coser tiene cuarenta años", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  // ── Sprosse 22 (+b) - Bank, Bibliothek, Arbeit, Línea braille ────────────────────────────────────────────────────
  { text: "La feria juniana se celebra en San Pedro Sula", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "La cebolla subió de precio", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Las esculturas de Botero adornan Medellín", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "En Cuenca se tejen sombreros de toquilla", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Trabajo de lunes a sábado", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Pablo Neruda nació en Parral", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Rubén Darío nació en Metapa", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "El banco me cobra una comisión mensual", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "La biblioteca municipal abre los sábados", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Mario Benedetti retrató a los oficinistas", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "La obra cierra la calle principal", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Sebastián trabaja en un restaurante de Trujillo", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Rubén Blades fue ministro de turismo en Panamá", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Los bomberos rescatan a un perro del río", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Nos encontramos en el Obelisco", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Rebeca abre su panadería a las cinco", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "El subte de Buenos Aires tiene seis líneas", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Cobro el subsidio por desempleo", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Abrimos una cuenta en el banco", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Trabajo con una línea braille", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Mi abuela borda manteles en Tarija", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  // ── Sprosse 23 (+g) - Regierung, Versicherung, Aguinaldo, Gebärdensprache ────────────────────────────────────────
  { text: "Me pagan el sueldo a fin de mes", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Andrés es guía de turismo en Cusco", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "En Argentina la obra social cubre la consulta", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "En Santo Domingo está la catedral más antigua de América", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "La abogada estudia el caso", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Adriana es intérprete de lengua de señas", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Gabriela Mistral trabajó como maestra rural", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Jorge Luis Borges dirigió la Biblioteca Nacional", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "El seguro médico no cubre la operación", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "El Congreso aprueba el presupuesto", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Llegamos tarde por el tráfico", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "La gerente se reúne con los clientes", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Carlos Gardel cantaba tangos", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Juan Luis Guerra canta merengue", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Grabamos un programa de radio comunitaria", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "La guardería del barrio está llena", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Gloria Fuertes escribió para la infancia", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Nicaragua cuenta con dos grandes lagos", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "En Argentina el aguinaldo se cobra en dos cuotas", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Guinea Ecuatorial tiene tres lenguas oficiales", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Guardo el recibo de la compra", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  // ── Sprosse 24 (+h) - Spital, Hypothek, Streik, Steuererklärung ──────────────────────────────────────────────────
  { text: "En Jalisco nació el mariachi", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Frida Kahlo pintó su dolor", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "El hospital busca personal de enfermería", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Mi hermana se muda a Cochabamba", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Hacemos la declaración de la renta", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Chabuca Granda le cantó a Lima", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "El hielo patagónico retrocede", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "La huelga de transportistas sigue", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "En Chiloé las iglesias son de madera", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "El horario de atención es de ocho a tres", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Mi hija estudia ingeniería en Chihuahua", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "En Honduras se come la baleada", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "En el Chaco hace mucho calor", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Ahorro un poco cada mes", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Pedimos una hipoteca a treinta años", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Hablamos con la médica de guardia", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "En La Habana se baila son", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "En Bogotá el clima cambia cada hora", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  // ── Sprosse 25 (+v) - Wohnung, Wahl, Impfung, Ehrenamt ───────────────────────────────────────────────────────────
  { text: "El ceviche es plato bandera del Perú", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "En La Romana se cultiva caña", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "El Ávila separa Caracas del mar", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Mi suegro cobra la jubilación en Montevideo", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Horacio Quiroga vivió en la selva de Misiones", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Paco de Lucía renovó el flamenco", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Tegucigalpa se asienta en un valle", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "El lago Atitlán está rodeado de volcanes", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "En Chile los bomberos son voluntarios", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Violeta Parra le dio gracias a la vida", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "El Carnaval de Barranquilla dura cuatro días", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "En Samaná se ven ballenas en invierno", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Votamos el domingo en la escuela", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "En Chile la vacuna contra la gripe se pone en otoño", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Vivimos en un edificio sin ascensor", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Mi vecina reparte alimentos los viernes", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Simón Bolívar murió en Santa Marta", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Mario Vargas Llosa nació en Arequipa", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "El vuelo de Lima a Cusco dura poco más de una hora", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Salvador Allende fue presidente de Chile", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "En Montevideo la rambla bordea el río", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "El precio de la vivienda no para de subir", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "En Otavalo el gran mercado es el sábado", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Vendemos artesanías por internet", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Machu Picchu recibe miles de visitantes", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "En San Salvador venden pupusas en cada esquina", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Mi colega con baja visión usa un lector de pantalla", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  // ── Sprosse 26 (+y) - Gesetz, Gemeinde, Yerba, Uyuni ─────────────────────────────────────────────────────────────
  { text: "En Costa Rica no hay ejército", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "En Masaya se hacen hamacas", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "En Bata se habla español y fang", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "En Panamá circulan el balboa y el dólar", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "En Barcelona se regalan libros y rosas en abril", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "En Paraguay el guaraní es lengua oficial", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "El malecón de Guayaquil mira al río Guayas", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Ya abrieron las urnas", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "La nueva ley protege a quienes trabajan en casa", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Hoy teletrabajo desde casa", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "El salar de Uyuni es el más grande del mundo", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "En Uruguay el mate va a todas partes", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "La yerba mate se cultiva en Misiones", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Mi yerno trabaja en una mina de cobre en Atacama", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "La Semana Santa de Ayacucho es famosa", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Apoyamos a las familias del barrio", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Las playas de Cartagena de Indias se llenan en enero", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "El ayuntamiento amplía el horario de la biblioteca", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "El proyecto de ley pasa al Senado", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Monterrey es la capital de Nuevo León", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "En el hotel el desayuno está incluido", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Mi hija mayor ya trabaja", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  { text: "Atahualpa Yupanqui cantó al campo", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "es" },
  // ── Sprosse 27 (+z) - Plaza, Cruz Roja, Vendimia im März ─────────────────────────────────────────────────────────
  { text: "Rigoberta Menchú recibió el Nobel de la Paz", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "Almorzamos frente a la plaza de Armas de Arequipa", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "El arroz con gandules es de Puerto Rico", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "Doné sangre en la Cruz Roja", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "Se fue la luz en todo el barrio", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "Julio Cortázar escribió Rayuela", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "Sor Juana Inés de la Cruz escribió en el siglo diecisiete", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "En Zaragoza sopla el cierzo", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "La mazamorra morada es un postre de Lima", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "La Zona Libre de Colón es enorme", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "Celia Cruz gritaba azúcar", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "En Lanzarote las casas son blancas", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "Esperanza aprendió a leer a los setenta", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "Cruzamos el estrecho de Magallanes en ferri", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "En Manizales se cosecha café", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "Venezuela tiene el salto de agua más alto del mundo", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "En Rosario al camarero le dicen mozo", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "En Mendoza la vendimia se celebra en marzo", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "La jueza con discapacidad visual trabaja con braille", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  // ── Sprosse 28 (+x) - Examen, Taxi, Export, Oaxaca ───────────────────────────────────────────────────────────────
  { text: "Benito Juárez nació en Oaxaca", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "En Oaxaca se hace mezcal", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "Aprobé el examen de conducir", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "En Mompox se trabaja la filigrana", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "Jorge Drexler ganó un óscar", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "Tomamos un taxi al aeropuerto", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "La próxima reunión es el jueves", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "En Extremadura se cría el cerdo ibérico", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "Tlaxcala es el estado más pequeño de México", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "La feria del libro es un éxito", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "Se busca personal de cocina con experiencia", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "Escribo un texto para el boletín", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "Mi hermano vive en el extranjero", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "Colombia exporta flores", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "En Xela hay escuelas de español", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "La excursión sale a las siete", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "Chile exporta cobre y fruta", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "Me hago un examen de sangre", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "Mi cuñado es taxista en Quito", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  // ── Sprosse 29 (+¨) - jede Zeile mit ü: bilingüe, antigüedad, Mayagüez, Camagüey, Sigüenza ───────────────────────
  { text: "Mayagüez está en el oeste de Puerto Rico", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "Camagüey es la ciudad de los tinajones", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "Sigüenza conserva una catedral medieval", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "Martín Miguel de Güemes defendió Salta", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "El güiro acompaña la plena en Puerto Rico", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "Buscamos personal administrativo bilingüe", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "Mi antigüedad en la empresa es de diez años", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "Las cigüeñas anidan en los campanarios de Extremadura", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "Mi compañera nicaragüense vive en Costa Rica", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "Estudio lingüística a los cincuenta", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "En Punta Tombo anidan pingüinos", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "Pedir ayuda no da vergüenza", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "El desagüe de la cocina está tapado", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "Averigüe el estado de su trámite en línea", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "La farmacéutica recomienda un ungüento", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "En Paraguay la educación es bilingüe", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "El pronóstico es halagüeño", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "La lingüista graba a hablantes de quechua", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  // ── Sprosse 30 (+w) - wifi, web, wasap, Tiwanaku, wiphala, wayuu, Trelew ─────────────────────────────────────────
  { text: "Oswaldo Guayasamín pintó en Quito", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "Elena Poniatowska escribió sobre Tlatelolco", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "Trelew fue fundada por colonos galeses", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "La wiphala flamea en El Alto", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "Las ruinas de Tiwanaku están cerca del Titicaca", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "Los wayuu tejen mochilas en La Guajira", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "Sin wifi no puedo teletrabajar", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "Descargo el formulario de la página web", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "La reunión de vecinos se organiza por wasap", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "Charles Darwin visitó las Galápagos", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "Mi hija practica taekwondo los jueves", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "En Chile se cultivan kiwis para exportar", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "En Tarifa se practica windsurf", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "Almuerzo un sándwich en la oficina", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "Las tejedoras wichí trabajan el chaguar", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "El pueblo awajún vive en la Amazonía peruana", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "Actualizo mi perfil en la web de empleo", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "Walter repara computadoras en Asunción", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
  { text: "Los kawésqar navegaban los canales australes", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "es" },
];
