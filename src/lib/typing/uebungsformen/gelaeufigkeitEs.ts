/**
 * ★ ES-W (27.09.2026): die häufigen Buchstabenverbindungen des Spanischen für
 * das Geläufigkeitsschreiben (`gelaeufigkeit.ts`) - neu gewählt, nicht
 * übertragen. Gemessen an den spanischen Korpuszeilen (`CORPUS_ES`, 3.281
 * Wörter, 27.09.2026): oben stehen *la, en, el, de, es, al, as, os, an, ar,
 * er, ue, ll, st, ci, tr* und *las, lla, ent, est, ell, ada, ado, que, cue,
 * uen, uer, tra, tre*, bei den Vierern *ella, uela, ción, illa*. Dazu die
 * Laute, die im Spanischen aus zwei Buchstaben bestehen (*ll, rr, ch, qu,
 * gu*), die ñ-Silben (*ña, ño*), die häufigen Endungen (*ción, mente, ado,
 * ido, dad, dor, ero, ito, eza, ón*) und Anfänge (*es, tr, pl, br, pr, gr*).
 * Dieselbe Fingerfolge mehrmals kurz hintereinander ist genau das, was
 * Zehnfingerschreiben automatisiert.
 *
 * Alle Wörter klein (spanische Nomen werden nicht grossgeschrieben), echte
 * Alltagswörter, RAE 2010. Akzente sind erlaubt: `gelaeufigkeit.ts` prüft mit
 * dem Weg, ein Wort mit „ó" kommt also erst, wenn `´` und `o` gelernt sind,
 * und nie ohne Akzent. Nichts aus der Sperrliste
 * (`scripts/messe-worthaeufigkeit-es.py` - darum kein *pollo*, *coche*,
 * *película*).
 */
import type { Verbindung } from "./gelaeufigkeit";

export const VERBINDUNGEN_ES: Verbindung[] = [
  { folge: "ue", stelle: "mitte", woerter: ["puerta", "fuego", "nuevo", "bueno", "escuela", "huevo", "pueblo", "cuento", "suelo", "fuente"] },
  { folge: "ie", stelle: "mitte", woerter: ["tierra", "siete", "nieve", "fiesta", "viento", "diente", "cielo", "piedra", "tiempo", "pierna"] },
  { folge: "ll", stelle: "mitte", woerter: ["calle", "silla", "estrella", "amarillo", "caballo", "gallina", "anillo", "cuello", "galleta", "semilla"] },
  { folge: "rr", stelle: "mitte", woerter: ["perro", "carro", "tierra", "torre", "arroz", "burro", "gorra", "guitarra", "barro", "zorro"] },
  { folge: "ch", stelle: "mitte", woerter: ["noche", "leche", "ocho", "mucho", "techo", "mochila", "cuchara", "hecho", "pecho", "ancho"] },
  { folge: "que", stelle: "mitte", woerter: ["queso", "pequeño", "parque", "bosque", "querer", "raqueta", "etiqueta", "quedar", "paquete"] },
  { folge: "gu", stelle: "mitte", woerter: ["agua", "guitarra", "juguete", "guante", "gusano", "lengua", "águila", "seguro", "iguana"] },
  { folge: "ña", stelle: "ende", woerter: ["montaña", "araña", "pestaña", "piña", "uña", "castaña", "caña", "cabaña", "leña", "seña"] },
  { folge: "ño", stelle: "ende", woerter: ["año", "niño", "baño", "sueño", "otoño", "pequeño", "dueño", "moño", "puño", "diseño"] },
  { folge: "ción", stelle: "ende", woerter: ["canción", "estación", "lección", "atención", "solución", "habitación", "función", "emoción"] },
  { folge: "mente", stelle: "ende", woerter: ["rápidamente", "lentamente", "solamente", "claramente", "tranquilamente", "finalmente", "realmente", "felizmente"] },
  { folge: "ado", stelle: "ende", woerter: ["helado", "pescado", "mercado", "lado", "cansado", "dorado", "soldado", "tejado", "prado", "encantado"] },
  { folge: "ido", stelle: "ende", woerter: ["vestido", "ruido", "nido", "sonido", "partido", "querido", "dormido", "perdido", "divertido"] },
  { folge: "dad", stelle: "ende", woerter: ["ciudad", "verdad", "edad", "bondad", "felicidad", "universidad", "velocidad", "comunidad", "realidad"] },
  { folge: "dor", stelle: "ende", woerter: ["comedor", "jugador", "ganador", "pescador", "trabajador", "corredor", "nadador", "mirador"] },
  { folge: "ero", stelle: "ende", woerter: ["panadero", "cartero", "bombero", "jardinero", "granjero", "zapatero", "dinero", "sombrero", "primero", "enero"] },
  { folge: "ito", stelle: "ende", woerter: ["gatito", "perrito", "poquito", "ratito", "cafecito", "hermanito", "bonito", "grito", "mosquito"] },
  { folge: "eza", stelle: "ende", woerter: ["cabeza", "belleza", "tristeza", "naturaleza", "limpieza", "pereza", "grandeza", "certeza"] },
  { folge: "ón", stelle: "ende", woerter: ["corazón", "ratón", "balón", "jabón", "avión", "camión", "limón", "melón", "botón", "cajón"] },
  { folge: "illa", stelle: "ende", woerter: ["silla", "rodilla", "ardilla", "mantequilla", "semilla", "orilla", "tortilla", "zapatilla", "maravilla"] },
  { folge: "uela", stelle: "ende", woerter: ["escuela", "abuela", "cazuela", "suela", "ciruela", "muela", "tachuela"] },
  { folge: "mbre", stelle: "ende", woerter: ["hombre", "nombre", "hambre", "cumbre", "costumbre", "septiembre", "noviembre", "diciembre", "alambre"] },
  { folge: "mp", stelle: "mitte", woerter: ["campo", "tiempo", "lámpara", "siempre", "compra", "limpio", "empezar", "trompeta", "campana"] },
  { folge: "es", stelle: "anfang", woerter: ["escuela", "estrella", "espejo", "escalera", "estación", "espalda", "esquina", "estufa", "espuma"] },
  { folge: "tr", stelle: "anfang", woerter: ["tren", "tres", "trigo", "tronco", "trompo", "truco", "trabajo", "trece", "trompeta"] },
  { folge: "pl", stelle: "anfang", woerter: ["playa", "plato", "planta", "pluma", "plaza", "plátano", "planeta", "plata"] },
  { folge: "br", stelle: "anfang", woerter: ["brazo", "brillo", "brisa", "broma", "brocha", "brújula", "brinco", "brasa"] },
  { folge: "pr", stelle: "anfang", woerter: ["primo", "precio", "prado", "pronto", "premio", "primavera", "pregunta", "profesor"] },
  { folge: "gr", stelle: "anfang", woerter: ["grande", "gris", "grillo", "grupo", "granja", "grito", "gracias", "granizo"] },
  { folge: "cr", stelle: "anfang", woerter: ["crema", "cruz", "cristal", "cráter", "crecer", "croqueta", "crudo", "crayón"] },
  { folge: "st", stelle: "mitte", woerter: ["fiesta", "cesta", "costa", "pasta", "castillo", "cuesta", "respuesta", "pastel", "gusto"] },
];
