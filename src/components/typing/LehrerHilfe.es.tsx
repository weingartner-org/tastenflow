/**
 * ★★★ ES-O (27.09.2026): DAS HILFE-FENSTER FÜR LEHRKRÄFTE, SPANISCH.
 * ===========================================================================
 * Aus der Funktion geschrieben, in derselben Reihenfolge wie die deutsche,
 * englische und französische Fassung (1 bis 12, samt 4a, 8a, 8b) - wer eine
 * Stelle prüft, findet sie in allen vier. Sichtbar nur mit
 * `spracheGewaehlt === "es"` (`LehrerHilfe.tsx`).
 *
 * ── ANREDE (Bauplan S9) ─────────────────────────────────────────────────────
 * Immer **usted** - Lehrkraft-Bereich. Geschlechtergerecht über Sammelwörter
 * („el alumnado", „cada estudiante", „la persona docente", S10), nie -e/-x/@.
 *
 * ── WAS SPANISCH ANDERS IST ─────────────────────────────────────────────────
 *  · Die Score-Erklärung und der Kurven-Hinweis kommen aus den spanischen
 *    Konstanten (`SCORE_ERKLAERUNG_USTED_ES`, `STEIGERUNG_HINWEIS_ES`).
 *  · Die Grundreihe (Abschnitt 4) kommt aus `LERNWEGE.es` - sie trägt schon
 *    einen Vokal (A) und die Ñ; vor Mayús kommt die Tilde-Totaste.
 *  · Abschnitt 12: ein spanisches Handbuch und ein spanisches Plakat gibt es
 *    noch nicht - `HandbuchKnopf` lädt für „es" die ENGLISCHE Ausgabe, und
 *    der Text sagt das (offen, siehe BEFUND-2026-09-27-ES-O-OBERFLAECHE.md).
 *
 * Glossar Bauplan §7 wörtlich; Namen wie in der spanischen Oberfläche
 * (*Reto*, *Texto de la clase*, *Competición de la clase*, *Objetivo
 * semanal*, *Configuración de la clase*, *Bloquear la hora*, *Mis clases*,
 * *Teclas inseguras*, *Autonomía*). Nur Bindestrich, gerade Anführungszeichen.
 */
import { BrailleTabellenPunkte } from "./ScreenreaderHinweis";
import { AltText, Kbd } from "./TippenHilfeTeile";
import { useRef } from "react";
import {
  EINSTIEGSFENSTER_MIN,
  MIND_ZEICHEN,
  PROBEN_JE_NIVEAU,
  PRUEFUNG_WORT_ES,
  PRUEFUNG_WORT_MEHRZAHL_ES,
} from "@/lib/typing/schreibprobe";
import { FEHLER_GEWICHT, FEHLER_GEWICHT_FREI } from "@/lib/typing/schreibprobeWertung";
import { SCORE_ERKLAERUNG_USTED_ES } from "@/lib/typing/score";
import { STEIGERUNG_HINWEIS_ES } from "@/lib/typing/schreibprobeHinweise";
import { zahl } from "@/lib/bedienSprache";
import { LERNWEGE } from "@/lib/typing/lernweg";
import { useFocusTrap } from "./useFocusTrap";
import { DidaktikInhalt, didaktikAbschnittTitel } from "./DidaktikHinweise";
import { DreiWerteHilfe, LeistungsstufeHilfe } from "./TastenflowZahlenHilfe";
import { RundgangLehrkraftKnoepfe } from "./Rundgang";
import { HandbuchKnopf } from "@/components/lernwerkstatt/HandbuchKnopf";
import { handbuecherFuer, tastenflowPlakat } from "@/lib/lernwerkstatt/handbuecher";

/** Das Handbuch - derselbe Knopf wie in den anderen Fassungen. */
function HandbuchLaden() {
  const h = handbuecherFuer("tippen")[0];
  if (!h) throw new Error("Kein Tastenflow-Handbuch in HANDBUECHER");
  return (
    <p className="m-0">
      <HandbuchKnopf alsLink handbuch={h} />
    </p>
  );
}

/** Das Plakat - `div` statt `p` (der Knopf kann einen Fehler-Absatz zeigen). */
function PlakatLaden() {
  return (
    <div className="m-0">
      <HandbuchKnopf alsLink handbuch={tastenflowPlakat()} />
    </div>
  );
}

// ★ 18.10.2026 (Johannes: „passe mac an Wahl-taste an"): `Kbd` und `AltText` aus
//   der Kinder-Hilfe - am Mac heißt die Taste „Wahl" (Option, Opción …), im
//   Kästchen wie im Satz. Vorher stand hier ein eigenes `Kbd`, das immer „Alt" zeigte.

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-hairline bg-surface-sunken p-4">
      <h3 className="m-0 mb-1 text-lg font-semibold text-ink">{title}</h3>
      <div className="space-y-2 text-ink-soft">{children}</div>
    </section>
  );
}

export function LehrerHilfeSpanisch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  useFocusTrap(open, cardRef, { initialFocus: closeRef });
  if (!open) return null;
  const W = PRUEFUNG_WORT_ES;
  const WM = PRUEFUNG_WORT_MEHRZAHL_ES;
  // ★ Die spanische Grundreihe und was bis Mayús folgt (ohne die Tilde-Taste).
  const esWeg = LERNWEGE.es;
  const esGrundreihe = esWeg.letterOrder.slice(0, 8).map((c) => c.toUpperCase()).join(" ");
  const esNachGrundreihe = esWeg.letterOrder
    .slice(8, esWeg.lettersBeforeShift)
    .filter((c) => /^\p{L}$/u.test(c))
    .map((c) => c.toUpperCase())
    .join(" ");

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Ayuda para docentes sobre Tastenflow"
      onClick={onClose}
    >
      <div
        ref={cardRef}
        className="card my-8 w-full max-w-3xl space-y-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="m-0 text-xl font-semibold text-ink">
            Ayuda para docentes: todas las funciones de "Tastenflow"
          </h2>
          <button
            ref={closeRef}
            type="button"
            className="btn-secondary btn-toggle"
            onClick={onClose}
            aria-label="Cerrar la ayuda"
          >
            ✕ Cerrar
          </button>
        </div>
        <RundgangLehrkraftKnoepfe onStart={onClose} />

        <p className="m-0 text-ink-soft">
          "Tastenflow" tiene su <strong>propio sistema de cuentas</strong>,
          totalmente separado del inicio de sesión de la plataforma. Iniciar
          sesión aquí no cambia nada en la sesión de la plataforma - y al revés.
        </p>

        <Section title="1 · Crear clases y cuentas">
          <p className="m-0">
            Como docente, al abrir Tastenflow siempre llega a{" "}
            <strong>"Mis clases"</strong>; "Practicar por mi cuenta" (
            <Kbd>Alt</Kbd> + <Kbd>U</Kbd>) lleva a su propia práctica. Con{" "}
            <strong>"Estudiantes y accesos"</strong>, arriba a la derecha, crea
            una clase - en el apartado desplegable{" "}
            <strong>"Crear una clase nueva"</strong>. El{" "}
            <strong>código de clase</strong> es obligatorio: mientras escribe el
            nombre, el programa propone un código adecuado ("5B Rivera" pasa a
            ser "5BRIVERA"); puede cambiarlo, por ejemplo a <code>5B-2</code>.
            El código vale para toda la clase. En el mismo apartado elige el{" "}
            <strong>curso</strong> y el <strong>punto de partida</strong>, y
            revisa el idioma (con su bloqueo) y la Competición de la clase - los
            mismos campos que en "Configuración de la clase".{" "}
            <strong>"Crear la clase"</strong> solo funciona cuando todo está
            completo; si no, una frase dice qué falta, y el foco está en el
            primer campo que falta.
          </p>
          <p className="m-0">
            Después añade estudiantes con <strong>nombre y contraseña</strong>.
            Así pueden iniciar sesión en <strong>cualquier dispositivo</strong>{" "}
            con <em>código de clase + nombre + contraseña</em>. El dispositivo
            recuerda el código de clase, así que después solo escriben su nombre
            y su contraseña.
          </p>
          <p className="m-0">
            Más tarde puede cambiar el nombre y el código de la clase con{" "}
            <strong>"✏️ Editar"</strong> - un código nuevo vale entonces para
            todo el alumnado de la clase (a partir de ahí inicia sesión con el
            nuevo).
          </p>
          <p className="m-0">
            <strong>Otra posibilidad:</strong> quien no pertenece a ninguna
            clase también puede <strong>crearse una cuenta</strong> - en la
            ventana de inicio de sesión, con la casilla "Practico por mi cuenta,
            sin clase" y una dirección de correo electrónico. Para usted no
            cambia nada: esas cuentas no pertenecen a ninguna clase, no aparecen
            en ninguna de sus listas y reciben su propio resumen semanal. En su
            clase todo sigue igual - es usted quien añade al alumnado.
          </p>
        </Section>

        <Section title="2 · Configuración de la clase y de cada estudiante">
          <p className="m-0">
            <strong>Para toda la clase</strong> (el botón "Configuración de la
            clase" en la fila de actividades encima de la tabla, junto a {W},
            Texto de la clase, Objetivo semanal y Bloquear la hora - incluso
            plegado, el botón ya muestra el curso, el idioma y la Competición de
            la clase):
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Curso:</strong> de él el programa deduce el nivel de los
              textos - el vocabulario, el tipo de humor y el tono de los textos
              de práctica. <strong>Avanza con la clase:</strong> el programa
              recuerda el curso escolar en que lo indicó y sube un nivel cada
              año, sin que usted tenga que cambiar nada. En el programa, el{" "}
              <strong>curso escolar empieza el 1 de agosto</strong> y termina
              el 31 de julio: el 1 de agosto la clase pasa al curso siguiente, y
              también las estadísticas del curso escolar van de agosto a julio.
              En los países donde el año escolar empieza en febrero o marzo, ese
              cambio llega a mitad de año - revise entonces el curso en
              "Configuración de la clase" y ajústelo a mano cuando haga falta.
              Para grupos de personas adultas existe el nivel{" "}
              <strong>"Personas adultas"</strong> - ese no avanza. Al alumnado
              de una clase no se le pide el año de nacimiento.
            </li>
            <li>
              <strong>Idioma y bloqueo:</strong> alemán o inglés - y español en
              una clase del recorrido español - para las palabras y los textos de
              práctica de toda la clase; con el bloqueo de al lado, el alumnado ya
              no puede cambiarlo. Cada estudiante tiene el botón redondo de
              idioma en la cabecera: cambia los botones y los menús, y con ellos
              los textos de práctica - con el bloqueo, solo los botones y los
              menús.
            </li>
            <li>
              <strong>Punto de partida de la clase:</strong> "por dónde empezar"
              como ajuste predeterminado para toda la clase - vale también para
              quien llegue más tarde, y solo añade teclas: quien ya va más
              adelantado no pierde nada. Al elegirlo, el programa lo ofrece a la
              vez al alumnado que ya está en la clase; si hay quien ya va más
              adelantado, primero vuelve a preguntar y ofrece tres opciones:
              ajustar a todo el mundo, solo a quien todavía no ha llegado ahí, o
              cancelar. Surte efecto en cuanto cada estudiante vuelve a abrir
              Tastenflow; las estadísticas y las insignias se conservan siempre.
            </li>
            <li>
              <strong>Permitir la Competición de la clase:</strong> el alumnado
              puede invitarse a una competición de 5 minutos. En "Tiempo de
              práctica", en la fila desplegada, ve cuántas veces participó cada
              estudiante por semana - sin clasificación ni tiempos.
            </li>
            <li>
              <strong>Final de línea con Intro:</strong> si está marcado, todo el
              alumnado de la clase termina cada línea de práctica con la tecla
              Intro - como en los ejercicios clásicos de mecanografía, que se
              copian línea a línea. Vale para "Mi entrenamiento", los cuentos, el texto de la clase, los juegos de
              palabras con líneas, el {W} y la Competición de la clase; no para
              los acertijos, las letras revueltas, el dictado de dedos, el
              juego de la Expedición ni "Explorar el teclado". Predeterminado:
              desactivado.
            </li>
          </ul>
          <p className="m-0">
            <strong>Para cada estudiante</strong> (detrás de la flecha de su
            fila):
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Teclado:</strong> se elige en la configuración, en
              "Teclado" - español de España o latinoamericano. El ajuste vale
              para este dispositivo (no para la cuenta) y decide el teclado de la
              pantalla, las indicaciones de los dedos y los caracteres que se
              practican. Entre las dos distribuciones cambian sobre todo cuatro cosas: (1)
              la <strong>tecla de la tilde</strong> <Kbd>´</Kbd> está a la
              derecha de la ñ en el teclado de España y a la derecha de la p en
              el latinoamericano; (2) <strong>¿ y ¡</strong> están en la misma
              tecla, pero al revés - en el de España, ¡ es directo y ¿ va con
              Mayús; en el latinoamericano, ¿ es directo y ¡ va con Mayús; (3)
              la <strong>@</strong> se escribe con <Kbd>Alt Gr</Kbd> +{" "}
              <Kbd>2</Kbd> en el de España y con <Kbd>Alt Gr</Kbd> +{" "}
              <Kbd>Q</Kbd> en el latinoamericano; (4) el teclado latinoamericano
              no tiene el signo del <strong>euro (€)</strong>, por eso Tastenflow
              no lo pide en él.
            </li>
            <li>
              <strong>¿Por dónde empieza?</strong> la misma lista de puntos de
              partida que para toda la clase (ver arriba) - aquí para una sola
              persona que necesita una excepción. Quien ya tiene experiencia se
              salta lo básico y empieza más adelante (por ejemplo, solo a partir
              de los números); para bajar a alguien de nivel, el programa pide
              antes una confirmación.
            </li>
            <li>
              <strong>Escribir con una mano:</strong> quita para esta persona la
              regla de la tecla Mayús de la mano contraria - las mayúsculas y los
              signos cuentan entonces con cualquier tecla Mayús.
            </li>
            <li>
              <strong>La velocidad no cuenta:</strong> la velocidad no se valora
              en ninguna parte para esta persona - sin límite de tiempo en el
              juego, sin meta de velocidad para las estrellas, sin subir ni bajar
              de nivel por la velocidad. Para estudiantes que escriben con
              cuidado pero muy despacio.
            </li>
            <li>
              <strong>Espacio grande entre caracteres (CVI):</strong> más
              espacio entre cada carácter al copiar, en tres grados (doble,
              triple, cuádruple) - para estudiantes con discapacidad visual
              cerebral (CVI; en español también DVC), a
              quienes los caracteres muy juntos se les mezclan. Cada estudiante
              también puede cambiar el espacio en su configuración (la rueda
              dentada, <AltText>Alt + O</AltText>) - y usted puede cambiarlo aquí cuando quiera.
              Vale la última elección.
            </li>
          </ul>
          <p className="m-0">
            Todo se puede cambiar en cualquier momento - los cinco ajustes de
            la clase en el panel "Configuración de la clase" encima de la tabla,
            los de cada estudiante en su fila desplegada.
          </p>
        </Section>

        <Section title="3 · El nivel (1-50): el corazón del sistema">
          <LeistungsstufeHilfe />
          <p className="m-0">
            El <strong>nivel actual</strong> aparece en la tabla (columna{" "}
            <strong>"Nivel"</strong>) y arriba en la pantalla de práctica. No
            tiene que ajustar nada - solo activar "La velocidad no cuenta" si
            hace falta.
          </p>
        </Section>

        <Section title='4 · "Mi entrenamiento": adaptativo, según la frecuencia de las letras'>
          <p className="m-0">
            "Tastenflow" ofrece <strong>un solo</strong> camino de práctica, que
            cada estudiante recorre a su propio ritmo - y se{" "}
            <strong>adapta</strong>: el programa mide cada tecla por separado,
            practica solo las que más lo necesitan y solo desbloquea una tecla
            nueva cuando las anteriores ya son seguras.
          </p>
          <div className="rounded-xl border border-accent bg-accent-soft p-3">
            <p className="m-0 font-semibold text-ink">Orden según la frecuencia de las letras</p>
            <ul className="m-0 mt-1 list-disc space-y-1 pl-5">
              <li>
                Después de la fila guía llegan primero las letras{" "}
                <strong>más frecuentes</strong> - desde las primeras teclas
                aparecen <strong>palabras de verdad</strong>.
              </li>
              <li>
                <strong>Cada recorrido es distinto</strong> - la tecla siguiente
                depende de cada estudiante, no de una lista fija.
              </li>
              <li>
                <strong>Sin final fijo</strong> - ideal para una práctica diaria
                y autónoma.
              </li>
            </ul>
          </div>
          <p className="m-0 rounded-xl border border-warning/40 bg-warning/10 p-3">
            <strong>A tener en cuenta en su planificación:</strong> en el teclado
            español, la <strong>fila guía ya lleva una vocal y la Ñ</strong> (
            <strong>{esGrundreihe}</strong>). Después llegan{" "}
            <strong>{esNachGrundreihe}</strong> y, antes de la tecla Mayús, la{" "}
            <strong>tecla de la tilde</strong> <Kbd>´</Kbd> - con ella salen á,
            é, í, ó y ú: aparecen frases de verdad casi enseguida, y los primeros
            cuentos desde las primeras teclas.
          </p>
          <p className="m-0 rounded-xl border border-hairline bg-surface-raised p-3">
            <strong>El orden depende del idioma de la primerísima
            sesión:</strong> el recorrido que sigue una clase depende del idioma
            de la interfaz la primera vez que practicó - español, alemán, inglés
            o francés. Una clase que empezó en alemán o en inglés mantiene ese
            orden aunque después cambie de interfaz: el orden se decide una sola
            vez y ya no cambia nunca.
          </p>
          <p className="m-0">
            <strong>El mismo texto para toda la clase:</strong> los textos del
            recorrido (fila guía, filas de letras, acentos, signos de
            puntuación, números, caracteres, textos enteros) están disponibles
            como <strong>plantillas</strong> en la zona{" "}
            <strong>"Texto de la clase"</strong> de "Mis clases" - elija una, y
            toda la clase practica el mismo texto, sea cual sea el nivel de cada
            estudiante (como con un archivo cargado, cuenta como tiempo de
            práctica, sin desbloquear teclas nuevas).
          </p>
        </Section>

        <Section title='4a · "Texto de la clase": un solo texto para toda la clase'>
          <p className="m-0">
            Con el botón <strong>"Texto de la clase"</strong> de la fila de
            actividades de las estadísticas de la clase, fija un texto que
            practica toda la clase - sea cual sea el nivel de cada estudiante.
            Hay tres caminos: <strong>cargar un archivo</strong> (.txt o .docx),
            elegir un texto ya guardado en <strong>"Mis textos"</strong>, o usar
            una de las <strong>plantillas</strong> del recorrido (ver el punto
            4).
          </p>
          <p className="m-0">
            <strong>"Mis textos"</strong> es su reserva personal - pertenece a
            su cuenta, no a la clase, y solo la ve usted. Al cargar un archivo,{" "}
            <strong>"Guardar en Mis textos"</strong> (activado de entrada)
            guarda una copia automáticamente, para poder usar el mismo texto más
            adelante sin volver a cargarlo.
          </p>
          <p className="m-0">
            Si el archivo contiene caracteres que no se pueden escribir, el
            panel los muestra antes de empezar - usted decide si corrige el
            archivo o empieza de todos modos (entonces esos caracteres se quitan
            de las líneas y nunca cuentan como pulsación obligatoria).
          </p>
          <p className="m-0">
            <strong>"Iniciar el texto de la clase":</strong> cada estudiante
            recibe enseguida una ventana <em>"Ahora sigue un ejercicio de tu
            docente."</em> - solo puede pulsar <strong>"Continuar"</strong>, no
            rechazarlo. Para cada estudiante, el ejercicio termina solo en cuanto
            ha escrito el texto una vez; después sigue la práctica normal.{" "}
            <strong>"Terminar"</strong> lo detiene antes para toda la clase.
          </p>
          <p className="m-0">
            El ejercicio cuenta como tiempo de práctica y se mide como cualquier
            serie, teclas inseguras incluidas - pero{" "}
            <strong>no desbloquea ninguna tecla nueva</strong>: solo cuentan las
            teclas del archivo.
          </p>
        </Section>

        {/* ★ D-9 (28.09.2026): Didaktik - Sätze aus `lib/typing/didaktikHinweise.ts`. */}
        <Section title={didaktikAbschnittTitel("es")}>
          <DidaktikInhalt lang="es" />
        </Section>

        <Section title="5 · Textos con sentido desde el principio">
          <p className="m-0">
            Tastenflow muestra textos de verdad adecuados a la edad{" "}
            <strong>lo antes posible</strong> - chistes, refranes, dichos,
            divulgación y datos curiosos, trabalenguas, juegos de palabras y
            frases enteras. Un texto aparece en cuanto sus{" "}
            <strong>letras</strong> están aprendidas; una simple "sopa de
            letras" es la excepción (solo para practicar a propósito una tecla
            recién llegada).
          </p>
          <p className="m-0">
            <strong>Mayúsculas:</strong> la ortografía es{" "}
            <strong>siempre correcta</strong> (mayúscula al empezar la frase y
            en los nombres propios) - el alumnado nunca ve una palabra mal
            escrita. Al principio basta con la letra <strong>minúscula</strong>;
            la mayúscula aparece sola (para <strong>todas las edades</strong>,
            porque la ortografía correcta importa a cualquier edad).
          </p>
          <p className="m-0">
            En <strong>"Mi entrenamiento", la tecla Mayús de verdad llega
            pronto</strong> - justo después de las primeras letras frecuentes y
            de la tecla de la tilde, en cuanto hay suficientes palabras de verdad
            para practicar (no después de todo el alfabeto). A partir de ahí,
            las mayúsculas se escriben "de verdad" con Mayús. Así el alumnado
            aprende pronto a poner las mayúsculas <strong>por sí mismo</strong>,
            en lugar de depender mucho tiempo de la ayuda automática.
          </p>
          <p className="m-0">
            <strong>Los signos de puntuación</strong> (punto, coma, signos de
            interrogación …) solo aparecen cuando están aprendidos - antes, la
            frase se muestra "sin punto ni coma". En cambio, una tecla de{" "}
            <em>letra</em> o de <em>número</em> que todavía no se ha aprendido no
            se exige <strong>nunca</strong>.
          </p>
        </Section>

        <Section title="6 · Estrellas, insignias y sonidos (importantes para el alumnado con discapacidad visual)">
          <p className="m-0">
            Cada serie da <strong>de 1 a 3 estrellas</strong> según la precisión
            y la velocidad - <strong>la precisión cuenta el triple</strong>: 3
            estrellas piden siempre alrededor de un 96 % de aciertos (escribir
            rápido y mal no tiene premio); en cambio, una serie sin ningún error
            consigue seguro 2 estrellas, incluso a la velocidad más lenta. Cada
            número de estrellas tiene su <strong>propio sonido</strong>; cuando
            alguien <strong>sube de nivel</strong>, suena una celebración
            especial. Estos sonidos son la respuesta principal para el alumnado
            con discapacidad visual. El botón <strong>🔇</strong> quita el
            sonido en una clase tranquila.
          </p>
          <p className="m-0">
            Además hay <strong>insignias</strong> con nombres pensados para la
            infancia - en familias, con grados crecientes y un "próximo
            objetivo" que siempre se puede anunciar. Solo el alumnado de 7 a 10
            años ve los nombres de las mascotas; a partir del nivel de los
            textos 11-15 años aparece en todas partes el nombre neutro. Las
            insignias son las mismas - lo
            ganado se queda, aunque cambie el nivel de los textos. Casi todas
            premian la <strong>precisión</strong> y la{" "}
            <strong>constancia</strong>; la única insignia de velocidad pide un
            95 % de precisión. Una insignia nueva trae su propio sonido
            "ta-chán" con un anuncio, y después aparece arriba del todo en las
            estadísticas (para cada estudiante y para usted - la misma vista).
            Cada insignia se puede <strong>seleccionar</strong> para abrirla en
            grande, con un efecto.
          </p>
          <p className="m-0">
            El <strong>Juego de la Banquisa 🐧</strong> es el premio después de
            una tecla nueva en "Mi entrenamiento": el pingüino cruza un recorrido
            hecho con los <strong>caracteres más inseguros</strong> de cada
            estudiante. <strong>La tecla ya está desbloqueada antes</strong> - el
            progreso no depende de ningún juego. Tantos intentos como se quiera,
            sin fin de partida; donde solo se pide precisión, no hay{" "}
            <strong>ninguna presión de tiempo</strong> (un límite de tiempo que
            se puede desactivar, como exigen las WCAG). Además, el alumnado de 7
            a 15 años puede empezar el juego cuando quiera con el botón{" "}
            <strong>Jugar</strong> - como una "aventura del día" con{" "}
            <strong>peces extra</strong> y la <strong>Cueva del Eco</strong>,
            donde cada tecla solo se anuncia (el programa habla allí aunque la
            lectura en voz alta esté desactivada - el alumnado con y sin
            discapacidad visual juega exactamente igual). Una serie sin errores
            termina con la aurora austral. Importante para su evaluación: el juego{" "}
            <strong>no cuenta</strong> como tiempo de práctica ni para el
            objetivo semanal - es solo motivación.
          </p>
          <p className="m-0">
            <strong>Dos entradas distintas al juego - conviene no
            confundirlas:</strong> el botón <strong>Jugar</strong> es el camino
            libre que el alumnado abre por su cuenta; existe para el grupo de{" "}
            <strong>7 a 15 años</strong>, no a partir de 16. La partida{" "}
            <strong>después de una tecla nueva</strong>, en cambio, llega sola:
            siempre de 7 a 10 años, nunca a partir de 16, y de 11 a 15 años solo
            si el Juego de la Banquisa está elegido en la configuración, en{" "}
            <strong>"Juego de recompensa"</strong>, en lugar de{" "}
            <strong>Ninguno</strong> (el predeterminado). Este ajuste pertenece
            al <strong>dispositivo</strong>, no a la cuenta - como la
            distribución del teclado. En un equipo de la clase vale, por
            tanto, para todas las personas que practican en él.
          </p>
        </Section>

        <Section title="7 · Objetivo semanal">
          <p className="m-0">
            Para cada estudiante fija <strong>minutos por semana</strong> - un
            simple número, sin sesiones de clase que indicar. "Aplicar a toda la
            clase" escribe el mismo valor para todo el alumnado de la clase de
            una vez, y vale también para quien llegue más tarde.
          </p>
          <p className="m-0">
            Un cambio vale siempre <strong>a partir del lunes siguiente a las
            8</strong> - la semana en curso mantiene su objetivo anterior. Una
            ventana indica la fecha exacta antes de guardar.
          </p>
          <p className="m-0">
            <strong>Recuperar:</strong> si "Recuperar los minutos que faltaron
            en semanas anteriores" está marcado, todos los minutos que faltan se
            pueden recuperar de una vez.
          </p>
          <p className="m-0">
            <strong>Eximir del objetivo semanal</strong> (por ejemplo, por
            enfermedad) y <strong>Poner a cero los minutos pendientes</strong>{" "}
            se ajustan para cada estudiante, sin cambiar el tiempo
            practicado.
          </p>
          <p className="m-0">
            <strong>Bloquear la hora:</strong> un botón aparte para toda la
            clase, durante 60 minutos. El alumnado sigue practicando - el tiempo
            de práctica y las estadísticas siguen contando, pero no para el
            objetivo semanal durante esa hora. Pulsar otra vez el mismo botón
            quita el bloqueo antes.
          </p>
        </Section>

        <Section title="8 · Estadísticas y progreso en el tiempo (desplegable para cada estudiante)">
          <p className="m-0">
            Con el botón redondo con flecha<span aria-hidden="true"> ▸</span>{" "}
            delante del nombre abre seis filas que se pliegan cada una, de
            arriba abajo: <strong>Configuración</strong> (los ajustes del punto
            2, para esa persona), <strong>{WM}</strong> (solo si ha hecho al
            menos uno), <strong>Tiempo de práctica</strong> (por semana, con el
            estado del objetivo de esa semana y - si ha jugado - el número de
            Competiciones de la clase, más el resumen de todo el curso escolar),{" "}
            <strong>Teclas inseguras</strong>, <strong>Insignias</strong> y -
            solo si destaca algún valor - <strong>Autonomía</strong> (ver el
            punto 9).
          </p>
          <p className="m-0">
            Arriba en "Tiempo de práctica" ve en cuántas Competiciones de la
            clase ha participado cada estudiante (contadas en esta clase); pulsar
            Intro sobre una semana abre el detalle de cada sesión - día, hora de
            inicio y de fin, tiempo neto de escritura y qué se practicó.
          </p>
          <p className="m-0">
            Las cifras de un vistazo, el progreso en el tiempo, el progreso de
            las teclas, los cuentos y la divulgación están en{" "}
            <strong>"Mi progreso"</strong> de cada estudiante, donde usted ve
            exactamente la misma vista.
          </p>
          <p className="m-0">
            <strong>La puntuación:</strong> {SCORE_ERKLAERUNG_USTED_ES}
          </p>
          <p className="m-0">
            <strong>En la tabla de la clase</strong>, tres columnas están
            agrupadas bajo el encabezado <strong>"Práctica"</strong>: precisión,
            pulsaciones por minuto y puntuación. Las tres salen de la práctica
            en el periodo elegido, y la puntuación combina las otras dos. Por
            eso tienen un fondo algo más gris y un borde fino; el lector de
            pantalla anuncia "Práctica" antes del encabezado de la columna. La
            columna <strong>"{W}"</strong>, a la derecha del todo, queda a
            propósito fuera de ese grupo - bajo su propio encabezado "{W}": es
            una prueba en un día concreto, no la práctica diaria.
          </p>
          <p className="m-0">
            En la columna <strong>"Puntuación"</strong>: quien ha escrito menos
            de 200 caracteres en el periodo elegido no tiene puntuación, solo un
            guion - por debajo de eso, un solo error haría perder varios puntos.
          </p>
          <p className="m-0">
            <strong>"Descargar en Excel"</strong> está encima de la tabla, a la
            derecha de "Total". El botón descarga la tabla con el nombre{" "}
            <strong>nombredelaclase_fecha.xlsx</strong> (por ejemplo
            "3A_2026-09-12.xlsx") - para el periodo elegido en ese momento. Al
            principio hay un resumen con enlaces a los cuatro periodos y una
            leyenda que explica cada columna y muestra cómo se calcula la
            puntuación. Siguen cuatro hojas: el curso escolar actual, el total,
            el mes (las 4 últimas semanas) y esta semana. Los valores se guardan
            como números, para poder seguir calculando en Excel; donde la tabla
            muestra un guion, el archivo también.
          </p>
          <p className="m-0">
            <strong>El resumen de la clase</strong> encima de la tabla muestra
            la clase en conjunto. "Mes" (las 4 últimas semanas) viene
            preseleccionado; "Curso escolar" está justo al lado. Una línea da las
            pulsaciones por minuto, la precisión y los objetivos semanales, cada
            uno con una pequeña tendencia - para el mes frente a las 4 semanas
            anteriores, para el curso escolar las primeras semanas de práctica
            frente a las últimas.
          </p>
          <p className="m-0">
            <strong>La barra de puntos "Puntuaciones en la clase"</strong>{" "}
            muestra un punto por estudiante. La tecla Tab lleva a la barra, y las
            flechas pasan de una persona a otra - cada parada se anuncia ("Lucía,
            78 puntos"). Cuántas personas están por debajo de 50, entre 50 y 70,
            entre 70 y 85 y por encima de 85 puntos, y quién ha escrito
            demasiado poco, lo dice la indicación de su encabezado.
          </p>
          <p className="m-0">
            <strong>El gráfico "Puntuación de la clase en el curso
            escolar"</strong> muestra, por semana, la media de quienes han
            escrito al menos 5 líneas; un hueco significa que esa semana hubo
            muy poca práctica. La tecla Tab lleva al gráfico, y las flechas
            pasan de una semana a otra; para el lector de pantalla, todas las
            semanas están también en una tabla. Cuando se añaden la tecla Mayús,
            los números o los caracteres especiales, la curva baja un tiempo - es
            normal y no es preocupante.
          </p>
          <p className="m-0">
            <strong>La curva:</strong> {STEIGERUNG_HINWEIS_ES}
          </p>
          <p className="m-0">
            <strong>Transparencia:</strong> cada estudiante ve exactamente las
            mismas cifras sobre sí en "Mi progreso" - usted nunca ve más que la
            propia persona.
          </p>
        </Section>

        <Section title="8a · Los valores sobre los que puede construir una nota">
          <DreiWerteHilfe />
        </Section>

        <Section title={`8b · El ${W}: una prueba para toda la clase`}>
          <p className="m-0">
            En la zona docente <strong>"Mis clases"</strong>, arriba del todo en
            las <strong>estadísticas de la clase</strong> de Tastenflow, en la
            fila de actividades, está el botón <strong>"{W}"</strong>. Abre el
            formulario con el que lanza una prueba para toda la clase -{" "}
            <strong>todo el alumnado recibe el mismo texto</strong>, sea cual sea
            su punto en el recorrido.
          </p>
          <p className="m-0">
            <strong>Tres cosas que ajustar:</strong> el{" "}
            <strong>nivel de teclas</strong> (de "Fila guía" a "Todas las
            teclas"), justo al lado el <strong>tipo</strong>, y el{" "}
            <strong>tiempo</strong> en minutos. <strong>"Iniciar ahora"</strong>{" "}
            lo arranca enseguida.
          </p>
          <p className="m-0">
            <strong>Estricto</strong> (predeterminado): una tecla equivocada no
            hace avanzar, cada error de pulsación cuenta
            - aunque se corrija en el acto. <strong>Escritura libre</strong> se
            parece a una copia clásica: los errores se quedan como se
            escribieron y no se señalan, y Retroceso solo corrige dentro de la
            línea actual. Lo que se valora solo se calcula al final, a partir de
            lo que sigue mal - como mucho un error por palabra, la última palabra
            sin terminar no cuenta, y lo corregido no cuenta en absoluto. Como un
            error que se queda no ha costado tiempo de escritura, pesa más:{" "}
            {FEHLER_GEWICHT_FREI} caracteres en lugar de {FEHLER_GEWICHT} (8a).
            Elija "Escritura libre" cuando la clase deba practicar una copia sin
            que un error bloquee la escritura; elija "Estricto" para poner a
            prueba la escritura misma.
          </p>
          <p className="m-0">
            <strong>Tres relojes que conviene distinguir:</strong>
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              El <strong>inicio</strong> - el momento en que pulsa "Iniciar
              ahora". Desde ahí la clase puede empezar.
            </li>
            <li>
              El <strong>plazo para empezar</strong>: {EINSTIEGSFENSTER_MIN}{" "}
              minutos después del inicio. Hasta entonces cada estudiante todavía
              puede empezar; después ya es tarde.
            </li>
            <li>
              El <strong>tiempo</strong> corre{" "}
              <strong>por separado para cada estudiante</strong>, y solo desde su{" "}
              <strong>primera pulsación</strong>. Dos personas de la misma clase
              terminan, por tanto, en momentos distintos - es a propósito: quien
              primero necesita orientarse no pierde tiempo.
            </li>
          </ul>
          <p className="m-0">
            <strong>Los textos:</strong> para cada nivel de teclas hay{" "}
            <strong>{PROBEN_JE_NIVEAU} textos de {W}</strong> de al menos{" "}
            {zahl(MIND_ZEICHEN, "es")} caracteres cada uno - lo bastante largos
            para no agotarse nunca, ni a gran velocidad. Estos textos{" "}
            <strong>no aparecen en el recorrido</strong>, así que nadie ha podido
            practicarlos antes. El siguiente {W} con ese nivel de teclas sigue
            desde el punto más lejano alcanzado la vez anterior: en la línea
            siguiente o, en los textos con frases, al principio de la frase
            siguiente. Si un texto se agota durante el {W}, el alumnado sigue con
            el siguiente sin interrupción.
          </p>
          <p className="m-0">
            <strong>Alumnado con discapacidad visual:</strong> hace el {W} con la{" "}
            <strong>lectura en voz alta</strong> del programa (<Kbd>Alt</Kbd> +{" "}
            <Kbd>V</Kbd>) - como en la práctica, sin una casilla aparte para
            usted. El tiempo que cada estudiante pasa esperando a la voz lo
            descuenta el propio reloj del {W}; a quien no tiene discapacidad
            visual y también se hace leer el texto en voz alta se le descuenta
            lo mismo. Así, el tiempo de la lectura en voz alta ya está
            compensado; otras adaptaciones o ajustes razonables que se apliquen
            en su centro los decide usted.
          </p>
          <p className="m-0">
            <strong>Los resultados</strong> están en el panel desplegado en "
            {WM} anteriores" - el botón "{W}" al principio de la fila lo
            despliega: para cada estudiante, el puesto, la{" "}
            <strong>puntuación</strong>, si la lectura en voz alta estaba
            activada, la velocidad, la precisión y las teclas inseguras. Cómo se
            calcula la puntuación se explica en el punto 8a. En cuanto el {W} ha
            terminado para <strong>toda la clase</strong>, llega también un{" "}
            <strong>correo electrónico con el resumen</strong> y las mismas
            cifras.
          </p>
          <p className="m-0">
            Cada estudiante puede elegir <strong>"No participo"</strong>.
            Entonces sigue practicando con normalidad y aparece en los
            resultados como <strong>"no participó"</strong>. Después, cada
            estudiante ve sus propios {WM} en <strong>"Mi progreso"</strong> -
            las mismas cifras que usted.
          </p>
        </Section>

        <Section title="9 · Autonomía / revisión con IA (solo para usted)">
          <p className="m-0">
            La columna <strong>"Autonomía"</strong> muestra un valor del{" "}
            <strong>1 al 10</strong>. Sube con indicios de que algo no lo ha
            escrito la propia persona: <em>pegar texto</em>, cambios frecuentes
            de ventana o de foco, una velocidad poco creíble o una precisión
            perfecta sin historial de aprendizaje. Este valor solo lo ve{" "}
            <strong>usted</strong>, no el alumnado.
          </p>
        </Section>

        <Section title="10 · Accesibilidad">
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Contraste y tamaño del texto:</strong> en la barra de
              arriba (claro, oscuro, alto contraste); <Kbd>Alt</Kbd> +{" "}
              <Kbd>+</Kbd> / <Kbd>-</Kbd> agranda o reduce el campo de práctica.
            </li>
            <li>
              <strong>Lectura en voz alta</strong> con <Kbd>Alt</Kbd> +{" "}
              <Kbd>V</Kbd> - para estudiantes sin lector de pantalla configurado
              (con NVDA, JAWS o VoiceOver, mejor dejarla desactivada). Puede
              elegir si se leen <em>letras / palabras / frases</em>, la
              velocidad y <strong>qué voz</strong>. El{" "}
              <strong>tiempo de lectura se descuenta del cálculo de la
              velocidad</strong> - así quien necesita la lectura en voz alta no
              sale perdiendo en las estadísticas.
            </li>
            <BrailleTabellenPunkte weg="es" />
            <li>
              <strong>Anuncio del dedo:</strong> pulsar dos veces rápido la
              tecla <Kbd>Mayús</Kbd> anuncia el dedo correcto.
            </li>
            <li>
              <strong>Gestión del foco:</strong> cada botón tiene un destino
              definido - quien lo pulsa sabe después dónde está el cursor de
              escritura. Para el alumnado que trabaja con una línea braille, es
              la diferencia entre seguir y buscar. Tres reglas que conviene
              conocer en clase: <Kbd>Esc</Kbd> cierra cualquier ventana y lleva
              siempre <strong>al campo de práctica</strong>; un cambio de vista
              (estadísticas, biblioteca, inicio de sesión) llega al{" "}
              <strong>título de la vista nueva</strong> y lo anuncia; y{" "}
              <strong>nada desaparece por sí solo</strong> - incluso la
              celebración de un desbloqueo espera a que la persona pulse
              "Continuar".
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>E</Kbd> salta al campo de práctica,{" "}
              <Kbd>Alt</Kbd> + <Kbd>H</Kbd> abre la ayuda.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>U</Kbd> cambia a la práctica,{" "}
              <Kbd>Alt</Kbd> + <Kbd>S</Kbd> a <strong>"Mis clases"</strong>;{" "}
              <Kbd>Alt</Kbd> + <Kbd>Z</Kbd> anuncia la línea en la que está.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>D</Kbd> da el tiempo de práctica - en la
              línea braille y (con la lectura en voz alta) como anuncio.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>T</Kbd> abre o cierra la{" "}
              <strong>lista de atajos de teclado</strong>.
            </li>
          </ul>
        </Section>

        <Section title="11 · Eliminar">
          <p className="m-0">
            Una persona o una clase entera se pueden eliminar definitivamente
            (con su cuenta, su progreso y sus resultados). No se puede deshacer
            - antes se pide una confirmación.
          </p>
        </Section>

        {/* ★ ES-H (27.09.2026): die Guía gibt es jetzt auf Spanisch
            (`tastenflow-handbuch-es.pdf`, `HandbuchKnopf` lädt sie für „es").
            ★ 28.09.2026: das Plakat ebenso - eigene Datei
            `tastenflow-plakat-es.pdf` in `handbuecher.ts`, derselbe
            `HandbuchKnopf` lädt sie jetzt für „es" automatisch. */}
        <Section title="12 · Descargas: la guía y el cartel (PDF)">
          <p className="m-0">
            Todo lo que dice esta ayuda, y mucho más, está en la{" "}
            <strong>guía para docentes</strong>: el recorrido con todas sus
            etapas, los teclados de España y Latinoamérica, el panel de la
            clase, el {W} paso a paso, la puntuación y los valores para una
            evaluación.
          </p>
          <HandbuchLaden />
          <p className="m-0">
            Para la pared de una clase o de la sala del profesorado también
            existe el <strong>cartel de Tastenflow</strong> en formato A3, con un
            código QR a tastenflow.org. Es libre para todo el mundo, sin
            iniciar sesión.
          </p>
          <PlakatLaden />
          <p className="m-0 text-sm text-ink-muted">
            También encuentra los dos en "Mis clases", en "Descargas".
          </p>
        </Section>
      </div>
    </div>
  );
}
