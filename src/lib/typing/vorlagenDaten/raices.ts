/**
 * „Raíces y préstamos" - das spanische Gegenstück zu `racines.ts`
 * (Französisch), `wordRoots.ts` (Englisch) und `fremdwoerter.ts` (Deutsch):
 * eine ÜBUNGSVORLAGE zum Abschreiben für den Lernweg „es". Jede Zeile lautet
 * `<indicio> - <palabra>`; wer abschreibt, lernt nebenbei, woher ein Wort kommt.
 *
 * ★ ES-S (27.09.2026, Bauplan spanischer Lehrgang §5.1): Aufbau wie `RACINES`
 * (drei Altersstufen, je Stufe vier Themen, 25/15/25/15 = 80 je Stufe, 240
 * zusammen). Inhalt komplett neu auf Spanisch - nichts übersetzt (Johannes:
 * *„keine texte werden übersetzt"*, *„die texte sollen einen bezug zum land und
 * sprache haben"*). Darum ist „Palabras de las lenguas de América" ein grosses
 * Thema: Náhuatl, Quechua, Aimara, Taíno, Caribe, Guaraní, Tupí und Mapudungun
 * - die Sprachen, aus denen das Spanische Amerikas seine Tiere, Früchte und
 * Alltagswörter hat (*tomate, cóndor, huracán, ñandú, copihue*).
 *
 * ── Themen ──────────────────────────────────────────────────────────────
 *  • „Raíces griegas y latinas" (25) - der Schulwortschatz (tele-, -grafía,
 *    -voro, bi-, cuadr-, -logía, -cracia …), von „bicicleta" bis „hegemonía".
 *  • „Palabras que vienen del árabe" (15) - rund acht Jahrhunderte al-Ándalus
 *    (*almohada, azúcar, ojalá, alcalde, álgebra, azulejo*).
 *  • „Palabras de las lenguas de América" (25) - siehe oben.
 *  • „Préstamos de otras lenguas" (15) - Inglés, Francés, Italiano, Portugués,
 *    Japonés, Turco, Checo und die Sprachen Spaniens: Vasco (*izquierda,
 *    chatarra*) und Catalán/Valenciano (*paella, capicúa*).
 *
 * ── Belege (GELESEN, nicht erinnert) ─────────────────────────────────────
 * Jede Herkunft wurde am 27.09.2026 an der Rohseite von es.wiktionary.org
 * gelesen (`action=raw`, Abschnitt „Etimología" der Sprache Español, Vorlage
 * `{{etimología|<Sprachcode>|…}}`); die Seitenadresse steht bei jedem Paar in
 * `beleg`. Hat ein Wort mehrere Etymologien (*llama, papa, carpa, mate*), gilt
 * die der gemeinten Bedeutung. Wörter mit „etimología incierta" oder ohne
 * Seite fielen heraus (*chinchilla, tocayo, guayaba, arepa, pijama …*) -
 * lieber weniger und belegt. Die Liste der geprüften und verworfenen Wörter
 * steht im Befund `BEFUND-2026-09-27-ES-RAICES-EXPEDITION-LEKTIONEN.md`.
 * Nachgeprüft 27.09.2026 (Text-Prüfung): *chocolate* (auch am Wiktionary
 * „de ahí es incierto"), *boina* (DLE „quizá"), *caucho* und *caoba* (Herkunft
 * umstritten bzw. „caribe o taíno") herausgenommen - ersetzt durch *mapache*,
 * *acuarela*, *cancha*, *ocelote* (Etimología eindeutig).
 * `herkunft` nennt die Ursprungssprache, die die Seite angibt (*yogur*: vom
 * Französischen, ursprünglich Türkisch ⇒ „turco"); nur für die Lehrkraft.
 *
 * ── Zeilenregeln (Wächter: `tests/tastenflow-vorlage-raices.test.ts`) ──────
 * - höchstens 40 Zeichen (Braillezeile), genau ein Trenner ` - `;
 * - `palabra` ein Einzelwort; `indicio` enthält es nicht;
 * - kein Wort doppelt, in keiner Stufe und über die Stufen hinweg;
 * - keine Wörter der Sperrliste (`scripts/messe-worthaeufigkeit-es.py`) - auch
 *   nicht als Teil eines Wortes („tubérculo" trägt „culo" ⇒ nicht verwendet);
 * - kein vosotros, RAE 2010, nur Zeichen, die auf ES und LatAm eine Taste haben.
 */

export type RaizStufe = "kids" | "teens" | "erwachsen";

/** Nur ein Hinweis für die Lehrkraft - wird beim Abtippen nicht gezeigt. */
export type RaizHerkunft =
  | "griego" | "latin" | "arabe"
  | "nahuatl" | "quechua" | "aimara" | "taino" | "caribe" | "guarani" | "tupi" | "mapudungun"
  | "ingles" | "frances" | "italiano" | "portugues" | "japones" | "turco" | "checo"
  | "vasco" | "catalan";

export interface RaizPaar {
  /** Kurze, wahre Umschreibung der Bedeutung - kein Bindestrich, nicht das Wort selbst. */
  indicio: string;
  /** Das Wort selbst - ein Einzelwort. */
  palabra: string;
  herkunft: RaizHerkunft;
  /** Die es.wiktionary-Seite, an der `herkunft` gelesen wurde (CC BY-SA 4.0). */
  beleg: string;
}

export interface RaizThema {
  id: string;
  titel: string;
  paare: RaizPaar[];
}

export const RAICES_THEMEN: readonly { id: string; titel: string }[] = [
  { id: "griego-latin", titel: "Raíces griegas y latinas" },
  { id: "arabe", titel: "Palabras que vienen del árabe" },
  { id: "america", titel: "Palabras de las lenguas de América" },
  { id: "prestamos", titel: "Préstamos de otras lenguas" },
];

function w(palabra: string): string {
  return `https://es.wiktionary.org/wiki/${palabra}`;
}

export const RAICES: Record<RaizStufe, RaizThema[]> = {
  // ------------------------------------------------------------ kids (8-11)
  kids: [
    { id: "griego-latin", titel: "Raíces griegas y latinas", paare: [
      { indicio: "dos ruedas y pedales", palabra: "bicicleta", herkunft: "griego", beleg: w("bicicleta") },
      { indicio: "hablar con alguien lejano", palabra: "teléfono", herkunft: "griego", beleg: w("teléfono") },
      { indicio: "reptil gigante de otra era", palabra: "dinosaurio", herkunft: "griego", beleg: w("dinosaurio") },
      { indicio: "caballo de río en África", palabra: "hipopótamo", herkunft: "griego", beleg: w("hipopótamo") },
      { indicio: "mira las estrellas de lejos", palabra: "telescopio", herkunft: "griego", beleg: w("telescopio") },
      { indicio: "figura de tres lados", palabra: "triángulo", herkunft: "latin", beleg: w("triángulo") },
      { indicio: "figura de cinco lados", palabra: "pentágono", herkunft: "griego", beleg: w("pentágono") },
      { indicio: "figura de seis lados", palabra: "hexágono", herkunft: "griego", beleg: w("hexágono") },
      { indicio: "estudia ríos y montañas", palabra: "geografía", herkunft: "griego", beleg: w("geografía") },
      { indicio: "lugar lleno de libros", palabra: "biblioteca", herkunft: "griego", beleg: w("biblioteca") },
      { indicio: "gira alrededor del Sol", palabra: "planeta", herkunft: "griego", beleg: w("planeta") },
      { indicio: "animal que come carne", palabra: "carnívoro", herkunft: "latin", beleg: w("carnívoro") },
      { indicio: "animal que come plantas", palabra: "herbívoro", herkunft: "latin", beleg: w("herbívoro") },
      { indicio: "sus crías toman leche", palabra: "mamífero", herkunft: "latin", beleg: w("mamífero") },
      { indicio: "vive en el agua y en la tierra", palabra: "anfibio", herkunft: "griego", beleg: w("anfibio") },
      { indicio: "anda en cuatro patas", palabra: "cuadrúpedo", herkunft: "latin", beleg: w("cuadrúpedo") },
      { indicio: "anda en dos pies", palabra: "bípedo", herkunft: "latin", beleg: w("bípedo") },
      { indicio: "imagen hecha con luz", palabra: "fotografía", herkunft: "griego", beleg: w("fotografía") },
      { indicio: "de muchos colores", palabra: "multicolor", herkunft: "latin", beleg: w("multicolor") },
      { indicio: "animal de seis patas", palabra: "insecto", herkunft: "latin", beleg: w("insecto") },
      { indicio: "aparato para ver programas", palabra: "televisor", herkunft: "griego", beleg: w("televisor") },
      { indicio: "come plantas y carne", palabra: "omnívoro", herkunft: "latin", beleg: w("omnívoro") },
      { indicio: "monumento de Egipto y México", palabra: "pirámide", herkunft: "griego", beleg: w("pirámide") },
      { indicio: "tanque de agua para peces", palabra: "acuario", herkunft: "latin", beleg: w("acuario") },
      { indicio: "todas las letras en orden", palabra: "alfabeto", herkunft: "griego", beleg: w("alfabeto") },
    ] },
    { id: "arabe", titel: "Palabras que vienen del árabe", paare: [
      { indicio: "apoyas la cabeza al dormir", palabra: "almohada", herkunft: "arabe", beleg: w("almohada") },
      { indicio: "endulza la leche", palabra: "azúcar", herkunft: "arabe", beleg: w("azúcar") },
      { indicio: "sale de las aceitunas", palabra: "aceite", herkunft: "arabe", beleg: w("aceite") },
      { indicio: "fruto del olivo", palabra: "aceituna", herkunft: "arabe", beleg: w("aceituna") },
      { indicio: "grano blanco que se cuece", palabra: "arroz", herkunft: "arabe", beleg: w("arroz") },
      { indicio: "fruta amarilla y ácida", palabra: "limón", herkunft: "arabe", beleg: w("limón") },
      { indicio: "raíz que comen los conejos", palabra: "zanahoria", herkunft: "arabe", beleg: w("zanahoria") },
      { indicio: "animal de cuello muy largo", palabra: "jirafa", herkunft: "arabe", beleg: w("jirafa") },
      { indicio: "color del cielo y del mar", palabra: "azul", herkunft: "arabe", beleg: w("azul") },
      { indicio: "así lo deseo", palabra: "ojalá", herkunft: "arabe", beleg: w("ojalá") },
      { indicio: "verde por fuera, roja dentro", palabra: "sandía", herkunft: "arabe", beleg: w("sandía") },
      { indicio: "juego de reyes y peones", palabra: "ajedrez", herkunft: "arabe", beleg: w("ajedrez") },
      { indicio: "fibra blanca de una planta", palabra: "algodón", herkunft: "arabe", beleg: w("algodón") },
      { indicio: "fruta redonda y jugosa", palabra: "naranja", herkunft: "arabe", beleg: w("naranja") },
      { indicio: "tela gruesa sobre el suelo", palabra: "alfombra", herkunft: "arabe", beleg: w("alfombra") },
    ] },
    { id: "america", titel: "Palabras de las lenguas de América", paare: [
      { indicio: "animal con antifaz en la cara", palabra: "mapache", herkunft: "nahuatl", beleg: w("mapache") },
      { indicio: "fruto rojo de la ensalada", palabra: "tomate", herkunft: "nahuatl", beleg: w("tomate") },
      { indicio: "fruto verde del guacamole", palabra: "aguacate", herkunft: "nahuatl", beleg: w("aguacate") },
      { indicio: "se masca y no se traga", palabra: "chicle", herkunft: "nahuatl", beleg: w("chicle") },
      { indicio: "semilla del chocolate", palabra: "cacao", herkunft: "nahuatl", beleg: w("cacao") },
      { indicio: "pariente salvaje del perro", palabra: "coyote", herkunft: "nahuatl", beleg: w("coyote") },
      { indicio: "para escribir en la pizarra", palabra: "tiza", herkunft: "nahuatl", beleg: w("tiza") },
      { indicio: "gran ave de los Andes", palabra: "cóndor", herkunft: "quechua", beleg: w("cóndor") },
      { indicio: "animal de carga de los Andes", palabra: "llama", herkunft: "quechua", beleg: w("llama") },
      { indicio: "da lana muy suave", palabra: "alpaca", herkunft: "aimara", beleg: w("alpaca") },
      { indicio: "felino de las montañas", palabra: "puma", herkunft: "quechua", beleg: w("puma") },
      { indicio: "gran llanura de Argentina", palabra: "pampa", herkunft: "quechua", beleg: w("pampa") },
      { indicio: "se come frita o en puré", palabra: "papa", herkunft: "quechua", beleg: w("papa") },
      { indicio: "cama colgada entre árboles", palabra: "hamaca", herkunft: "taino", beleg: w("hamaca") },
      { indicio: "barca estrecha de remo", palabra: "canoa", herkunft: "taino", beleg: w("canoa") },
      { indicio: "viento muy fuerte del Caribe", palabra: "huracán", herkunft: "taino", beleg: w("huracán") },
      { indicio: "reptil verde del Caribe", palabra: "iguana", herkunft: "taino", beleg: w("iguana") },
      { indicio: "planta de las mazorcas", palabra: "maíz", herkunft: "taino", beleg: w("maíz") },
      { indicio: "ave corredora de la pampa", palabra: "ñandú", herkunft: "guarani", beleg: w("ñandú") },
      { indicio: "gran felino de la selva", palabra: "jaguar", herkunft: "guarani", beleg: w("jaguar") },
      { indicio: "ave de la selva muy colorida", palabra: "tucán", herkunft: "tupi", beleg: w("tucán") },
      { indicio: "reptil de los ríos del sur", palabra: "yacaré", herkunft: "guarani", beleg: w("yacaré") },
      { indicio: "ave verde de Guatemala", palabra: "quetzal", herkunft: "nahuatl", beleg: w("quetzal") },
      { indicio: "anfibio de los lagos de México", palabra: "ajolote", herkunft: "nahuatl", beleg: w("ajolote") },
      { indicio: "el roedor más grande", palabra: "capibara", herkunft: "tupi", beleg: w("capibara") },
    ] },
    { id: "prestamos", titel: "Préstamos de otras lenguas", paare: [
      { indicio: "deporte con balón y metas", palabra: "fútbol", herkunft: "ingles", beleg: w("fútbol") },
      { indicio: "quien guía al grupo", palabra: "líder", herkunft: "ingles", beleg: w("líder") },
      { indicio: "deporte con bate y guante", palabra: "béisbol", herkunft: "ingles", beleg: w("béisbol") },
      { indicio: "pan con relleno", palabra: "sándwich", herkunft: "ingles", beleg: w("sándwich") },
      { indicio: "niño o niña muy pequeño", palabra: "bebé", herkunft: "frances", beleg: w("bebé") },
      { indicio: "jefe de cocina", palabra: "chef", herkunft: "frances", beleg: w("chef") },
      { indicio: "lugar para guardar el auto", palabra: "garaje", herkunft: "frances", beleg: w("garaje") },
      { indicio: "bocado frito y rebozado", palabra: "croqueta", herkunft: "frances", beleg: w("croqueta") },
      { indicio: "masa redonda al horno", palabra: "pizza", herkunft: "italiano", beleg: w("pizza") },
      { indicio: "instrumento de teclas", palabra: "piano", herkunft: "italiano", beleg: w("piano") },
      { indicio: "instrumento de cuerda con arco", palabra: "violín", herkunft: "italiano", beleg: w("violín") },
      { indicio: "cantar leyendo la letra", palabra: "karaoke", herkunft: "japones", beleg: w("karaoke") },
      { indicio: "leche fermentada", palabra: "yogur", herkunft: "turco", beleg: w("yogur") },
      { indicio: "máquina que hace tareas", palabra: "robot", herkunft: "checo", beleg: w("robot") },
      { indicio: "dulce seco y crujiente", palabra: "galleta", herkunft: "frances", beleg: w("galleta") },
    ] },
  ],
  // ------------------------------------------------------------ teens (12-16)
  teens: [
    { id: "griego-latin", titel: "Raíces griegas y latinas", paare: [
      { indicio: "la planta usa la luz", palabra: "fotosíntesis", herkunft: "griego", beleg: w("fotosíntesis") },
      { indicio: "estudia la vida y su entorno", palabra: "ecología", herkunft: "griego", beleg: w("ecología") },
      { indicio: "capa de aire de la Tierra", palabra: "atmósfera", herkunft: "griego", beleg: w("atmósfera") },
      { indicio: "gobierno del pueblo", palabra: "democracia", herkunft: "griego", beleg: w("democracia") },
      { indicio: "estudia restos antiguos", palabra: "arqueología", herkunft: "griego", beleg: w("arqueología") },
      { indicio: "estudia los fósiles", palabra: "paleontología", herkunft: "griego", beleg: w("paleontología") },
      { indicio: "mitad de la Tierra", palabra: "hemisferio", herkunft: "griego", beleg: w("hemisferio") },
      { indicio: "figura de muchos lados", palabra: "polígono", herkunft: "griego", beleg: w("polígono") },
      { indicio: "significa lo mismo", palabra: "sinónimo", herkunft: "griego", beleg: w("sinónimo") },
      { indicio: "escribir bien las palabras", palabra: "ortografía", herkunft: "griego", beleg: w("ortografía") },
      { indicio: "arte de la letra bonita", palabra: "caligrafía", herkunft: "griego", beleg: w("caligrafía") },
      { indicio: "conversación entre personas", palabra: "diálogo", herkunft: "griego", beleg: w("diálogo") },
      { indicio: "mide el tiempo exacto", palabra: "cronómetro", herkunft: "griego", beleg: w("cronómetro") },
      { indicio: "la historia de una vida", palabra: "biografía", herkunft: "griego", beleg: w("biografía") },
      { indicio: "firma de una persona famosa", palabra: "autógrafo", herkunft: "griego", beleg: w("autógrafo") },
      { indicio: "sin nombre conocido", palabra: "anónimo", herkunft: "griego", beleg: w("anónimo") },
      { indicio: "enfermedad que se extiende", palabra: "epidemia", herkunft: "griego", beleg: w("epidemia") },
      { indicio: "gas que respiramos", palabra: "oxígeno", herkunft: "griego", beleg: w("oxígeno") },
      { indicio: "idea que hay que comprobar", palabra: "hipótesis", herkunft: "griego", beleg: w("hipótesis") },
      { indicio: "conduce el agua", palabra: "acueducto", herkunft: "latin", beleg: w("acueducto") },
      { indicio: "estudia figuras y medidas", palabra: "geometría", herkunft: "griego", beleg: w("geometría") },
      { indicio: "medida del contorno", palabra: "perímetro", herkunft: "griego", beleg: w("perímetro") },
      { indicio: "habla dos lenguas", palabra: "bilingüe", herkunft: "latin", beleg: w("bilingüe") },
      { indicio: "reglas de una lengua", palabra: "gramática", herkunft: "griego", beleg: w("gramática") },
      { indicio: "arte de representar obras", palabra: "teatro", herkunft: "griego", beleg: w("teatro") },
    ] },
    { id: "arabe", titel: "Palabras que vienen del árabe", paare: [
      { indicio: "gobierna el municipio", palabra: "alcalde", herkunft: "arabe", beleg: w("alcalde") },
      { indicio: "matemáticas con letras", palabra: "álgebra", herkunft: "arabe", beleg: w("álgebra") },
      { indicio: "cada signo de un número", palabra: "cifra", herkunft: "arabe", beleg: w("cifra") },
      { indicio: "número que no suma nada", palabra: "cero", herkunft: "arabe", beleg: w("cero") },
      { indicio: "techo plano de una casa", palabra: "azotea", herkunft: "arabe", beleg: w("azotea") },
      { indicio: "control en la frontera", palabra: "aduana", herkunft: "arabe", beleg: w("aduana") },
      { indicio: "química antigua y mágica", palabra: "alquimia", herkunft: "arabe", beleg: w("alquimia") },
      { indicio: "pieza que va en diagonal", palabra: "alfil", herkunft: "arabe", beleg: w("alfil") },
      { indicio: "medicina dulce y espesa", palabra: "jarabe", herkunft: "arabe", beleg: w("jarabe") },
      { indicio: "canal para regar", palabra: "acequia", herkunft: "arabe", beleg: w("acequia") },
      { indicio: "rueda que sube agua", palabra: "noria", herkunft: "arabe", beleg: w("noria") },
      { indicio: "signo del correo electrónico", palabra: "arroba", herkunft: "arabe", beleg: w("arroba") },
      { indicio: "flor blanca y perfumada", palabra: "jazmín", herkunft: "arabe", beleg: w("jazmín") },
      { indicio: "hierba del pesto", palabra: "albahaca", herkunft: "arabe", beleg: w("albahaca") },
      { indicio: "baldosa de colores", palabra: "azulejo", herkunft: "arabe", beleg: w("azulejo") },
    ] },
    { id: "america", titel: "Palabras de las lenguas de América", paare: [
      { indicio: "jefe de un pueblo originario", palabra: "cacique", herkunft: "taino", beleg: w("cacique") },
      { indicio: "papa dulce, camote", palabra: "batata", herkunft: "taino", beleg: w("batata") },
      { indicio: "pimiento picante", palabra: "ají", herkunft: "taino", beleg: w("ají") },
      { indicio: "isla pequeña y baja", palabra: "cayo", herkunft: "taino", beleg: w("cayo") },
      { indicio: "tortuga marina de los arrecifes", palabra: "carey", herkunft: "taino", beleg: w("carey") },
      { indicio: "mazorca tierna en los Andes", palabra: "choclo", herkunft: "quechua", beleg: w("choclo") },
      { indicio: "frijol en el Cono Sur", palabra: "poroto", herkunft: "quechua", beleg: w("poroto") },
      { indicio: "aguacate en el Cono Sur", palabra: "palta", herkunft: "quechua", beleg: w("palta") },
      { indicio: "infusión de yerba", palabra: "mate", herkunft: "quechua", beleg: w("mate") },
      { indicio: "flauta andina de caña", palabra: "quena", herkunft: "quechua", beleg: w("quena") },
      { indicio: "grano andino muy nutritivo", palabra: "quinua", herkunft: "quechua", beleg: w("quinua") },
      { indicio: "papa helada y seca", palabra: "chuño", herkunft: "quechua", beleg: w("chuño") },
      { indicio: "salsa de aguacate", palabra: "guacamole", herkunft: "nahuatl", beleg: w("guacamole") },
      { indicio: "masa de maíz envuelta en hojas", palabra: "tamal", herkunft: "nahuatl", beleg: w("tamal") },
      { indicio: "cactus de pencas planas", palabra: "nopal", herkunft: "nahuatl", beleg: w("nopal") },
      { indicio: "mercado al aire libre", palabra: "tianguis", herkunft: "nahuatl", beleg: w("tianguis") },
      { indicio: "campo de maíz", palabra: "milpa", herkunft: "nahuatl", beleg: w("milpa") },
      { indicio: "blusa bordada de Mesoamérica", palabra: "huipil", herkunft: "nahuatl", beleg: w("huipil") },
      { indicio: "cometa de papel en México", palabra: "papalote", herkunft: "nahuatl", beleg: w("papalote") },
      { indicio: "árbol de flores lilas", palabra: "jacarandá", herkunft: "guarani", beleg: w("jacarandá") },
      { indicio: "mate frío del Paraguay", palabra: "tereré", herkunft: "guarani", beleg: w("tereré") },
      { indicio: "encaje fino del Paraguay", palabra: "ñandutí", herkunft: "guarani", beleg: w("ñandutí") },
      { indicio: "flor nacional de Chile", palabra: "copihue", herkunft: "mapudungun", beleg: w("copihue") },
      { indicio: "ratón pequeño en Chile", palabra: "laucha", herkunft: "mapudungun", beleg: w("laucha") },
      { indicio: "cabaña de ramas en el Caribe", palabra: "bohío", herkunft: "taino", beleg: w("bohío") },
    ] },
    { id: "prestamos", titel: "Préstamos de otras lenguas", paare: [
      { indicio: "la mejor marca", palabra: "récord", herkunft: "ingles", beleg: w("récord") },
      { indicio: "tensión nerviosa", palabra: "estrés", herkunft: "ingles", beleg: w("estrés") },
      { indicio: "lista de platos", palabra: "menú", herkunft: "frances", beleg: w("menú") },
      { indicio: "danza clásica", palabra: "ballet", herkunft: "frances", beleg: w("ballet") },
      { indicio: "terreno con flores", palabra: "jardín", herkunft: "frances", beleg: w("jardín") },
      { indicio: "sale de la fachada", palabra: "balcón", herkunft: "italiano", beleg: w("balcón") },
      { indicio: "poema de catorce versos", palabra: "soneto", herkunft: "italiano", beleg: w("soneto") },
      { indicio: "relato largo", palabra: "novela", herkunft: "italiano", beleg: w("novela") },
      { indicio: "dibujo exagerado", palabra: "caricatura", herkunft: "italiano", beleg: w("caricatura") },
      { indicio: "ola gigante tras un sismo", palabra: "tsunami", herkunft: "japones", beleg: w("tsunami") },
      { indicio: "fruta cocida con azúcar", palabra: "mermelada", herkunft: "portugues", beleg: w("mermelada") },
      { indicio: "para llevar platos", palabra: "bandeja", herkunft: "portugues", beleg: w("bandeja") },
      { indicio: "arroz de Valencia", palabra: "paella", herkunft: "catalan", beleg: w("paella") },
      { indicio: "lo contrario de derecha", palabra: "izquierda", herkunft: "vasco", beleg: w("izquierda") },
      { indicio: "pintura que se hace con agua", palabra: "acuarela", herkunft: "italiano", beleg: w("acuarela") },
    ] },
  ],
  // ------------------------------------------------------------ erwachsen
  erwachsen: [
    { id: "griego-latin", titel: "Raíces griegas y latinas", paare: [
      { indicio: "amor a la sabiduría", palabra: "filosofía", herkunft: "griego", beleg: w("filosofía") },
      { indicio: "amor a la humanidad", palabra: "filantropía", herkunft: "griego", beleg: w("filantropía") },
      { indicio: "estudio del ser humano", palabra: "antropología", herkunft: "griego", beleg: w("antropología") },
      { indicio: "miedo a lugares cerrados", palabra: "claustrofobia", herkunft: "griego", beleg: w("claustrofobia") },
      { indicio: "gobierno de los mejores", palabra: "aristocracia", herkunft: "griego", beleg: w("aristocracia") },
      { indicio: "gobierno de unos pocos", palabra: "oligarquía", herkunft: "griego", beleg: w("oligarquía") },
      { indicio: "gobierno de un rey o reina", palabra: "monarquía", herkunft: "griego", beleg: w("monarquía") },
      { indicio: "cambio de forma", palabra: "metamorfosis", herkunft: "griego", beleg: w("metamorfosis") },
      { indicio: "vida en común con beneficio", palabra: "simbiosis", herkunft: "griego", beleg: w("simbiosis") },
      { indicio: "origen de las palabras", palabra: "etimología", herkunft: "griego", beleg: w("etimología") },
      { indicio: "ciudadano del mundo", palabra: "cosmopolita", herkunft: "griego", beleg: w("cosmopolita") },
      { indicio: "epidemia en todo el mundo", palabra: "pandemia", herkunft: "griego", beleg: w("pandemia") },
      { indicio: "falta de ánimo", palabra: "apatía", herkunft: "griego", beleg: w("apatía") },
      { indicio: "usa bien las dos manos", palabra: "ambidiestro", herkunft: "latin", beleg: w("ambidiestro") },
      { indicio: "que todo lo puede", palabra: "omnipotente", herkunft: "latin", beleg: w("omnipotente") },
      { indicio: "que quiere el bien", palabra: "benévolo", herkunft: "latin", beleg: w("benévolo") },
      { indicio: "navegar alrededor", palabra: "circunnavegar", herkunft: "latin", beleg: w("circunnavegar") },
      { indicio: "todos con un mismo ánimo", palabra: "unánime", herkunft: "latin", beleg: w("unánime") },
      { indicio: "de gran ánimo, generoso", palabra: "magnánimo", herkunft: "latin", beleg: w("magnánimo") },
      { indicio: "dominio de uno sobre otros", palabra: "hegemonía", herkunft: "griego", beleg: w("hegemonía") },
      { indicio: "ciencia de clasificar", palabra: "taxonomía", herkunft: "griego", beleg: w("taxonomía") },
      { indicio: "archivo de periódicos", palabra: "hemeroteca", herkunft: "griego", beleg: w("hemeroteca") },
      { indicio: "lugar de juegos", palabra: "ludoteca", herkunft: "latin", beleg: w("ludoteca") },
      { indicio: "habla muchas lenguas", palabra: "políglota", herkunft: "griego", beleg: w("políglota") },
      { indicio: "en muchas lenguas", palabra: "multilingüe", herkunft: "latin", beleg: w("multilingüe") },
    ] },
    { id: "arabe", titel: "Palabras que vienen del árabe", paare: [
      { indicio: "palacio fortificado", palabra: "alcázar", herkunft: "arabe", beleg: w("alcázar") },
      { indicio: "manda la flota", palabra: "almirante", herkunft: "arabe", beleg: w("almirante") },
      { indicio: "oficial de justicia", palabra: "alguacil", herkunft: "arabe", beleg: w("alguacil") },
      { indicio: "persona cualquiera", palabra: "fulano", herkunft: "arabe", beleg: w("fulano") },
      { indicio: "pago por usar algo ajeno", palabra: "alquiler", herkunft: "arabe", beleg: w("alquiler") },
      { indicio: "pared delgada", palabra: "tabique", herkunft: "arabe", beleg: w("tabique") },
      { indicio: "flor del naranjo", palabra: "azahar", herkunft: "arabe", beleg: w("azahar") },
      { indicio: "torre de vigilancia", palabra: "atalaya", herkunft: "arabe", beleg: w("atalaya") },
      { indicio: "dormitorio", palabra: "alcoba", herkunft: "arabe", beleg: w("alcoba") },
      { indicio: "obrero de la construcción", palabra: "albañil", herkunft: "arabe", beleg: w("albañil") },
      { indicio: "entrada de la casa", palabra: "zaguán", herkunft: "arabe", beleg: w("zaguán") },
      { indicio: "casualidad", palabra: "azar", herkunft: "arabe", beleg: w("azar") },
      { indicio: "depósito de agua de lluvia", palabra: "aljibe", herkunft: "arabe", beleg: w("aljibe") },
      { indicio: "instrumento de cuerda", palabra: "laúd", herkunft: "arabe", beleg: w("laúd") },
      { indicio: "gritería confusa", palabra: "algarabía", herkunft: "arabe", beleg: w("algarabía") },
    ] },
    { id: "america", titel: "Palabras de las lenguas de América", paare: [
      { indicio: "embarcación larga y estrecha", palabra: "piragua", herkunft: "caribe", beleg: w("piragua") },
      { indicio: "arma de madera dura", palabra: "macana", herkunft: "taino", beleg: w("macana") },
      { indicio: "mal de altura", palabra: "soroche", herkunft: "quechua", beleg: w("soroche") },
      { indicio: "lo que se da de regalo", palabra: "yapa", herkunft: "quechua", beleg: w("yapa") },
      { indicio: "pasta de maíz en chala", palabra: "humita", herkunft: "quechua", beleg: w("humita") },
      { indicio: "guiso andino de maíz", palabra: "locro", herkunft: "quechua", beleg: w("locro") },
      { indicio: "semilla que tiñe de rojo", palabra: "achiote", herkunft: "nahuatl", beleg: w("achiote") },
      { indicio: "abrazar con cariño", palabra: "apapachar", herkunft: "nahuatl", beleg: w("apapachar") },
      { indicio: "amigo en México", palabra: "cuate", herkunft: "nahuatl", beleg: w("cuate") },
      { indicio: "mortero de piedra", palabra: "molcajete", herkunft: "nahuatl", beleg: w("molcajete") },
      { indicio: "destilado de agave", palabra: "mezcal", herkunft: "nahuatl", beleg: w("mezcal") },
      { indicio: "caldo de maíz", palabra: "pozole", herkunft: "nahuatl", beleg: w("pozole") },
      { indicio: "jaguar en el Paraguay", palabra: "yaguareté", herkunft: "guarani", beleg: w("yaguareté") },
      { indicio: "fruto de pulpa dulce", palabra: "zapote", herkunft: "nahuatl", beleg: w("zapote") },
      { indicio: "pájaro de muchos cantos", palabra: "cenzontle", herkunft: "nahuatl", beleg: w("cenzontle") },
      { indicio: "terreno para jugar a la pelota", palabra: "cancha", herkunft: "quechua", beleg: w("cancha") },
      { indicio: "fiesta, bulla", palabra: "mitote", herkunft: "nahuatl", beleg: w("mitote") },
      { indicio: "insecto que come madera", palabra: "comején", herkunft: "taino", beleg: w("comején") },
      { indicio: "insecto luminoso del Caribe", palabra: "cocuyo", herkunft: "taino", beleg: w("cocuyo") },
      { indicio: "tienda de campaña", palabra: "carpa", herkunft: "quechua", beleg: w("carpa") },
      { indicio: "armadillo en el sur", palabra: "tatú", herkunft: "guarani", beleg: w("tatú") },
      { indicio: "suena al agitarla", palabra: "maraca", herkunft: "guarani", beleg: w("maraca") },
      { indicio: "bebé en los Andes", palabra: "guagua", herkunft: "quechua", beleg: w("guagua") },
      { indicio: "felino de piel con manchas", palabra: "ocelote", herkunft: "nahuatl", beleg: w("ocelote") },
      { indicio: "abono de las aves marinas", palabra: "guano", herkunft: "quechua", beleg: w("guano") },
    ] },
    { id: "prestamos", titel: "Préstamos de otras lenguas", paare: [
      { indicio: "frase de publicidad", palabra: "eslogan", herkunft: "ingles", beleg: w("eslogan") },
      { indicio: "reunión política", palabra: "mitin", herkunft: "ingles", beleg: w("mitin") },
      { indicio: "rechazo organizado", palabra: "boicot", herkunft: "ingles", beleg: w("boicot") },
      { indicio: "avenida con árboles", palabra: "bulevar", herkunft: "frances", beleg: w("bulevar") },
      { indicio: "contorno de una figura", palabra: "silueta", herkunft: "frances", beleg: w("silueta") },
      { indicio: "joyas de imitación", palabra: "bisutería", herkunft: "frances", beleg: w("bisutería") },
      { indicio: "fracaso total", palabra: "fiasco", herkunft: "italiano", beleg: w("fiasco") },
      { indicio: "quiebra de un negocio", palabra: "bancarrota", herkunft: "italiano", beleg: w("bancarrota") },
      { indicio: "habla mucho y engaña", palabra: "charlatán", herkunft: "italiano", beleg: w("charlatán") },
      { indicio: "fiesta de disfraces", palabra: "carnaval", herkunft: "italiano", beleg: w("carnaval") },
      { indicio: "hierro viejo", palabra: "chatarra", herkunft: "vasco", beleg: w("chatarra") },
      { indicio: "reunión de brujas", palabra: "aquelarre", herkunft: "vasco", beleg: w("aquelarre") },
      { indicio: "se lee igual al revés", palabra: "capicúa", herkunft: "catalan", beleg: w("capicúa") },
      { indicio: "donde se ven las imágenes", palabra: "pantalla", herkunft: "catalan", beleg: w("pantalla") },
      { indicio: "mampara plegable", palabra: "biombo", herkunft: "japones", beleg: w("biombo") },
    ] },
  ],
};

/** Die Zeile eines Paares: zuerst die Umschreibung, dann das Wort. */
export function raizZeile(p: RaizPaar): string {
  return `${p.indicio} - ${p.palabra}`;
}

/**
 * Dieselben Wörter, alphabetisch nach `indicio` (spanische Sortierung: ñ nach n,
 * Bauplan Falle 5) - für den Reto, wie `RACINES_ALPHABETISCH` (racines.ts).
 */
export const RAICES_ALPHABETISCH: Record<RaizStufe, string[]> = Object.fromEntries(
  (Object.keys(RAICES) as RaizStufe[]).map((stufe) => [
    stufe,
    RAICES[stufe]
      .flatMap((t) => t.paare)
      .slice()
      .sort((a, b) => a.indicio.localeCompare(b.indicio, "es"))
      .map(raizZeile),
  ]),
) as Record<RaizStufe, string[]>;
