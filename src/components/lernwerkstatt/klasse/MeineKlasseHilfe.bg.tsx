/**
 * ★★★ O-BG (29.10.2026): DIE HILFE ZU „MEINE KLASSEN" AUF BULGARISCH.
 * ===========================================================================
 * Massgeblich ist die deutsche Fassung (`MeineKlasseHilfe.tsx`): dieselben
 * Abschnitte, dieselben Tatsachen; der Aufbau folgt `MeineKlasseHilfe.uk.tsx`
 * (Zweig `o-hilfe-uk`) und `MeineKlasseHilfe.cs.tsx`. Sichtbar nur mit
 * `spracheGewaehlt === "bg"`; jedes Programm ohne Sprach-Anbieter zeigt weiter
 * die deutsche Fassung. Titel nach Glossar §2.5: „Помощ - Моите класове".
 *
 * Anrede (Glossar `recherche-bulgarisch-2026-10-25/GLOSSAR-bg.md`, Regel 1
 * und 2): die Lehrkraft mit Вие-Form, Imperativ auf -ете, „вие/ви" klein.
 * Kinder heissen in dieser Sicht „ученици" (Mehrzahl) bzw. „детето" (sächlich) -
 * nie ein Adjektiv oder l-Partizip am einzelnen Kind. Was die Lehrkraft der
 * Klasse sagt, steht in der Mehrzahl-Befehlsform. Knopf- und Feldnamen im
 * Fliesstext in „…“ (Regel 7, wie `LehrerHilfe.bg.tsx`), Namen nur nach
 * Doppelpunkt (Regel 12), Zähler mit Schrägstrich („Готови: 12/14", §2.12).
 *
 * ⚠️ Die Namen der Startpunkte („Womit anfangen?") hat `startpunkteBg.ts` noch
 * nicht (G3c - bis dahin englisch). Die Hilfe nennt die Stufen nach dem
 * Glossar (§2.3 „използвани клавиши", Regel 2 „Съвсем отначало"); die
 * Buchstaben jenseits der Grundreihe nennt sie nicht - die Reihenfolge des
 * Weges „bg" entsteht parallel (F4). Wer die Namen in `startpunkteBg.ts`
 * einträgt, gleicht diesen Absatz an.
 *
 * Der deutsche Satz über den Mauszeiger (Hinweis „sobald der Zeiger darauf
 * steht") steht hier nur mit dem Tastenweg (Hausregel: ohne Maus-Vokabular).
 */
import { Modal } from "@/components/Modal";
import { RundgangMeineKlassenKnopf } from "@/components/typing/Rundgang";
import {
  DreiWerteHilfe,
  LeistungsstufeHilfe,
  SpaltenHilfe,
} from "@/components/typing/TastenflowZahlenHilfe";
import { EINSTIEGSFENSTER_MIN } from "@/lib/typing/schreibprobe";
import { mehrzahl } from "@/lib/bedienSprache";

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

// „Предизвикателство" (Glossar §2.3, sächlich) steht ausgeschrieben im Text -
// mit Artikel „Предизвикателството", Mehrzahl „предизвикателства".
export function MeineKlasseHilfeBulgarisch({
  onClose,
  programmName,
}: {
  onClose: () => void;
  /** Das offene Programm - davon hängt ab, welche Abschnitte dastehen. */
  programmName?: string;
}) {
  const tastenflow = programmName === "Tastenflow";
  // „минута" ist weiblich - keine eigene Zählform (Glossar §2.11).
  const einstiegsMinuten = mehrzahl(EINSTIEGSFENSTER_MIN, "bg", {
    one: (z) => `${z} минута`,
    other: (z) => `${z} минути`,
  });
  return (
    <Modal title="Помощ - Моите класове" onClose={onClose} size="lg">
      <div className="space-y-5">
        <RundgangMeineKlassenKnopf onStart={onClose} programmName={programmName} />
        <p className="m-0 text-sm leading-relaxed text-ink">
          Тук работите с класа си. Класовете и акаунтите ги създавате{" "}
          <strong>само веднъж</strong> - те важат във всяка програма за обучение, със
          същия код на класа и със същата парола.
          {tastenflow && (
            <>
              {" "}
              Когато като учител отворите Tastenflow, винаги попадате тук. Към
              собственото упражнение води „Упражнения“ (<Taste>Alt</Taste> +{" "}
              <Taste>U</Taste>).
            </>
          )}
        </p>

        <Abschnitt titel="Как е устроена страницата">
          <p className="m-0">
            <strong>В заглавието на класа</strong> стоят името му - ако класовете са
            няколко, в падащия списък „Клас“, с който сменяте класа, - броят на
            учениците и кодът на класа. Вдясно на този ред, преди „Изтегляния“, е
            превключвателят <strong>„Напредък | Ученици и достъп“</strong> - на едно и
            също място на двата екрана, към които води.
          </p>
          <p className="m-0">
            В <strong>„Ученици и достъп“</strong> създавате нов клас, добавяте ученици и
            ги премествате, виждате пароли и данни за вход, кода на класа и кои
            програми има класът. Много ученици наведнъж добавяте там, в частта за
            учениците, с <strong>„Добави ученици от файл на Excel“</strong>: първо
            „Изтегли шаблона (Excel)“, после по един ред за всеки ученик с име, парола
            и - за Tastenflow - откъде да започне. Празна парола програмата създава
            сама; предварителният преглед показва какво ще бъде прехвърлено, а всички
            добавени ученици стоят после под „Отпечатай данните за вход“. С{" "}
            <strong>„Изтегли списъка на класа“</strong> до него по всяко време
            изтегляте файл на Word с име, парола и код на класа на ВСИЧКИ ученици в
            този клас - за отпечатване.
            {!tastenflow && (
              <>
                {" "}
                Съобщение до всички ученици пишете там със „Съобщение до класа“.
              </>
            )}
          </p>
          <p className="m-0">
            В <strong>„Напредък“</strong> - там попадате, когато отворите страницата, -
            стоят програмите за обучение на този клас, „Изтегляния“, а под тях
            статистиката на класа: докъде е всеки ученик в курса.
            {tastenflow && (
              <>
                {" "}
                Най-горе в нея има ред с бутони: <strong>„Предизвикателство“</strong>,{" "}
                <strong>„Собствено упражнение“</strong>, <strong>„Седмична цел“</strong>,{" "}
                <strong>„Настройки на класа“</strong> и <strong>„Спри за 1 час“</strong>.
                Всеки бутон отваря под себе си собствена част - винаги само една, а
                клавишът <Taste>Esc</Taste> отново я затваря. „Предизвикателство“
                отваря формуляра с „Използвани клавиши“, „Мин“ и „Започни сега“, както и
                минали предизвикателства; „Собствено упражнение“ определя текст за целия
                клас (качване на файл, текст от „Моите текстове“ или шаблон от курса -
                учениците получават за него прозорец само с бутона „Напред“); „Седмична
                цел“ задава минути на седмица; „Спри за 1 час“ задава 60 минути, в които
                класът продължава да се упражнява, но нищо не се брои за седмичната цел.
                Отдолу е „Преглед на класа“ (месец или учебна година, с лента с
                резултати и линейна диаграма); вдясно в заглавието му е „Съобщение до
                класа“ - едно съобщение до всички ученици, всеки го получава в отделен
                разговор.
              </>
            )}
          </p>
          {tastenflow && (
            <p className="m-0">
              Бутонът <strong>„Настройки на класа“</strong> на този ред отваря: класа в
              училище (от него програмата избира видовете текстове и всяка учебна година
              брои по един клас нагоре; „Възрастни“ не се променя), езика заедно с
              катинара, началната точка на класа (тя важи и за ученици, които се добавят
              по-късно) и Състезанието в класа. Тези четири настройки важат за целия клас
              и програмата ги пита още при създаването на класа; за всеки ученик в
              разгънатия му ред остават „Откъде да започнете?“, „Писане с една ръка“ и
              „Спокойно“.
            </p>
          )}
          {tastenflow && (
            <p className="m-0">
              Стъпките в <strong>„Откъде да започнете?“</strong> са наречени по
              клавишите: „Съвсем отначало“ е само О и Т (клавишите с издатините),
              „Изходна позиция“ - целият основен ред. При{" "}
              <strong>„Първи букви и главни букви“</strong> се добавят следващите
              най-чести букви, както и клавишът Shift. „Всички букви“, „С препинателни
              знаци“, „С цифри“ и „Всички клавиши“ после един след друг отключват
              останалото.
            </p>
          )}
          <p className="m-0">
            Всеки бутон обяснява сам себе си: съветът се появява, щом фокусът стигне до
            него с клавиша Tab. Клавишът <Taste>Esc</Taste> го скрива.
          </p>
        </Abschnitt>

        {tastenflow && (
          <Abschnitt titel="Предизвикателството стъпка по стъпка">
            <ol className="m-0 list-decimal space-y-1 pl-5">
              <li>
                Най-горе в статистиката на класа, в лентата със задачи, бутонът
                „Предизвикателство“ отваря формуляра.
              </li>
              <li>
                Изберете <strong>използваните клавиши</strong> - всички ученици
                получават един и същ текст на това ниво.
              </li>
              <li>
                Въведете <strong>времето на предизвикателството</strong> в минути - полето
                е точно до използваните клавиши.
              </li>
              <li>
                Кажете на учениците: <em>Времето тече от първото ви натискане на
                клавиш.</em> От пускането те имат {einstiegsMinuten}, за да започнат;
                времето на предизвикателството тече за всеки ученик поотделно.
              </li>
              <li>
                <strong>„Започни сега“</strong> - Предизвикателството започва веднага за
                целия клас.
              </li>
              <li>
                Веднага след това там стои например{" "}
                <strong>„Готови: 12/14 - още не: Said, Jano“</strong>: при 12 ученици
                Предизвикателството вече е стигнало до устройството. То се появява там
                след около секунда. Ако някой ученик стои по-дълго под „още не“, обикновено
                помага страницата да се зареди веднъж наново.
              </li>
              <li>
                Докато тече, виждате „Предали: 3/18“ с имената.
              </li>
              <li>
                После под формуляра стоят резултатите: за всеки ученик място,{" "}
                <strong>резултат от предизвикателството</strong>, дали е имало четене на
                глас, знака в минута, точност, знаци, грешки и несигурни клавиши. Освен
                това идва обобщаващ имейл.
              </li>
            </ol>
          </Abschnitt>
        )}

        {tastenflow && (
          <>
            <Abschnitt titel="Какво означават колоните на таблицата">
              <SpaltenHilfe />
            </Abschnitt>

            <Abschnitt titel="Какво означава нивото на трудност">
              <LeistungsstufeHilfe />
            </Abschnitt>

            <Abschnitt titel="Стойностите, от които можете да изградите оценка">
              <DreiWerteHilfe />
            </Abschnitt>
          </>
        )}

        <Abschnitt titel="Кодът на класа">
          <p className="m-0">
            Той стои горе до името на класа и важи за всички програми. При вход се
            въвеждат код на класа, име и парола; устройството запомня кода, после
            стигат име и парола.
          </p>
          <p className="m-0">
            При създаването на клас той е <strong>задължителен</strong>. Докато пишете
            името, програмата предлага подходящ код - от „MS-Wein“ става „MSWEIN“.
            Можете да го промените, но не и да го оставите празен. По-късно се променя в
            „Ученици и достъп“ с „Редактирай“.
          </p>
          <p className="m-0">
            ⚠️ Ако промените кода, всички ученици в класа влизат от този момент с новия.
          </p>
        </Abschnitt>

        <Abschnitt titel="Преместване на ученик в друг клас">
          <p className="m-0">
            В „Ученици и достъп“ до всеки ученик стои{" "}
            <strong>„Премести в друг клас“</strong>. Той отваря полето „Код на новия
            клас“. Това става във всеки клас, чийто код знаете - и в класа на друг
            учител. Преди преместването програмата пита още веднъж.
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>След това детето влиза с новия код на класа.</li>
            <li>Учителите на новия клас виждат детето и неговия напредък.</li>
            <li>
              {tastenflow
                ? "Резултатите от предизвикателствата и съобщенията остават при досегашния клас."
                : "Съобщенията остават при досегашния клас."}
            </li>
          </ul>
        </Abschnitt>

        <Abschnitt titel="Работа с клавиатурата в тази част">
          <p className="m-0">
            <Taste>Alt</Taste> + <Taste>H</Taste> отваря и затваря тази помощ.{" "}
            <Taste>Alt</Taste> + <Taste>T</Taste> показва списъка на всички клавишни
            комбинации. <Taste>Alt</Taste> + <Taste>U</Taste> води към собственото
            упражнение. <Taste>Alt</Taste> + <Taste>N</Taste> отваря съобщенията,{" "}
            <Taste>Alt</Taste> + <Taste>K</Taste> - цветовете и контраста, а{" "}
            <Taste>Alt</Taste> + <Taste>J</Taste> - менюто на акаунта.
          </p>
          <p className="m-0">
            С клавиша Tab минавате през разделите; клавишът Enter сменя раздела. След
            смяната фокусът стои в новата част - екранният четец продължава да чете
            оттам.
          </p>
        </Abschnitt>

        <Abschnitt titel="Още по-подробно">
          <p className="m-0">
            Ръководството за учители (на английски) отваряте горе чрез „Изтегляния“ -
            там е и плакатът на Tastenflow за отпечатване и окачване (A3, на английски),
            който е свободен за всички, и без вход.
            {tastenflow && (
              <>
                {" "}
                Помощта в самата програма отваряте там с <Taste>Alt</Taste> +{" "}
                <Taste>H</Taste>.
              </>
            )}
          </p>
        </Abschnitt>
      </div>
    </Modal>
  );
}
