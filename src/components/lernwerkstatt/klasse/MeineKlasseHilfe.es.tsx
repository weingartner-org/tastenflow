/**
 * ★★★ ES-O (27.09.2026): DIE HILFE ZU „MEINE KLASSEN" AUF SPANISCH.
 * ===========================================================================
 * Aus der Funktion geschrieben, nach dem Muster von `MeineKlasseHilfe.fr.tsx`
 * (dieselben Abschnitte, dieselben Tatsachen) - nicht Satz für Satz aus dem
 * Deutschen übertragen. Sichtbar nur mit `spracheGewaehlt === "es"`
 * (`MeineKlasseHilfe.tsx`); jedes Programm ohne Sprach-Anbieter zeigt weiter
 * die deutsche Fassung.
 *
 * Anrede: **usted** (Lehrkraft-Bereich, Bauplan S9). Geschlechtergerecht über
 * Sammelwörter - „el alumnado", „estudiante", „la persona docente" (S10).
 * Glossar Bauplan §7 wörtlich, dazu die Namen der spanischen Oberfläche:
 * *Reto*, *Texto de la clase*, *Competición de la clase*, *Objetivo semanal*,
 * *Configuración de la clase*, *Bloquear la hora*, *Mis clases*, *código de
 * clase*. Tastenwege als Tastenwege, nie Maus-Wörter.
 */
import { Modal } from "@/components/Modal";
import { RundgangMeineKlassenKnopf } from "@/components/typing/Rundgang";
import {
  DreiWerteHilfe,
  LeistungsstufeHilfe,
  SpaltenHilfe,
} from "@/components/typing/TastenflowZahlenHilfe";
import {
  EINSTIEGSFENSTER_MIN,
  PRUEFUNG_WORT_ES,
  PRUEFUNG_WORT_MEHRZAHL_ES,
} from "@/lib/typing/schreibprobe";

function Abschnitt({ titel, children }: { titel: string; children: React.ReactNode }) {
  return (
    <section className="space-y-1.5">
      <h3 className="m-0 text-base font-semibold text-ink">{titel}</h3>
      <div className="space-y-1.5 text-sm leading-relaxed text-ink">{children}</div>
    </section>
  );
}

function Taste({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-hairline bg-surface-sunken px-1.5 py-0.5 text-sm text-ink">
      {children}
    </kbd>
  );
}

export function MeineKlasseHilfeSpanisch({
  onClose,
  programmName,
}: {
  onClose: () => void;
  /** Das offene Programm - davon hängt ab, welche Abschnitte dastehen. */
  programmName?: string;
}) {
  const tastenflow = programmName === "Tastenflow";
  const W = PRUEFUNG_WORT_ES;
  return (
    <Modal title='Ayuda de "Mis clases"' onClose={onClose} size="lg">
      <div className="space-y-5">
        <RundgangMeineKlassenKnopf onStart={onClose} programmName={programmName} />
        <p className="m-0 text-sm leading-relaxed text-ink">
          Aquí trabaja con su clase. Las clases y las cuentas se crean{" "}
          <strong>una sola vez</strong> - valen en todos los programas, con el
          mismo código de clase y la misma contraseña.
          {tastenflow && (
            <>
              {" "}
              Como docente, al abrir Tastenflow siempre llega aquí. "Practicar
              por mi cuenta" (<Taste>Alt</Taste> + <Taste>U</Taste>) lleva a su
              propia práctica.
            </>
          )}
        </p>

        <Abschnitt titel="Cómo está organizada la página">
          <p className="m-0">
            <strong>Arriba, en la clase,</strong> aparecen su nombre - si tiene
            varias clases, en la lista desplegable "Clase", para cambiar de una
            a otra -, el número de estudiantes y el código de clase. A la
            derecha de esa línea, justo antes de "Descargas", está el
            interruptor <strong>"Progreso | Estudiantes y accesos"</strong> - en
            el mismo sitio en las dos pantallas a las que lleva.
          </p>
          <p className="m-0">
            En <strong>"Estudiantes y accesos"</strong> crea una clase nueva,
            añade estudiantes y los mueve de clase, consulta las contraseñas y
            los datos de acceso, el código de clase y los programas de la
            clase. Para añadir a muchas personas a la vez, use, en
            "Estudiantes", <strong>"Importar participantes desde Excel"</strong>:
            primero "Descargar la plantilla (Excel)", después una fila por
            estudiante con el nombre, la contraseña y - para Tastenflow - el
            punto de partida. Si deja una contraseña vacía, se genera una; una
            vista previa muestra lo que se va a importar, y después todas las
            personas importadas aparecen en "Imprimir los datos de acceso". Con{" "}
            <strong>"Descargar la lista de participantes"</strong>, justo al
            lado, descarga en cualquier momento un archivo de Word con el
            nombre, la contraseña y el código de clase de TODO el alumnado de
            esta clase - listo para imprimir.
            {!tastenflow && (
              <>
                {" "}
                Un mensaje a todo el alumnado se escribe allí con "Mensaje a la
                clase".
              </>
            )}
          </p>
          <p className="m-0">
            En <strong>"Progreso"</strong> - donde llega al abrir la página -
            aparecen los programas de esta clase, las "Descargas" y, debajo, las
            estadísticas de la clase: en qué punto está cada estudiante.
            {tastenflow && (
              <>
                {" "}
                Arriba del todo hay una fila de botones:{" "}
                <strong>{W}</strong>, <strong>Texto de la clase</strong>,{" "}
                <strong>Objetivo semanal</strong>,{" "}
                <strong>Configuración de la clase</strong> y{" "}
                <strong>Bloquear la hora</strong>. Cada botón abre su propia
                zona debajo - solo una a la vez, y <Taste>Esc</Taste> la vuelve a
                cerrar. "{W}" abre el formulario con el nivel de teclas, el
                tiempo en minutos e "Iniciar ahora", además de los{" "}
                {PRUEFUNG_WORT_MEHRZAHL_ES} anteriores; "Texto de la clase" fija
                un texto para toda la clase (un archivo que se carga, un texto de
                "Mis textos" o una plantilla del recorrido - el alumnado recibe
                entonces una ventana con solo "Continuar"); "Objetivo semanal"
                fija los minutos por semana; "Bloquear la hora" marca 60 minutos
                en los que la clase sigue practicando, pero nada cuenta para el
                objetivo semanal. Debajo está el "Resumen de la clase" (mes o
                curso escolar, con la barra de puntuación y el gráfico); a la
                derecha de su encabezado, "Mensaje a la clase" - un mensaje a
                todo el alumnado, que cada estudiante recibe en su propia
                conversación.
              </>
            )}
          </p>
          {tastenflow && (
            <p className="m-0">
              El botón <strong>"Configuración de la clase"</strong> de esa fila
              abre: el curso (de ahí el programa deduce el tipo de textos y
              avanza con cada curso escolar, que en el programa empieza el 1 de
              agosto; "Personas adultas" no avanza), el idioma con su bloqueo,
              el punto de partida de la clase (vale también para quien llegue
              más tarde), la Competición de la clase y "Final de línea con
              Intro". Estos cinco ajustes valen para toda la clase y ya se piden
              al crear una clase; para cada estudiante quedan, en su fila
              desplegada, "¿Por dónde empieza?", "Escribir con una mano", "La
              velocidad no cuenta" y "Espacio grande entre caracteres (CVI)".
            </p>
          )}
          {tastenflow && (
            <p className="m-0">
              Los niveles de <strong>"¿Por dónde empieza?"</strong> llevan el
              nombre de las teclas: "Principiante" son solo F y J, "Posición
              inicial" es toda la fila guía. Con{" "}
              <strong>"Primeras letras + mayúsculas"</strong> se añaden las
              letras más frecuentes que siguen y la tecla Mayús. "Todas las
              letras", "+ signos de puntuación", "+ números" y "Todo" desbloquean
              después el resto, uno tras otro.
            </p>
          )}
          <p className="m-0">
            Cada botón se explica solo: la indicación aparece en cuanto el foco
            llega a él con la tecla Tab. <Taste>Esc</Taste> la hace desaparecer.
          </p>
        </Abschnitt>

        {tastenflow && (
          <Abschnitt titel={`El ${W}, paso a paso`}>
            <ol className="m-0 list-decimal space-y-1 pl-5">
              <li>
                Arriba del todo en las estadísticas de la clase, en la fila de
                actividades, el botón "{W}" abre el formulario.
              </li>
              <li>
                Elegir el <strong>nivel de teclas</strong> - todo el alumnado
                recibe el mismo texto de ese nivel.
              </li>
              <li>
                Indicar el <strong>tiempo</strong> en minutos - el campo está
                justo al lado del nivel.
              </li>
              <li>
                Decir al alumnado: <em>El tiempo empieza a correr con la
                primera pulsación de cada persona.</em> Desde el inicio tienen{" "}
                {EINSTIEGSFENSTER_MIN} minutos para empezar; después el tiempo
                corre por separado para cada estudiante.
              </li>
              <li>
                <strong>"Iniciar ahora"</strong> - el {W} empieza enseguida para
                toda la clase.
              </li>
              <li>
                Justo después aparece, por ejemplo,{" "}
                <strong>"Preparados: 12 de 14 - todavía no: Said, Jano"</strong>:
                en 12 dispositivos el {W} ya ha llegado. Llega en más o menos un
                segundo. Si alguien se queda mucho tiempo en "todavía no",
                volver a cargar la página una vez suele bastar.
              </li>
              <li>
                Mientras dura, ve "Entregados: 3 de 14" con los nombres.
              </li>
              <li>
                Después, los resultados aparecen bajo el formulario: para cada
                estudiante el puesto, la <strong>puntuación</strong>, si la
                lectura en voz alta estaba activada, las pulsaciones por minuto,
                la precisión, los caracteres, los errores y las teclas que aún
                fallan. También llega un correo electrónico con el resumen.
              </li>
            </ol>
          </Abschnitt>
        )}

        {tastenflow && (
          <>
            <Abschnitt titel="Qué significan las columnas de la tabla">
              <SpaltenHilfe />
            </Abschnitt>

            <Abschnitt titel="Qué significa el nivel">
              <LeistungsstufeHilfe />
            </Abschnitt>

            <Abschnitt titel="Los valores sobre los que puede construir una nota">
              <DreiWerteHilfe />
            </Abschnitt>
          </>
        )}

        <Abschnitt titel="El código de clase">
          <p className="m-0">
            Aparece arriba, junto al nombre de la clase, y vale para todos los
            programas. Para iniciar sesión se escribe el código de clase, el
            nombre y la contraseña; el dispositivo recuerda el código, y después
            basta con el nombre y la contraseña.
          </p>
          <p className="m-0">
            Es <strong>obligatorio</strong> al crear una clase. Mientras escribe
            el nombre, el programa propone un código adecuado - "5B Rivera" pasa
            a ser "5BRIVERA". Puede cambiarlo, pero no dejarlo vacío. Más tarde se
            cambia en "Estudiantes y accesos" con "Editar la clase".
          </p>
          <p className="m-0">
            ⚠️ Si cambia el código, todo el alumnado de la clase inicia sesión a
            partir de entonces con el nuevo.
          </p>
        </Abschnitt>

        <Abschnitt titel="Mover a una persona a otra clase">
          <p className="m-0">
            En "Estudiantes y accesos", cada estudiante tiene{" "}
            <strong>"Mover a otra clase"</strong>. Así se abre el campo "Código
            de la clase nueva". Funciona con cualquier clase cuyo código conozca
            - también con la clase de otra persona docente. Antes de moverla, el
            programa vuelve a pedir una confirmación.
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>La persona inicia sesión después con el nuevo código de clase.</li>
            <li>El equipo docente de la clase nueva ve a la persona y su progreso.</li>
            <li>
              {tastenflow
                ? `Los resultados de los ${PRUEFUNG_WORT_MEHRZAHL_ES} anteriores y los mensajes se quedan en la clase anterior.`
                : "Los mensajes se quedan en la clase anterior."}
            </li>
          </ul>
        </Abschnitt>

        <Abschnitt titel="Atajos de teclado de esta zona">
          <p className="m-0">
            <Taste>Alt</Taste> + <Taste>H</Taste> abre y cierra esta ayuda.{" "}
            <Taste>Alt</Taste> + <Taste>T</Taste> muestra la lista de todos los
            atajos. <Taste>Alt</Taste> + <Taste>U</Taste> lleva a su propia
            práctica. <Taste>Alt</Taste> + <Taste>N</Taste> abre los mensajes,{" "}
            <Taste>Alt</Taste> + <Taste>K</Taste> el menú de colores y
            contraste, y <Taste>Alt</Taste> + <Taste>J</Taste> el menú de la
            cuenta.
          </p>
          <p className="m-0">
            La tecla Tab recorre las pestañas; Intro cambia de pestaña. Después
            del cambio, el foco está en la zona nueva - un lector de pantalla
            sigue leyendo desde allí.
          </p>
        </Abschnitt>

        <Abschnitt titel="Para saber más">
          <p className="m-0">
            La guía para docentes se abre arriba con "Descargas" - allí también
            encuentra el cartel de Tastenflow para imprimir y colgar (A3),
            disponible para todo el mundo, incluso sin iniciar sesión.
            {tastenflow && (
              <>
                {" "}
                La ayuda dentro del propio programa se abre allí con{" "}
                <Taste>Alt</Taste> + <Taste>H</Taste>.
              </>
            )}
          </p>
        </Abschnitt>
      </div>
    </Modal>
  );
}
