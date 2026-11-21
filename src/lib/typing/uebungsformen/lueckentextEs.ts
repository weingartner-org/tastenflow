/**
 * ★ ES-W (27.09.2026): die Lückentext-Rätsel des Weges „es" - „Texto con
 * huecos". Neu auf Spanisch geschrieben, nicht übersetzt; Aufbau wie
 * `RAETSEL_DE`/`RAETSEL_FR` (Satz mit Lücke `...`, alle gleich guten
 * Lösungen, Altersstufen).
 *
 * Regeln (Wächter `tests/tastenflow-wortspiele-es.test.ts`):
 *  · Lösbar aus dem Satz, ohne Bild und ohne Wissen, das nur ein sehendes Kind
 *    hat (keine Farben).
 *  · Lösungen dürfen Akzente (á é í ó ú) und ñ tragen - `lueckentext.ts`
 *    prüft mit dem Weg, ein Rätsel mit „canción" kommt also erst, wenn `´`
 *    UND `o` gelernt sind, und nie ohne Akzent. Kein Grossbuchstabe mit Akzent
 *    am Wortanfang (Ávila) - zwei Totasten-Schritte plus Mayús.
 *  · Spanien UND Lateinamerika: Orte, Speisen, Feste, Tiere aus der ganzen
 *    spanischsprachigen Welt; Wörter mit Landesunterschied haben ALLE Formen
 *    als Lösung (*papas/patatas, aguacate/palta, arquero/portero*).
 *  · Neutrales Spanisch: kein *coger*, keine Spanien-Umgangssprache, keine
 *    Wörter der Sperrliste (`scripts/messe-worthaeufigkeit-es.py`,
 *    SPERR_WOERTER und SPERR_STAEMME - darum z. B. kein *pollo*, *película*,
 *    *pájaro* nur mit Akzent, *coche/móvil/zumo/gafas/ordenador* nie).
 *  · Nichts gegen ein Kind, kulturell ruhig, RAE-Ortografía 2010.
 */
import type { Raetsel } from "./lueckentext";

const ALLE: Raetsel["stufen"] = ["kids", "teens", "erwachsen"];
const AB_TEENS: Raetsel["stufen"] = ["teens", "erwachsen"];

export const RAETSEL_ES: Raetsel[] = [
  // --- Los animales ---
  { satz: "La jirafa tiene el ... muy largo.", loesungen: ["cuello"], stufen: ALLE },
  { satz: "El elefante toma agua con la ...", loesungen: ["trompa"], stufen: ALLE },
  { satz: "Las abejas fabrican la ...", loesungen: ["miel"], stufen: ALLE },
  { satz: "El erizo tiene el cuerpo cubierto de ...", loesungen: ["púas", "espinas"], stufen: ALLE },
  { satz: "El conejo tiene las ... muy largas.", loesungen: ["orejas"], stufen: ALLE },
  { satz: "Cuando tiene miedo, la tortuga se esconde en su ...", loesungen: ["caparazón"], stufen: ALLE },
  { satz: "Al león lo llaman el rey de la ...", loesungen: ["selva"], stufen: ALLE },
  { satz: "El búho duerme de día y caza de ...", loesungen: ["noche"], stufen: ALLE },
  { satz: "El pingüino no vuela, pero sabe ... muy bien.", loesungen: ["nadar"], stufen: ALLE },
  { satz: "La araña tiene ocho ...", loesungen: ["patas", "ojos"], stufen: ALLE },
  { satz: "La vaca nos da la ...", loesungen: ["leche"], stufen: ALLE },
  { satz: "La gallina pone ...", loesungen: ["huevos"], stufen: ALLE },
  { satz: "Al gato le gusta cazar ...", loesungen: ["ratones", "pájaros"], stufen: ALLE },
  { satz: "La oruga se convierte un día en ...", loesungen: ["mariposa"], stufen: ALLE },
  { satz: "El renacuajo se convierte en ...", loesungen: ["rana", "sapo"], stufen: ALLE },
  { satz: "Cuando está contento, el perro mueve la ...", loesungen: ["cola"], stufen: ALLE },
  { satz: "El gallo canta muy temprano por la ...", loesungen: ["mañana"], stufen: ALLE },
  { satz: "La tortuga camina muy ...", loesungen: ["despacio", "lento"], stufen: ALLE },
  { satz: "El canguro lleva a su cría en una ...", loesungen: ["bolsa"], stufen: ALLE },
  { satz: "Los pájaros construyen un ... para sus huevos.", loesungen: ["nido"], stufen: ALLE },
  { satz: "El colibrí mueve las ... muy rápido.", loesungen: ["alas"], stufen: ALLE },
  { satz: "A los monos les encanta comer ...", loesungen: ["plátanos", "bananas", "bananos"], stufen: ALLE },
  { satz: "Los delfines viven en el ...", loesungen: ["mar", "océano", "río"], stufen: ALLE },
  { satz: "La lana suave de los Andes viene de la alpaca y de la ...", loesungen: ["llama", "vicuña"], stufen: ALLE },
  { satz: "El caballo come ...", loesungen: ["pasto", "hierba", "heno"], stufen: ALLE },
  { satz: "El perezoso cuelga de las ramas y se mueve muy ...", loesungen: ["despacio", "lento"], stufen: ALLE },
  { satz: "El cóndor vuela muy alto sobre la cordillera de los ...", loesungen: ["Andes"], stufen: AB_TEENS },
  { satz: "El pez respira bajo el agua con sus ...", loesungen: ["branquias"], stufen: AB_TEENS },
  { satz: "El camello guarda grasa en sus ...", loesungen: ["jorobas"], stufen: AB_TEENS },
  { satz: "El camaleón puede cambiar de ...", loesungen: ["color"], stufen: AB_TEENS },
  { satz: "La ballena no es un pez, es un ...", loesungen: ["mamífero"], stufen: AB_TEENS },
  { satz: "El jaguar es el felino más grande de ...", loesungen: ["América"], stufen: AB_TEENS },
  { satz: "El quetzal es el ave nacional de ...", loesungen: ["Guatemala"], stufen: AB_TEENS },
  { satz: "Las tortugas gigantes viven en las islas ..., en Ecuador.", loesungen: ["Galápagos"], stufen: AB_TEENS },
  { satz: "El lince ibérico es un felino que vive sobre todo en ...", loesungen: ["España"], stufen: AB_TEENS },
  { satz: "El ajolote es un anfibio que vive en los canales de Xochimilco, en ...", loesungen: ["México"], stufen: AB_TEENS },

  // --- La naturaleza y el tiempo ---
  { satz: "En invierno, a veces cae ...", loesungen: ["nieve"], stufen: ALLE },
  { satz: "En otoño, los árboles pierden sus ...", loesungen: ["hojas"], stufen: ALLE },
  { satz: "Las plantas necesitan agua y ...", loesungen: ["luz", "sol"], stufen: ALLE },
  { satz: "El sol sale por la mañana y se pone por la ...", loesungen: ["tarde", "noche"], stufen: ALLE },
  { satz: "De noche vemos la luna y las ...", loesungen: ["estrellas"], stufen: ALLE },
  { satz: "Cuando hay truenos y relámpagos, hay una ...", loesungen: ["tormenta"], stufen: ALLE },
  { satz: "El hielo se derrite cuando hace ...", loesungen: ["calor"], stufen: ALLE },
  { satz: "El arcoíris sale cuando hay sol y ...", loesungen: ["lluvia"], stufen: ALLE },
  { satz: "Cuando el agua se congela, se convierte en ...", loesungen: ["hielo"], stufen: ALLE },
  { satz: "En la playa, el viento forma ... en el mar.", loesungen: ["olas"], stufen: ALLE },
  { satz: "La primavera, el verano, el otoño y el invierno son las cuatro ... del año.", loesungen: ["estaciones"], stufen: ALLE },
  { satz: "Un volcán echa humo, ceniza y ...", loesungen: ["lava"], stufen: AB_TEENS },
  { satz: "El río más largo de América del Sur es el ...", loesungen: ["Amazonas"], stufen: AB_TEENS },
  { satz: "El desierto de Atacama, en Chile, es uno de los lugares más ... del mundo.", loesungen: ["secos", "áridos"], stufen: AB_TEENS },
  { satz: "El lago Titicaca está entre Perú y ...", loesungen: ["Bolivia"], stufen: AB_TEENS },
  { satz: "Las cataratas del Iguazú están entre Argentina y ...", loesungen: ["Brasil"], stufen: AB_TEENS },
  { satz: "La montaña más alta de América es el ...", loesungen: ["Aconcagua"], stufen: AB_TEENS },

  // --- El cuerpo ---
  { satz: "Vemos con los ...", loesungen: ["ojos"], stufen: ALLE },
  { satz: "Oímos con los ...", loesungen: ["oídos", "orejas"], stufen: ALLE },
  { satz: "Olemos con la ...", loesungen: ["nariz"], stufen: ALLE },
  { satz: "Masticamos la comida con los ...", loesungen: ["dientes"], stufen: ALLE },
  { satz: "En cada mano tenemos cinco ...", loesungen: ["dedos"], stufen: ALLE },
  { satz: "La rodilla está en la mitad de la ...", loesungen: ["pierna"], stufen: ALLE },
  { satz: "El corazón mueve la ... por todo el cuerpo.", loesungen: ["sangre"], stufen: ALLE },
  { satz: "Respiramos con los ...", loesungen: ["pulmones"], stufen: ALLE },
  { satz: "Pensamos y recordamos con el ...", loesungen: ["cerebro"], stufen: AB_TEENS },

  // --- La comida de muchos países ---
  { satz: "En España, la tortilla se hace con huevos y ...", loesungen: ["patatas", "papas"], stufen: ALLE },
  { satz: "En México, las tortillas para los tacos se hacen de ...", loesungen: ["maíz", "harina"], stufen: ALLE },
  { satz: "El guacamole se prepara con ...", loesungen: ["aguacate", "palta"], stufen: ALLE },
  { satz: "En Venezuela y en Colombia se comen ... de maíz.", loesungen: ["arepas"], stufen: ALLE },
  { satz: "La paella de Valencia es un plato de ...", loesungen: ["arroz"], stufen: ALLE },
  { satz: "Muchos niños mojan los churros en chocolate ...", loesungen: ["caliente"], stufen: ALLE },
  { satz: "El chocolate se hace con las semillas del ...", loesungen: ["cacao"], stufen: ALLE },
  { satz: "El pan se hace con agua, sal, levadura y ...", loesungen: ["harina"], stufen: ALLE },
  { satz: "Para hacer limonada necesitas agua, azúcar y ...", loesungen: ["limón", "limones"], stufen: ALLE },
  { satz: "El queso se hace con ...", loesungen: ["leche"], stufen: ALLE },
  { satz: "Tomamos la sopa con una ...", loesungen: ["cuchara"], stufen: ALLE },
  { satz: "En Argentina y en Chile, las ... se rellenan de carne o de queso.", loesungen: ["empanadas"], stufen: ALLE },
  { satz: "En Argentina y en Uruguay, mucha gente toma ... con una bombilla.", loesungen: ["mate"], stufen: AB_TEENS },
  { satz: "El ceviche de Perú se prepara con pescado y jugo de ...", loesungen: ["limón", "lima"], stufen: AB_TEENS },
  { satz: "En Argentina y en Chile, a la fresa la llaman ...", loesungen: ["frutilla"], stufen: AB_TEENS },
  { satz: "La papa se cultivó por primera vez en los ...", loesungen: ["Andes"], stufen: AB_TEENS },

  // --- Fiestas, música y deporte ---
  { satz: "En los cumpleaños, los niños rompen una ... llena de dulces.", loesungen: ["piñata"], stufen: ALLE },
  { satz: "En el cumpleaños soplamos las ... del pastel.", loesungen: ["velas"], stufen: ALLE },
  { satz: "La guitarra tiene seis ...", loesungen: ["cuerdas"], stufen: ALLE },
  { satz: "Las maracas suenan cuando las ...", loesungen: ["agitas", "sacudes", "mueves"], stufen: ALLE },
  { satz: "El mariachi es una música típica de ...", loesungen: ["México"], stufen: ALLE },
  { satz: "Para jugar al fútbol, el entrenador trae dos ...", loesungen: ["balones", "pelotas"], stufen: ALLE },
  { satz: "En el fútbol, el jugador que para los tiros es el ...", loesungen: ["portero", "arquero"], stufen: ALLE },
  { satz: "Cuando la pelota entra en la meta, es ...", loesungen: ["gol"], stufen: ALLE },
  { satz: "Un equipo de fútbol juega con once ...", loesungen: ["jugadores"], stufen: ALLE },
  { satz: "Para jugar al tenis se necesita una ...", loesungen: ["raqueta"], stufen: ALLE },
  { satz: "El ciclista corre montado en su ...", loesungen: ["bicicleta", "bici"], stufen: ALLE },
  { satz: "El Día de Muertos es una fiesta famosa de ...", loesungen: ["México"], stufen: AB_TEENS },
  { satz: "En la Tomatina de Buñol, la gente se lanza ...", loesungen: ["tomates"], stufen: AB_TEENS },
  { satz: "El tango nació a orillas del Río de la Plata, en Buenos Aires y en ...", loesungen: ["Montevideo"], stufen: AB_TEENS },
  { satz: "El flamenco es un baile y un cante del sur de ...", loesungen: ["España"], stufen: AB_TEENS },
  { satz: "El béisbol es muy popular en Cuba, en Venezuela y en la República ...", loesungen: ["Dominicana"], stufen: AB_TEENS },
  { satz: "El Inti Raymi, la fiesta del Sol, se celebra en Cusco, en ...", loesungen: ["Perú"], stufen: AB_TEENS },

  // --- La lengua y la escuela ---
  { satz: "La letra ñ se llama ...", loesungen: ["eñe"], stufen: ALLE },
  { satz: "El abecedario del español tiene veintisiete ...", loesungen: ["letras"], stufen: ALLE },
  { satz: "Las preguntas en español llevan dos signos de ...", loesungen: ["interrogación"], stufen: AB_TEENS },
  { satz: "El acento que se escribe sobre una vocal se llama ...", loesungen: ["tilde"], stufen: AB_TEENS },
  { satz: "El español también se llama ...", loesungen: ["castellano"], stufen: AB_TEENS },
  { satz: "Las palabras tomate y aguacate vienen del ..., una lengua de México.", loesungen: ["náhuatl"], stufen: AB_TEENS },
  { satz: "El plural de lápiz es ...", loesungen: ["lápices"], stufen: AB_TEENS },
  { satz: "Llevamos los libros a la escuela en la ...", loesungen: ["mochila"], stufen: ALLE },
  { satz: "Lo que usamos para borrar el lápiz se llama ...", loesungen: ["goma", "borrador"], stufen: ALLE },
  { satz: "La tabla grande donde la maestra escribe con tiza se llama ...", loesungen: ["pizarra", "pizarrón", "tablero"], stufen: ALLE },
  { satz: "Para escribir con tinta usamos ...", loesungen: ["bolígrafo", "lapicero", "esfero", "birome", "pluma", "boli"], stufen: ALLE },
  { satz: "Los libros prestados se sacan de la ...", loesungen: ["biblioteca"], stufen: ALLE },
  { satz: "La pausa entre dos clases se llama ...", loesungen: ["recreo"], stufen: ALLE },
  { satz: "Para cortar papel usamos unas ...", loesungen: ["tijeras"], stufen: ALLE },
  { satz: "El diccionario explica el significado de las ...", loesungen: ["palabras"], stufen: ALLE },
  { satz: "Lo contrario de frío es ...", loesungen: ["caliente"], stufen: ALLE },
  { satz: "Lo contrario de alto es ...", loesungen: ["bajo"], stufen: ALLE },
  { satz: "Lo contrario de día es ...", loesungen: ["noche"], stufen: ALLE },
  { satz: "Lo contrario de abrir es ...", loesungen: ["cerrar"], stufen: ALLE },
  { satz: "Lo contrario de subir es ...", loesungen: ["bajar"], stufen: ALLE },

  // --- El teclado y el braille ---
  { satz: "La tecla más larga del teclado es la barra ...", loesungen: ["espaciadora"], stufen: ALLE },
  { satz: "Para escribir una letra ... pulsamos la tecla Mayús.", loesungen: ["mayúscula"], stufen: ALLE },
  { satz: "Para borrar la letra de antes del cursor pulsamos la tecla de ...", loesungen: ["retroceso"], stufen: ALLE },
  { satz: "En braille, cada letra se forma con ...", loesungen: ["puntos"], stufen: ALLE },
  { satz: "El braille se lee con las yemas de los ...", loesungen: ["dedos"], stufen: ALLE },
  { satz: "Un lector de pantalla lee el texto en voz ...", loesungen: ["alta"], stufen: ALLE },
  { satz: "Escribir con los diez dedos sin mirar el teclado se llama ...", loesungen: ["mecanografía"], stufen: AB_TEENS },
  { satz: "El sistema de lectura con puntos lleva el nombre de Louis ...", loesungen: ["Braille"], stufen: AB_TEENS },

  // --- La vida de todos los días ---
  { satz: "Llamamos a nuestros amigos por ...", loesungen: ["teléfono", "celular", "móvil"], stufen: ALLE },
  { satz: "Los bomberos apagan el ...", loesungen: ["fuego", "incendio"], stufen: ALLE },
  { satz: "El médico cuida a los ...", loesungen: ["enfermos", "pacientes"], stufen: ALLE },
  { satz: "El tren va por las ...", loesungen: ["vías"], stufen: ALLE },
  { satz: "El avión vuela por el ...", loesungen: ["cielo", "aire"], stufen: ALLE },
  { satz: "El barco navega por el ...", loesungen: ["mar", "río"], stufen: ALLE },
  { satz: "El reloj nos dice la ...", loesungen: ["hora"], stufen: ALLE },
  { satz: "Para abrir la puerta necesitamos una ...", loesungen: ["llave"], stufen: ALLE },
  { satz: "Por la noche dormimos en la ...", loesungen: ["cama"], stufen: ALLE },
  { satz: "Nos lavamos las manos con agua y ...", loesungen: ["jabón"], stufen: ALLE },
  { satz: "Cuando llueve, abrimos el ...", loesungen: ["paraguas"], stufen: ALLE },
  { satz: "Una semana tiene siete ...", loesungen: ["días"], stufen: ALLE },
  { satz: "Un año tiene doce ...", loesungen: ["meses"], stufen: ALLE },
  { satz: "Un día tiene veinticuatro ...", loesungen: ["horas"], stufen: ALLE },
  { satz: "El mes que viene después de enero es ...", loesungen: ["febrero"], stufen: ALLE },
  { satz: "El día que viene después del domingo es el ...", loesungen: ["lunes"], stufen: ALLE },
  { satz: "El aparato que guarda fría la leche se llama ...", loesungen: ["refrigerador", "refri", "frigorífico", "nevera", "heladera"], stufen: ALLE },
  { satz: "Mis abuelos son los padres de mi ...", loesungen: ["papá", "mamá", "padre", "madre"], stufen: ALLE },
  { satz: "El cartero nos trae las ...", loesungen: ["cartas"], stufen: ALLE },
  { satz: "El bebé duerme en la ...", loesungen: ["cuna"], stufen: ALLE },
  { satz: "En México y en Colombia, al automóvil lo llaman ...", loesungen: ["carro"], stufen: AB_TEENS },
  { satz: "En Cuba y en Canarias, al autobús lo llaman ...", loesungen: ["guagua"], stufen: AB_TEENS },
  { satz: "En México, a la piscina la llaman ...", loesungen: ["alberca"], stufen: AB_TEENS },

  // --- Las capitales y los lugares ---
  { satz: "La capital de España es ...", loesungen: ["Madrid"], stufen: ALLE },
  { satz: "La capital de Perú es ...", loesungen: ["Lima"], stufen: ALLE },
  { satz: "La capital de Colombia es ...", loesungen: ["Bogotá"], stufen: AB_TEENS },
  { satz: "La capital de Chile es ...", loesungen: ["Santiago"], stufen: AB_TEENS },
  { satz: "La capital de Ecuador es ...", loesungen: ["Quito"], stufen: AB_TEENS },
  { satz: "La capital de Cuba es La ...", loesungen: ["Habana"], stufen: AB_TEENS },
  { satz: "La capital de Uruguay es ...", loesungen: ["Montevideo"], stufen: AB_TEENS },
  { satz: "La capital de Paraguay es ...", loesungen: ["Asunción"], stufen: AB_TEENS },
  { satz: "La capital de Venezuela es ...", loesungen: ["Caracas"], stufen: AB_TEENS },
  { satz: "La capital de Argentina es Buenos ...", loesungen: ["Aires"], stufen: AB_TEENS },
  { satz: "La capital de Costa Rica es San ...", loesungen: ["José"], stufen: AB_TEENS },
  { satz: "La ciudad inca de Machu Picchu está en ...", loesungen: ["Perú"], stufen: AB_TEENS },
  { satz: "La isla de Pascua pertenece a ...", loesungen: ["Chile"], stufen: AB_TEENS },
  { satz: "Las islas Canarias están en el océano ...", loesungen: ["Atlántico"], stufen: AB_TEENS },
  { satz: "Entre España y Francia están los montes ...", loesungen: ["Pirineos"], stufen: AB_TEENS },
  { satz: "El canal de Panamá une el océano Atlántico con el océano ...", loesungen: ["Pacífico"], stufen: AB_TEENS },
  { satz: "La Alhambra es un palacio de la ciudad de ...", loesungen: ["Granada"], stufen: AB_TEENS },
  { satz: "Las islas Baleares están en el mar ...", loesungen: ["Mediterráneo"], stufen: AB_TEENS },
  { satz: "El país con más hablantes de español del mundo es ...", loesungen: ["México"], stufen: AB_TEENS },
];
