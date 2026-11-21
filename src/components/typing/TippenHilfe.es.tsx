/**
 * ★★★ ES-O (27.09.2026): DAS HILFE-FENSTER FÜR DIE LERNENDEN, SPANISCH.
 * ===========================================================================
 * Aus der Funktion geschrieben, nach dem Aufbau von `TippenHilfe.fr.tsx`
 * (dieselben Abschnitte, `detail`-Stufen, `isAdult`/`jugend`-Fälle) - nicht
 * Satz für Satz aus dem Deutschen übertragen. Wie Englisch und Französisch
 * ohne den Einführungs-Podcast (die spanische Bedienung hat keinen).
 *
 * ── ANREDE (Bauplan S9) ─────────────────────────────────────────────────────
 * Immer **tú** - Kinder UND Selbstlernende. Kein vosotros (neutral zwischen
 * Spanien und Lateinamerika), geschlechtergerecht über Sammelwörter („tu
 * docente", „el alumnado", S10).
 *
 * ── WAS SPANISCH ANDERS IST ALS FRANZÖSISCH ─────────────────────────────────
 *  · Die Reihenfolge: die Grundreihe trägt schon a und ñ; nach den häufigsten
 *    Buchstaben kommt die TILDE-Taste (Totaste, danach á é í ó ú), erst dann
 *    Mayús (`ES_LETTER_ORDER` in `lernweg.ts`).
 *  · Tastaturen: Spanien (ISO) und Lateinamerika (`LAYOUT_TEXTE_ES`); die
 *    Ziffern brauchen dort KEIN Mayús (anders als AZERTY).
 *  · Das Plakat gibt es auf Spanisch noch nicht - der Abschnitt sagt das.
 *
 * Glossar Bauplan §7 wörtlich: *fila guía, Mayús, Bloq Mayús, Intro,
 * Retroceso, barra espaciadora, tecla muerta, insignia, Configuración, leer en
 * voz alta, lector de pantalla, línea braille*, „pulsaciones por minuto"
 * ausgeschrieben; *el Reto*, *la Competición de la clase*, *el Juego de la
 * Banquisa*. Nur Bindestrich, gerade Anführungszeichen, keine Maus-Wörter.
 */
import { JawsRueckweg } from "./ScreenreaderHinweis";
import { useRef } from "react";
import {
  EINSTIEGSFENSTER_MIN,
  PRUEFUNG_WORT_ES,
  PRUEFUNG_WORT_MEHRZAHL_ES,
  layoutLetterOrder,
  skinForStufe,
  unitGlyph,
} from "@/lib/typing";
import { useFocusTrap } from "./useFocusTrap";
import { Zeichenerklaerung } from "@/lib/arbeitsblatt/Zeichenerklaerung";
import { AltText, Kbd, Section, detailFor, type TippenHilfeProps } from "./TippenHilfeTeile";
import { AltOderWahl, WeitereTasten } from "./TippenHilfeTasten";
import { RundgangNochmalKnopf } from "./Rundgang";
import { hoehleHatWesen } from "@/lib/typing/expedition/texts";
import { downloadAdresse, groesse, handbuchInSprache, tastenflowPlakat } from "@/lib/lernwerkstatt/handbuecher";

export function TippenHilfeSpanisch({ open, onClose, stufe, lernweg = "es" }: TippenHilfeProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  useFocusTrap(open, cardRef, { initialFocus: closeRef });
  if (!open) return null;

  const skin = skinForStufe(stufe);
  const isAdult = skin === "erwachsen";
  const kind = skin === "kind";
  const detail = detailFor(stufe);
  const letters = layoutLetterOrder(lernweg);
  // ★ 28.09.2026: das Höhlenwesen (deutsche Aufnahmen) gibt es nur auf Weg „de".
  const hoehleMitWesen = hoehleHatWesen(lernweg);
  // Dasselbe Wort wie der Ring (`UI_COPY_ES` in `skin.ts`).
  const ringWort = kind ? "nivel de juego" : "nivel";

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Ayuda de Tastenflow"
      onClick={onClose}
    >
      <div
        ref={cardRef}
        className="card my-8 w-full max-w-2xl space-y-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="m-0 text-xl font-semibold text-ink">Ayuda - cómo funciona "Tastenflow"</h2>
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

        <RundgangNochmalKnopf onStart={onClose} />

        <Section title="Escribe, sin más">
          <p className="m-0">
            No tienes que elegir nada antes. Escribe enseguida - la primera
            letra va directa al campo. Si acabas en otro sitio,{" "}
            <Kbd>Alt</Kbd> + <Kbd>E</Kbd> te lleva enseguida de vuelta al campo
            de práctica.
          </p>
          <JawsRueckweg weg="es" />
          {detail === 1 && (
            <p className="m-0">
              Escribe siempre con el dedo correcto - el teclado de abajo te
              muestra qué tecla viene ahora. Pulsa dos veces rápido{" "}
              <Kbd>Mayús</Kbd> para oír qué dedo usar.
            </p>
          )}
        </Section>

        <Section title="Los signos del texto">
          <Zeichenerklaerung
            titel={null}
            zeichen={[
              { zeichen: "·", bedeutung: "separa dos datos que van juntos - como una coma." },
              { zeichen: "→", bedeutung: "después, o: se convierte en esto." },
              { zeichen: "⏱", bedeutung: "tu tiempo de práctica hasta ahora." },
              {
                zeichen: "↵",
                bedeutung:
                  "aparece al final de una línea cuando tu clase tiene activado este ajuste - entonces terminas la línea con la tecla Intro.",
              },
            ]}
          />
        </Section>

        <Section title="Consigue estrellas 🌟">
          <p className="m-0">
            Después de cada serie recibes <strong>de 1 a 3 estrellas</strong> -
            cada una con su propio sonido.{" "}
            <strong>Pocos errores cuentan mucho más que la velocidad:</strong>{" "}
            escribir con calma y con cuidado da estrellas seguras - ir con prisa
            y pulsar muchas teclas equivocadas, no.
            {kind ? " ¡Todo el mundo puede conseguir estrellas!" : ""}
          </p>
          {detail >= 2 && (
            <p className="m-0">
              Consigues 3 estrellas con una serie muy buena - escrita con cuidado
              y a una velocidad adecuada, y <strong>con cuidado</strong> siempre
              cuenta más que <strong>rápido</strong>. Si encadenas buenas series
              durante un rato, puedes subir un <strong>nivel de
              dificultad</strong> - y la recompensa suena entonces un poco
              distinta.
            </p>
          )}
        </Section>

        <Section title="Consigue insignias 🏅">
          <p className="m-0">
            Por logros especiales ganas <strong>insignias</strong> - por
            ejemplo, por una serie sin ningún error o por varias series limpias
            seguidas. Cuando ganas una insignia nueva, oyes su propio{" "}
            <strong>"ta-chán"</strong> y se anuncia su nombre.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              Todas tus insignias están en <strong>"Mi progreso"</strong>, justo
              después de tus objetivos semanales y tus cifras - allí también
              encuentras siempre tu <strong>próximo objetivo</strong>. La
              mayoría de las insignias premian <strong>escribir con
              cuidado</strong> y <strong>no rendirse</strong> - no ir con prisa.
              Y algunas son <strong>secretas</strong>: lo que las desbloquea no
              está escrito en ninguna parte - simplemente aparecen.
            </p>
          )}
          {detail >= 2 && (
            <p className="m-0">
              Allí también encuentras tu <strong>puntuación</strong>: cuanto
              más cuidado y más constancia pones al escribir, más sube.
            </p>
          )}
          {detail >= 2 && (
            <p className="m-0">
              Más abajo, "Progreso en el tiempo" (una línea que se despliega)
              muestra una pequeña curva.
            </p>
          )}
          <p className="m-0">
            Un consejo: elige una insignia en tus estadísticas para verla en{" "}
            <strong>grande</strong> - con chispas y confeti.
          </p>
        </Section>

        {skin === "jugend" && (
          <Section title="Después de una tecla nueva">
            <p className="m-0">
              Una <strong>tecla nueva</strong> es tuya en cuanto dominas las
              anteriores - no tienes que ganar nada para tenerla. Se celebra y
              sigues. Nada más.
            </p>
            <p className="m-0">
              Si quieres, después puede venir un juego corto:{" "}
              <strong>el Juego de la Banquisa</strong>. Lo eliges tú - en la{" "}
              <strong>configuración</strong> (<AltText>Alt + O</AltText>), en{" "}
              <strong>Juego de recompensa</strong>. De entrada está en{" "}
              <strong>Ninguno</strong>. Este ajuste vale para este dispositivo.
            </p>
          </Section>
        )}

        {!isAdult && (
          <Section title="El Juego de la Banquisa 🐧">
            {skin === "jugend" ? (
              <>
                <p className="m-0">
                  Puedes <strong>empezarlo tú cuando quieras</strong> - con el
                  botón <strong>Jugar</strong> de la línea bajo el campo de
                  práctica. El pingüino salta de témpano en témpano, sube la
                  montaña de letras y baja deslizándose sobre la barriga -
                  siempre con las teclas que ahora mismo más te cuestan. Por el
                  camino saltan del agua <strong>peces extra</strong> (si
                  pulsas a tiempo la tecla de un pez, lo atrapas; dejarlo
                  escapar nunca cuenta como error), y en la{" "}
                  <strong>Cueva del Eco</strong> cada tecla solo se anuncia. El juego <strong>no cuenta</strong> como tiempo de
                  práctica ni hace falta para desbloquear teclas nuevas - pero
                  tiene sus propias insignias.
                </p>
                <p className="m-0">
                  Después de una tecla nueva, <strong>solo</strong> empieza si
                  lo has elegido como <strong>juego de recompensa</strong> en la
                  configuración. Si no, nada te interrumpe - tú decides cuándo
                  jugar.
                </p>
              </>
            ) : (
              <>
                <p className="m-0">
                  Cuando consigues una <strong>tecla nueva</strong>, el Juego de
                  la Banquisa te espera para celebrarlo: ayuda al pingüino a
                  cruzar el agua - ¡pulsa siempre la tecla del témpano
                  siguiente! A veces, después, hasta subes la{" "}
                  <strong>montaña de letras</strong> y bajas deslizándote sobre
                  la barriga. La tecla nueva ya es tuya antes de jugar - el
                  juego es un premio, no una obligación.
                </p>
                <p className="m-0">
                  También puedes <strong>empezar el juego tú cuando
                  quieras</strong> - con el botón <strong>Jugar</strong> arriba
                  en tu tarjeta de práctica, justo al lado del anillo. Es la
                  gran <strong>aventura</strong>: cambia un poco cada día, por
                  el camino saltan <strong>peces extra</strong> (pulsa rápido su
                  tecla para atraparlos), y en la <strong>Cueva del
                  Eco</strong> no ves ninguna letra -{" "}
                  {hoehleMitWesen ? (
                    <>
                      la cueva te <strong>dice</strong> cada tecla.
                    </>
                  ) : (
                    <>
                      cada tecla suena, y el lector de pantalla o la línea
                      braille te <strong>dice</strong> cuál es.
                    </>
                  )}{" "}
                  Es solo por diversión y{" "}
                  <strong>no cuenta</strong> como tiempo de práctica - ¡pero hay
                  insignias que ganar!
                </p>
                {detail >= 2 && (
                  <p className="m-0">
                    No te preocupes: si un témpano se hunde o resbalas en la
                    montaña, el pingüino vuelve nadando sin más - puedes
                    intentarlo otra vez enseguida, todas las veces que quieras.
                    ¡Y si cruzas toda la aventura sin caerte al agua ni una vez,
                    verás bailar <strong>la aurora austral</strong> sobre el iglú!
                  </p>
                )}
              </>
            )}
          </Section>
        )}

        <Section title="¿Qué significa el anillo con el número?">
          <p className="m-0">
            El número del anillo es tu <strong>{ringWort}</strong>.{" "}
            <strong>Los puntos son lo que ganas al practicar:</strong> recibes
            algunos con cada serie, y el anillo se va llenando. Cuando está lleno
            (100 puntos), subes un {ringWort}. Es solo para coleccionar,{" "}
            <strong>no</strong> hace más difícil la práctica - como los puntos
            de un juego.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              No lo confundas con el <strong>nivel de dificultad (1-50)</strong>:
              indica a qué velocidad deberías escribir y se ajusta a ti{" "}
              <strong>por sí solo</strong> - sube cuando va bien y baja cuando
              es demasiado difícil.
            </p>
          )}
          {detail >= 3 && (
            <p className="m-0">
              Y el <strong>nivel de los textos</strong> solo decide lo difíciles
              que son las palabras y las frases - para que vayan con tu edad. En
              una clase lo fija tu docente para todo el grupo; sin clase, lo
              encuentras arriba en la configuración ⚙. Son tres cosas distintas:
              el <em>{ringWort}</em> = los puntos, el{" "}
              <em>nivel de dificultad</em> = la velocidad esperada, el{" "}
              <em>nivel de los textos</em> = tu edad.
            </p>
          )}
        </Section>

        <Section title={detail === 1 ? "¿Cada cuánto practicar?" : "Tiempo de práctica y objetivo semanal"}>
          {detail === 1 ? (
            <p className="m-0">
              Es mejor practicar <strong>poco y a menudo</strong> que una sola
              vez mucho rato - por ejemplo, unos minutos varios días seguidos. En
              la línea bajo el campo de práctica, un reloj cuenta cuánto has
              escrito hoy; ese mismo tiempo llena también el{" "}
              <strong>anillo</strong> que hay allí - tu objetivo semanal.
            </p>
          ) : (
            <p className="m-0">
              Con una cuenta puedes tener un <strong>objetivo semanal</strong>:
              un número de <strong>minutos por semana</strong>. En una clase lo
              fija tu docente; sin clase, lo fijas tú en la configuración ⚙, en
              "Mi objetivo semanal" - un objetivo nuevo vale a partir del lunes
              siguiente. La semana empieza <strong>el lunes a las 8</strong> y
              termina el lunes siguiente a las 8. En la línea bajo el campo de
              práctica, tu avance aparece como un <strong>anillo</strong>, por
              ejemplo "25 de 60 min" - cuando alcanzas el objetivo, está lleno y
              con una marca. A veces también hay minutos pendientes de una
              semana anterior que <strong>recuperar</strong>; entonces el número
              aparece al lado. Cuando alcanzas tu objetivo semanal, se abre una
              ventana corta para felicitarte - después puedes seguir practicando
              cuando quieras.
            </p>
          )}
        </Section>

        <Section title="Configuración ⚙ en la cabecera">
          <p className="m-0">
            Todos los ajustes están detrás del botón{" "}
            <strong>⚙ Configuración</strong>, arriba del todo, justo a la
            izquierda del botón redondo con tu inicial:{" "}
            <strong>¿Qué practicas?</strong>, <strong>Textos</strong> (edad e
            idioma), <strong>Teclado</strong>, <strong>Sonido</strong> y{" "}
            <strong>Lectura en voz alta</strong>. Púlsalo una vez para abrirla y
            otra vez para cerrarla - o usa <Kbd>Alt</Kbd> + <Kbd>O</Kbd>, que
            también funciona mientras escribes. Al abrirse, el cursor salta
            directamente allí; al cerrarse, vuelve al campo de práctica.
          </p>
          <p className="m-0">
            Arriba en la configuración está <strong>"¿Qué practicas?"</strong>:
            las tres formas de practicar, <strong>Mi entrenamiento</strong>,{" "}
            <strong>Cuentos</strong> y <strong>Juegos de palabras</strong>.{" "}
            <Kbd>Alt</Kbd> + <Kbd>B</Kbd> pasa a la siguiente, y se anuncia la
            nueva elección.
          </p>
          <p className="m-0">
            El botón redondo con el globo, en la cabecera, cambia el idioma de
            Tastenflow - botones, menús y también tus textos de práctica;
            después puedes cambiar solo el idioma de los textos, en{" "}
            <strong>Textos</strong>, salvo que tu docente ya lo haya fijado.
          </p>
          <p className="m-0">
            En <strong>Teclado</strong> eliges el teclado que tienes de verdad
            delante: español de España o latinoamericano. El teclado de la
            pantalla y las indicaciones de los dedos se ajustan a él - y solo
            recibes los caracteres que existen en ese teclado. Los dos teclados
            se parecen mucho. Esto es lo más importante que cambia:
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              La <strong>tecla de la tilde</strong> <Kbd>´</Kbd>: en el teclado
              de España está a la derecha de la ñ; en el latinoamericano, a la
              derecha de la p.
            </li>
            <li>
              <strong>¿ y ¡</strong> están en la misma tecla, pero al revés: en
              el de España, ¡ sale directo y ¿ con <Kbd>Mayús</Kbd>; en el
              latinoamericano, ¿ sale directo y ¡ con <Kbd>Mayús</Kbd>.
            </li>
            <li>
              La <strong>@</strong>: en el de España, <Kbd>Alt Gr</Kbd> +{" "}
              <Kbd>2</Kbd>; en el latinoamericano, <Kbd>Alt Gr</Kbd> +{" "}
              <Kbd>Q</Kbd>.
            </li>
            <li>
              El teclado latinoamericano no tiene el signo del{" "}
              <strong>euro (€)</strong>.
            </li>
          </ul>
          <p className="m-0">
            Allí también está <strong>"Escribir con una mano"</strong> - para
            quien escribe con una sola mano: las mayúsculas y los signos cuentan
            entonces con cualquier tecla Mayús. En una clase, esto lo ajusta tu
            docente.
          </p>
          <p className="m-0">
            Con <strong>"Espacio entre caracteres (CVI)"</strong>, todo se
            oscurece mientras escribes salvo el campo donde escribes (la línea
            de práctica o la zona de juego); tras 5 segundos sin pulsar ninguna
            tecla, todo vuelve a verse claro. La línea de práctica avanza a tu
            propio ritmo en lugar de saltar. El espacio entre caracteres lo
            cambias tú en la configuración ⚙ cuando quieras - en una clase,
            también puede cambiarlo tu docente; vale la última elección.
          </p>
          <p className="m-0">
            Con <strong>Práctica dirigida</strong> puedes elegir hasta 8 teclas o caracteres que aparecen especialmente a menudo en las rondas - en la configuración, en <strong>¿Qué practicas?</strong>, o con <Kbd>Alt</Kbd> + <Kbd>2</Kbd>. En una clase lo ajusta tu docente.
          </p>
        </Section>

        <Section title="Lectura en voz alta - el programa te lee">
          <p className="m-0">
            Con <strong>🗣 Lectura en voz alta</strong> (o <Kbd>Alt</Kbd> +{" "}
            <Kbd>V</Kbd>), el programa te lee - para quien (todavía) no usa un
            lector de pantalla. Arriba en la configuración ⚙ eliges si se leen
            en voz alta las <strong>letras</strong> (deletreo), las{" "}
            <strong>palabras</strong> y/o las <strong>frases</strong>, y a qué
            velocidad.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              En <strong>"Voz"</strong> puedes elegir otra voz. Si el idioma es
              el <strong>español</strong>, el programa busca solo una voz en
              español; si no hay ninguna instalada, una guía corta te muestra
              cómo añadirla.
            </p>
          )}
          {detail >= 3 && (
            <p className="m-0">
              No te preocupes por tu velocidad: el{" "}
              <strong>tiempo de lectura se descuenta</strong> - esperar a que
              termine un anuncio no baja tu velocidad.
            </p>
          )}
        </Section>

        <Section title="La melodía al escribir 🎵">
          <p className="m-0">
            La <strong>melodía al escribir</strong> sirve para practicar un <strong>ritmo de escritura regular</strong>, y sobre todo debe ser <strong>divertida</strong>. Cada tecla correcta toca la siguiente nota de una canción; si mantienes el compás, hasta se une una banda.
          </p>
          <p className="m-0">
            Quien escribe con regularidad también se vuelve más fluido en sus teclas más flojas: el ritmo te lleva por los pasajes donde antes dudarías.
          </p>
          <p className="m-0">
            Actívala con <Kbd>Alt</Kbd> + <Kbd>6</Kbd>, en los ajustes ⚙ o en el menú bajo el botón redondo del altavoz, donde también ajustas el volumen de cada sonido con deslizadores. Cambia el sonido con <Kbd>Alt</Kbd> + <Kbd>7</Kbd> y <Kbd>Alt</Kbd> + <Kbd>8</Kbd>.
          </p>
        </Section>

        <Section title="Mayúsculas y signos de puntuación">
          <p className="m-0">
            Los textos necesitan <strong>mayúsculas</strong> - al empezar una
            frase y en cada nombre propio. Tastenflow las pone{" "}
            <strong>siempre bien</strong>, así que nunca ves una palabra mal
            escrita.
          </p>
          <p className="m-0">
            <strong>Muy fácil al principio:</strong> escribe la letra en{" "}
            <strong>minúscula</strong> - la <strong>mayúscula</strong> aparece
            sola. Para eso <strong>todavía no</strong> necesitas conocer la
            tecla <Kbd>Mayús</Kbd>.
          </p>
          <p className="m-0">
            <strong>Pronto</strong>, después de las primeras letras, aprendes a
            usar la tecla <Kbd>Mayús</Kbd> "de verdad": la mantienes pulsada con{" "}
            <strong>una</strong> mano y escribes la letra con la{" "}
            <strong>otra</strong> - como en cualquier teclado. Así pronto
            escribirás las mayúsculas <strong>tú</strong>, sin la ayuda
            automática.
          </p>
          <div className="rounded-lg border border-hairline bg-surface-raised p-3">
            <p className="m-0">
              <strong>Importante - siempre la tecla Mayús de la mano
              CONTRARIA:</strong> hay dos teclas Mayús, una a la izquierda y otra
              a la derecha. Escribe la letra con una mano y mantén{" "}
              <Kbd>Mayús</Kbd> con la <strong>otra</strong>. Así una sola mano
              nunca tiene que pulsar las dos teclas.
            </p>
            <p className="m-0 mt-2">
              Ejemplo: <strong>A</strong> mayúscula (mano izquierda) →{" "}
              <strong>Mayús de la derecha</strong>. <strong>K</strong> mayúscula
              (mano derecha) → <strong>Mayús de la izquierda</strong>.
            </p>
            <p className="m-0 mt-2">
              Tastenflow <strong>solo acepta la tecla Mayús correcta</strong>.
              Si usas la tecla Mayús <strong>equivocada</strong> o{" "}
              <Kbd>Bloq Mayús</Kbd>, sale la letra en{" "}
              <strong>minúscula</strong> - eso cuenta como un{" "}
              <strong>error de pulsación</strong>, para que practiques desde el
              principio con la mano correcta.
            </p>
          </div>
          {detail >= 2 && (
            <p className="m-0 text-sm text-ink-muted">
              Un consejo: pulsa <strong>dos veces rápido</strong>{" "}
              <Kbd>Mayús</Kbd> para oír con qué dedo mantenerla.
            </p>
          )}
          <p className="m-0">
            <strong>El punto, la coma y los signos de interrogación</strong>{" "}
            solo aparecen cuando ya los has aprendido. Mientras tanto, lees la
            frase <strong>sin ellos</strong> - es a propósito, no es un error.
          </p>
        </Section>

        <Section title="¿En qué orden llegan las letras?">
          <p className="m-0">
            Las teclas nuevas llegan siempre en el mismo orden: primero la{" "}
            <strong>fila guía</strong> (con la <Kbd>ñ</Kbd>), después las demás
            letras, las más frecuentes primero. Siempre ves qué tecla viene
            ahora, a la derecha del todo en la línea bajo el campo de práctica:{" "}
            <strong>"Tecla siguiente"</strong>.
          </p>
          <div className="flex flex-wrap gap-1" aria-hidden="true">
            {letters.map((ch) => (
              <Kbd key={ch}>{unitGlyph(ch)}</Kbd>
            ))}
          </div>
          <p className="m-0 text-sm text-ink-muted">
            Tras las primeras letras llega la <strong>tecla de la
            tilde</strong> <Kbd>´</Kbd> - una tecla muerta: la pulsas, después la
            vocal, y juntas dan "á" o "é". Luego vienen las{" "}
            <strong>mayúsculas</strong> (la tecla Mayús) y, justo después, el{" "}
            <strong>punto y la coma</strong>: una frase empieza con mayúscula y
            termina con punto. Después, las letras que quedan, con la diéresis
            de "ü". Al final llegan los demás{" "}
            <strong>signos de puntuación</strong> (también ¿ y ¡), los{" "}
            <strong>números</strong> y los <strong>caracteres
            especiales</strong>.
          </p>
        </Section>

        {detail >= 2 && (
          <Section title='Cómo funciona "Mi entrenamiento"'>
            <p className="m-0">
              <strong>Se adapta a ti.</strong> El programa recuerda qué teclas
              todavía se te escapan y practica justo esas. Una tecla nueva solo
              llega cuando dominas las demás. Las letras{" "}
              <strong>más frecuentes</strong> llegan primero - así, con solo unas
              pocas teclas, ya escribes <strong>palabras y frases de
              verdad</strong>, y los primeros <strong>cuentos</strong> se
              desbloquean pronto.
            </p>
          </Section>
        )}

        <Section title="La línea bajo el campo de práctica">
          <p className="m-0">
            Bajo el campo de práctica hay una línea estrecha con cuatro datos:
            tu <strong>{ringWort}</strong>, el <strong>tiempo</strong>{" "}
            practicado hoy, tu <strong>objetivo semanal</strong> y la{" "}
            <strong>tecla siguiente</strong>. Para el objetivo semanal, el
            anillo muestra cuántos <strong>minutos</strong> has practicado esta
            semana - por ejemplo "25 de 60 min"; una <strong>marca</strong>{" "}
            significa que has alcanzado el objetivo. La tecla siguiente se
            desbloquea <strong>sola</strong> en cuanto dominas las anteriores -
            basta con seguir.
          </p>
          <p className="m-0">
            La línea está <strong>siempre</strong> ahí - también mientras
            escribes. Así nada salta, y ves en todo momento cuánto tiempo llevas
            practicando.
          </p>
          <p className="m-0">
            <Kbd>Alt</Kbd> + <Kbd>D</Kbd> anuncia tu tiempo de práctica y tu
            objetivo semanal. Las teclas que dominas, las que todavía no han
            llegado y la que viene ahora aparecen en{" "}
            <strong>"Mi progreso"</strong>, en{" "}
            <strong>"Estado de las teclas"</strong> (<Kbd>Alt</Kbd> +{" "}
            <Kbd>S</Kbd>, con una cuenta).
          </p>
        </Section>

        <Section title='La biblioteca: "Cuentos y saberes" 📖'>
          <p className="m-0">
            Además de "Mi entrenamiento" hay otra forma de practicar: los{" "}
            <strong>Cuentos</strong> - en la configuración ⚙, en{" "}
            <strong>"¿Qué practicas?"</strong>. Allí encuentras cuentos enteros
            y series de divulgación - no frases sueltas, sino{" "}
            <strong>una historia a lo largo de varias series</strong>. Cada paso
            tiene doce líneas; la vez siguiente sigues justo donde lo dejaste.
          </p>
          <p className="m-0">
            Solo aparece lo que de verdad puedes escribir con las teclas que ya
            has aprendido - por eso al principio todavía ves candados. Se abren
            solos en cuanto dominas suficientes teclas. Cada línea llega{" "}
            <strong>una sola vez</strong>: lo que ya has escrito no vuelve para
            repetirlo.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              <strong>El hilo conductor:</strong> lo que has leído en una serie
              de divulgación vuelve más tarde en tu entrenamiento - como una{" "}
              <strong>pregunta hecha de otra manera</strong>, después como un
              pequeño detalle más y al final como un chiste sobre el tema. Así
              lo aprendido se queda, sin parecer un examen.
            </p>
          )}
        </Section>

        <Section title="¿De dónde salen los textos? 🤖">
          <p className="m-0">
            Los textos propios del programa - frases de práctica, chistes y
            cuentos - los escribió Johannes{" "}
            <strong>con ayuda de la inteligencia artificial (IA)</strong>. Los
            textos de otras fuentes
            llevan su nombre en "Fuentes y agradecimientos".
          </p>
          {/* ★ D1 Randfund (28.09.2026): „la criatura que susurra" gibt es auf
              Weg „es" nicht (die Höhle spielt einen Ton) - nur der Fisch. Auf
              Weg „de" gibt es sie (`hoehleHatWesen`): dort der frühere Wortlaut. */}
          <p className="m-0">
            {hoehleMitWesen ? (
              <>
                El pez que canta y la criatura que susurra en la Expedición polar
                también son <strong>voces sintéticas</strong>, no personas de
                verdad.
              </>
            ) : (
              <>
                El pez que canta en la Expedición polar también es una{" "}
                <strong>voz sintética</strong>, no una persona de verdad.
              </>
            )}{" "}
            La
            lectura en voz alta (🗣) usa la voz de lectura de tu dispositivo.
          </p>
        </Section>

        <Section title={`El ${PRUEFUNG_WORT_ES}`}>
          <p className="m-0">
            A veces tu docente lanza un <strong>{PRUEFUNG_WORT_ES}</strong> -
            para toda la clase. <strong>Todo el mundo recibe el mismo
            texto</strong> y todo el mundo tiene el mismo tiempo.
          </p>
          <p className="m-0">
            <strong>El tiempo solo empieza con tu primera pulsación</strong> - no
            cuando tu docente lanza el {PRUEFUNG_WORT_ES}. Desde que se lanza,
            tienes <strong>{EINSTIEGSFENSTER_MIN} minutos</strong> para empezar.
          </p>
          <p className="m-0">
            <strong>Cómo reconocerlo:</strong> encima del campo de práctica pone{" "}
            <strong>{PRUEFUNG_WORT_ES}</strong>, con el tiempo al lado, y toda la
            zona tiene un <strong>borde de puntos</strong> distinto. En cuanto
            se acaba el tiempo, desaparecen los dos.
          </p>
          <p className="m-0">
            <strong>Cuánto tiempo queda, sin mirar:</strong> <Kbd>Alt</Kbd> +{" "}
            <Kbd>X</Kbd> te lo dice. El reloj solo habla por sí mismo unas
            pocas veces; el resto del tiempo se queda callado.
          </p>
          <p className="m-0">
            <strong>La línea braille se queda tranquila.</strong> El tiempo{" "}
            <strong>no</strong> corre en la línea: avanza arriba, pero nunca se
            mete en lo que estás leyendo.
          </p>
          <p className="m-0">
            <strong>A veces el {PRUEFUNG_WORT_ES} es de "Escritura
            libre".</strong> Entonces un error se queda donde se escribió - no se
            señala nada, ningún sonido lo marca. Retroceso solo corrige dentro de
            la línea actual; una línea terminada se queda como está. Al final de
            una línea, pulsa la barra espaciadora después de la última palabra -
            o, si la clase tiene activado "Final de línea con Intro", pulsa
            Intro en su lugar. Lo que al final sigue mal solo aparece después,
            en los resultados, como una lista para leer.
          </p>
          <p className="m-0">
            <strong>Parar antes de tiempo:</strong> <Kbd>Esc</Kbd> primero te
            pide confirmación. <strong>"Seguir escribiendo"</strong> (o{" "}
            <Kbd>Esc</Kbd>) te devuelve a la línea; <strong>"Entregar"</strong>{" "}
            entrega lo que has escrito - se valora lo escrito hasta ahí. El
            botón <strong>"Terminado - entregar"</strong> bajo el campo hace lo
            mismo, sin preguntar.
          </p>
          <p className="m-0">
            <strong>Cuando se acaba el tiempo,</strong> tus resultados aparecen
            enseguida: pulsaciones por minuto, precisión, caracteres, errores,
            líneas y las teclas que aún fallan. Después, cada{" "}
            {PRUEFUNG_WORT_ES} se queda en <strong>"Mi progreso"</strong>, en{" "}
            <strong>{PRUEFUNG_WORT_MEHRZAHL_ES}</strong> - puedes volver a
            mirarlo cuando quieras.
          </p>
        </Section>

        <Section title="Competición de la clase ⚔️">
          <p className="m-0">
            En una Competición de la clase haces una <strong>carrera de
            escritura de cinco minutos</strong> con el resto de tu clase. La
            Competición de la clase solo existe dentro de una clase, y solo si
            tu docente la permite.
          </p>
          <p className="m-0">
            <strong>Empezarla:</strong> <Kbd>Alt</Kbd> + <Kbd>M</Kbd>, o el botón{" "}
            <strong>Competición de la clase</strong> de la línea encima del campo
            de práctica - justo al lado de <strong>Jugar</strong>. Todas las
            demás personas reciben entonces una ventana:{" "}
            <strong>"Participo"</strong> o <strong>"Ahora no"</strong>.{" "}
            <Kbd>Esc</Kbd> te devuelve a practicar, y la misma invitación no
            vuelve por sí sola.
          </p>
          <p className="m-0">
            <strong>Si alguien ya está invitando,</strong> <Kbd>Alt</Kbd> +{" "}
            <Kbd>M</Kbd> hace que esa invitación vuelva a aparecer - una segunda
            competición solo puede empezar cuando la primera está en marcha. Si
            dos personas invitan casi a la vez, cuenta la invitación que llegó
            primero.
          </p>
          <p className="m-0">
            <strong>Cuando no se puede enseguida:</strong> si ya estás en una
            competición, el botón dice{" "}
            <strong>"Competición de la clase en curso"</strong> - y{" "}
            <Kbd>Alt</Kbd> + <Kbd>M</Kbd> te dice lo mismo. Las otras
            competiciones de tu clase no molestan: pueden correr varias a la vez.
          </p>
          <p className="m-0">
            <strong>Cada persona escribe con las teclas que ya ha
            aprendido.</strong> Si ya sabes los números, te tocan números; si vas
            por la fila guía, te toca la fila guía. Los errores salen caros - una
            tecla equivocada cuenta como cinco caracteres.
          </p>
          <p className="m-0">
            <strong>Cómo vas, sin mirar:</strong> a la izquierda del todo en la
            línea de práctica hay siempre ocho celdas: <strong>P2</strong> es tu
            puesto, seguido del tiempo que queda. <Kbd>Alt</Kbd> + <Kbd>X</Kbd>{" "}
            te dice tu puesto, el tiempo y los tres primeros puestos. Nada habla
            por sí solo - la línea braille se queda tranquila.
          </p>
          <p className="m-0">
            <strong>Parar antes de tiempo:</strong> <Kbd>Esc</Kbd> o el botón{" "}
            <strong>"Salir"</strong> primero te piden confirmación.{" "}
            <strong>"Seguir escribiendo"</strong> (o <Kbd>Esc</Kbd>) te devuelve
            a la línea. <strong>"Salir"</strong> termina la competición solo para
            ti - las demás personas siguen escribiendo y ven lo que has escrito.
          </p>
          <p className="m-0">
            <strong>La competición cuenta como tiempo de práctica</strong> y
            puede desbloquear una tecla nueva - como una serie de práctica
            normal. <strong>No se guarda ningún puesto.</strong> Al final ves la
            lista: Oro, Plata y Bronce para los tres primeros puestos, y el
            resto con su número. Después, <strong>"Seguir practicando"</strong>{" "}
            o <Kbd>Esc</Kbd> te devuelven.
          </p>
        </Section>

        <Section title="Teclas importantes">
          <p className="m-0 text-sm text-ink-muted">
            <AltOderWahl>
              En un Mac, <Kbd>Alt</Kbd> es la tecla <Kbd>⌥</Kbd> (Opción).
            </AltOderWahl>
          </p>
          <ul className="m-0 list-none space-y-2 p-0">
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Esc</Kbd>
              </span>
              <span>
                <strong>La tecla más importante:</strong> cierra cualquier
                ventana, y después el cursor está{" "}
                <strong>siempre en el campo de práctica</strong>. Aunque no haya
                nada abierto, <Kbd>Esc</Kbd> te lleva allí. La única excepción es
                "Explorar el teclado": allí <Kbd>Esc</Kbd> es una tecla más para
                explorar, y solo la segunda pulsación te hace salir.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Mayús</Kbd> <Kbd>Mayús</Kbd>
              </span>
              <span>Dos pulsaciones rápidas: se anuncia el dedo correcto.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>E</Kbd>
              </span>
              <span>Va al campo de práctica.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>U</Kbd>
              </span>
              <span>Va a la práctica.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>S</Kbd>
              </span>
              <span>
                Abre Mi progreso (docentes: Mis clases). Solo después de iniciar
                sesión. Púlsalo otra vez para volver al campo de práctica.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>Z</Kbd>
              </span>
              <span>Anuncia en qué línea estás.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>D</Kbd>
              </span>
              <span>
                Te dice tu tiempo de práctica - en la línea braille y (con la
                lectura en voz alta) como anuncio.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>L</Kbd>
              </span>
              <span>Anuncia en qué {ringWort} estás.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>3</Kbd>
              </span>
              <span>
                <strong>Explorar el teclado:</strong> cada tecla que pulsas se
                anuncia y se muestra en grande - primero el nombre corto,
                después el nombre completo y después para qué sirve. Funciona con
                todas las teclas especiales y los signos de puntuación, con los
                caracteres de Alt Gr (en un Mac: Opción), diciendo cómo se llega
                a ellos, y con combinaciones como Ctrl + C. Los atajos propios de
                Tastenflow (<AltText>Alt + H, Alt + V …</AltText>) siguen funcionando. El teclado de
                la pantalla muestra qué tecla se ha pulsado. Si la lectura en voz
                alta está desactivada, la voz se queda callada. En la línea
                braille, la explicación se queda hasta la tecla siguiente, y
                puedes leerla entera con las teclas de desplazamiento; en la
                pantalla aparece en una ventana. No se escribe nada y no se
                pierde nada. <Kbd>Mayús</Kbd> da el carácter de arriba de una tecla y <Kbd>AltGr</Kbd> (en Mac: <Kbd>Opción</Kbd>) el tercero; así puedes probar todos los caracteres uno a uno.{" "}<strong>Para salir:</strong> <Kbd>Alt</Kbd> +{" "}
                <Kbd>3</Kbd> otra vez, dos veces <Kbd>Esc</Kbd> - o simplemente
                volver a cargar la página.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>4</Kbd>
              </span>
              <span>
                <strong>Buscar teclas:</strong> se nombra una tecla y tú la
                buscas. La primera vez que la encuentras, oyes "¡Encontrada!
                Pulsa otra tecla, luego otra vez …" - solo cuenta la segunda
                pulsación, y solo después de otra tecla entre las dos. Después
                llega la tecla siguiente. Cualquier otra tecla solo se nombra. En
                la ventana, <Kbd>Alt</Kbd> + <Kbd>4</Kbd> cambia entre explorar y
                buscar. <strong>Para salir:</strong> igual que al explorar.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>K</Kbd>
              </span>
              <span>
                <strong>Colores y contraste:</strong> siete combinaciones de
                colores - claro, oscuro, negro sobre amarillo, amarillo sobre
                azul y otras. Cada una ya aparece con sus propios colores en la
                lista, para ver cómo es antes de elegirla.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>T</Kbd>
              </span>
              <span>Abre o cierra la lista de atajos de teclado.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>N</Kbd>
              </span>
              <span>Abre o cierra los mensajes de tu docente.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>+</Kbd> / <Kbd>-</Kbd>
              </span>
              <span>Agranda / reduce el campo de práctica.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>V</Kbd>
              </span>
              <span>Activa o desactiva la lectura en voz alta.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>H</Kbd>
              </span>
              <span>Abre o cierra esta ayuda.</span>
            </li>
            <WeitereTasten />
          </ul>
        </Section>

        {detail >= 3 && (
          <Section title="Cómo te ayuda el programa a avanzar">
            <p className="m-0">
              El programa mide cada letra por separado - con qué precisión y a
              qué velocidad la escribes. Practica solo las que más lo necesitan y
              solo desbloquea una letra nueva cuando dominas las anteriores. Así
              sigues tu propio camino de aprendizaje.
            </p>
            <p className="m-0">
              El nivel de dificultad (1-50) hace que todo sea siempre{" "}
              <strong>exigente pero posible</strong>: si va bien, sube; si es
              demasiado difícil, baja. En <strong>"Mi progreso"</strong> ves todo
              sobre tu avance - y cómo vas mejorando.
            </p>
          </Section>
        )}

        <Section title="Practicar sin clase - una cuenta propia 🙋">
          <p className="m-0">
            Si no perteneces a ninguna clase, creas tú una cuenta: abre el botón
            redondo <strong>"Cuenta"</strong> y marca{" "}
            <strong>"Practico por mi cuenta, sin clase"</strong>. Para eso
            necesitas una dirección de correo electrónico: allí llega el resumen
            semanal los lunes - pero solo después de una semana con práctica. Si
            Tastenflow no se abre durante un año entero, llega
            un aviso por correo electrónico; si nadie inicia sesión en las tres
            semanas siguientes, la cuenta se borra con todo su progreso.
          </p>
          {/* ★ 28.09.2026 (Johannes): die anderen Apps gibt es nur auf Deutsch -
              hier stand „Tu progreso cuenta en los cuatro programas …". */}
        </Section>

        <PlakatAbschnitt />
      </div>
    </div>
  );
}

/** ★ 28.09.2026: el cartel para colgar - ahora también en español. */
function PlakatAbschnitt() {
  const plakat = handbuchInSprache(tastenflowPlakat(), "es");
  return (
    <Section title="Un cartel para colgar">
      <p className="m-0">
        ¿Quieres mostrar Tastenflow en tu escuela o centro? Aquí tienes un{" "}
        <strong>cartel para imprimir y colgar</strong>: A3, vertical, con lo
        que Tastenflow ofrece de un vistazo y un código QR a tastenflow.org.
      </p>
      <p className="m-0">
        <a
          href={downloadAdresse(plakat)}
          download={plakat.speicherName}
          type="application/pdf"
          className="text-accent underline underline-offset-2"
        >
          Descargar el cartel (PDF, A3, {groesse(plakat.bytes, "es")})
        </a>
      </p>
    </Section>
  );
}
