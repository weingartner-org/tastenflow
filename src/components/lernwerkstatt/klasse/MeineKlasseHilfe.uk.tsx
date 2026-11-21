/**
 * ★★★ O-UK (25.10.2026): DIE HILFE ZU „MEINE KLASSEN" AUF UKRAINISCH.
 * ===========================================================================
 * Massgeblich ist die deutsche Fassung (`MeineKlasseHilfe.tsx`): dieselben
 * Abschnitte, dieselben Tatsachen; der Aufbau folgt `MeineKlasseHilfe.cs.tsx`.
 * Sichtbar nur mit `spracheGewaehlt === "uk"`; jedes Programm ohne
 * Sprach-Anbieter zeigt weiter die deutsche Fassung.
 *
 * Anrede (Glossar `recherche-ukrainisch-2026-10-25/GLOSSAR-uk.md`, Regel 1
 * und 2): die Lehrkraft mit ви, klein („Виберіть", „Введіть", „Натисніть").
 * Kinder heissen in dieser Sicht „діти"/„учні" (Mehrzahl) bzw. „дитина";
 * was die Lehrkraft der Klasse sagt, steht in der ви-Mehrzahl („Час піде від
 * вашого першого натискання клавіші."). Knopfnamen ohne Anführung (Regel 7),
 * Namen nur nach Doppelpunkt (Regel 12), Zähler mit Schrägstrich
 * („Готові: 12/14"). Die Startpunkte heissen wie im Glossar §2.13; die
 * Buchstaben der Stufen jenseits der Grundreihe nennt die Hilfe nicht - die
 * Reihenfolge des Weges „uk" entsteht parallel (F4).
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

// ★ O-UK (25.10.2026): „Виклик" (Glossar §2.3) steht ausgeschrieben im Text -
// Ukrainisch beugt das Wort (Виклик, Виклику, Виклики, Викликів).
export function MeineKlasseHilfeUkrainisch({
  onClose,
  programmName,
}: {
  onClose: () => void;
  /** Das offene Programm - davon hängt ab, welche Abschnitte dastehen. */
  programmName?: string;
}) {
  const tastenflow = programmName === "Tastenflow";
  // Nominativ nach „є" („у них є 5 хвилин"), alle vier Formen (Glossar §2.11).
  const einstiegsMinuten = mehrzahl(EINSTIEGSFENSTER_MIN, "uk", {
    one: (z) => `${z} хвилина`,
    few: (z) => `${z} хвилини`,
    many: (z) => `${z} хвилин`,
    other: (z) => `${z} хвилини`,
  });
  return (
    <Modal title="Довідка: Мої класи" onClose={onClose} size="lg">
      <div className="space-y-5">
        <RundgangMeineKlassenKnopf onStart={onClose} programmName={programmName} />
        <p className="m-0 text-sm leading-relaxed text-ink">
          Тут ви працюєте зі своїм класом. Класи й облікові записи ви створюєте{" "}
          <strong>лише один раз</strong> - вони діють у кожній навчальній програмі, з тим
          самим кодом класу і тим самим паролем.
          {tastenflow && (
            <>
              {" "}
              Коли ви як педагог відкриваєте Tastenflow, ви завжди потрапляєте сюди. До
              власного тренування веде кнопка Тренуватися (<Taste>Alt</Taste> +{" "}
              <Taste>U</Taste>).
            </>
          )}
        </p>

        <Abschnitt titel="Як побудована сторінка">
          <p className="m-0">
            <strong>У заголовку класу</strong> стоять його назва - якщо класів кілька, у
            списку Клас, яким ви перемикаєте клас, - кількість дітей і код класу. Праворуч
            у цьому рядку, перед кнопкою Завантаження, є перемикач{" "}
            <strong>Поступ | Учні й доступи</strong> - на тому самому місці на обох
            екранах, до яких він веде.
          </p>
          <p className="m-0">
            У розділі <strong>Учні й доступи</strong> ви створюєте новий клас, додаєте
            дітей і переводите їх до іншого класу, бачите паролі й дані для входу, код
            класу і програми, які має клас. Багатьох учнів одразу ви додаєте там само, у
            розділі учнів, кнопкою <strong>Імпортувати учнів з Excel</strong>: спершу
            Завантажити шаблон (Excel), потім для кожної дитини один рядок з ім'ям, паролем
            і - для Tastenflow - точкою старту. Порожній пароль програма створює сама;
            попередній перегляд показує, що буде перенесено, а всі імпортовані діти потім є
            під кнопкою Друкувати дані для входу. Кнопкою{" "}
            <strong>Завантажити список класу</strong> поруч ви будь-коли завантажуєте файл
            Word з ім'ям, паролем і кодом класу ВСІХ учнів цього класу - для друку.
            {!tastenflow && (
              <>
                {" "}
                Повідомлення всім дітям ви пишете там кнопкою Повідомлення класу.
              </>
            )}
          </p>
          <p className="m-0">
            У розділі <strong>Поступ</strong> - сюди ви потрапляєте, коли відкриваєте
            сторінку, - є навчальні програми цього класу, Завантаження, а під ними
            статистика класу: наскільки далеко кожна дитина.
            {tastenflow && (
              <>
                {" "}
                На самому верху в ній є рядок кнопок: <strong>Виклик</strong>,{" "}
                <strong>Власна вправа</strong>, <strong>Тижнева мета</strong>,{" "}
                <strong>Налаштування класу</strong> і <strong>Пауза на 1 годину</strong>.
                Кожна кнопка відкриває під собою власний розділ - завжди лише один, а
                клавіша <Taste>Esc</Taste> знову його закриває. Кнопка Виклик відкриває
                форму з полями Клавіші тексту і Хв та кнопкою Почати зараз, а також
                попередні Виклики; Власна вправа визначає текст для всього класу (доданий
                файл, текст із розділу Мої тексти або шаблон із курсу - діти отримують для
                цього вікно лише з кнопкою Далі); Тижнева мета встановлює хвилини на
                тиждень; Пауза на 1 годину вмикає 60 хвилин, протягом яких клас тренується
                далі, але до тижневої мети нічого не зараховується. Нижче - Огляд класу
                (місяць або навчальний рік, зі шкалою балів і лінійним графіком); праворуч у
                його заголовку є кнопка Повідомлення класу - одне повідомлення всім дітям,
                кожна дитина отримує його в окремій розмові.
              </>
            )}
          </p>
          {tastenflow && (
            <p className="m-0">
              Кнопка <strong>Налаштування класу</strong> в цьому рядку відкриває: рік
              навчання (з нього програма вибирає види текстів і щороку рахує на клас далі;
              варіант Дорослі не змінюється), мову разом із замком, точку старту класу (вона
              діє й для дітей, які приєднаються пізніше) і Перегони класу. Ці чотири
              налаштування діють для всього класу, і програма запитує їх уже під час
              створення класу; для кожної дитини в її розгорнутому рядку залишаються
              «З чого почати?», «Друк однією рукою» і «Швидкість не важлива».
            </p>
          )}
          {tastenflow && (
            <p className="m-0">
              Ступені в меню <strong>«З чого почати?»</strong> названо за клавішами:
              «Перші кроки» - це лише А і О, «Основне положення» - увесь основний ряд (ф і в
              а о л д ж). На ступені <strong>«Перші літери і великі літери»</strong>{" "}
              додаються наступні найчастіші літери, а також клавіша Shift. «Усі літери»,
              «+ розділові знаки», «+ цифри» і «Усе» потім по черзі відкривають решту.
            </p>
          )}
          <p className="m-0">
            Кожна кнопка пояснює себе сама: підказка з'являється, щойно на неї клавішею Tab
            переходить фокус. Клавіша <Taste>Esc</Taste> прибирає підказку.
          </p>
        </Abschnitt>

        {tastenflow && (
          <Abschnitt titel="Виклик крок за кроком">
            <ol className="m-0 list-decimal space-y-1 pl-5">
              <li>
                На самому верху статистики класу, у рядку завдань, кнопка Виклик відкриває
                форму.
              </li>
              <li>
                Виберіть <strong>клавіші тексту</strong> - усі діти отримують той самий
                текст на цьому рівні.
              </li>
              <li>
                Введіть <strong>тривалість Виклику</strong> у хвилинах - поле стоїть одразу
                поруч.
              </li>
              <li>
                Скажіть класові: <em>Час піде від вашого першого натискання клавіші.</em>{" "}
                Після запуску в дітей є {einstiegsMinuten}, щоб почати; тривалість Виклику
                рахується для кожної дитини окремо.
              </li>
              <li>
                Натисніть <strong>Почати зараз</strong> - Виклик починається одразу для
                всього класу.
              </li>
              <li>
                Одразу після цього там стоїть, наприклад,{" "}
                <strong>Готові: 12/14 - ще ні: Said, Jano</strong>: у 12 дітей Виклик уже
                надійшов на пристрій. Він з'являється там приблизно через секунду. Якщо
                дитина довше стоїть під «ще ні», зазвичай допомагає один раз оновити
                сторінку.
              </li>
              <li>
                Поки Виклик триває, ви бачите рядок Здали: 3/18 з іменами.
              </li>
              <li>
                Потім під формою з'являються результати: для кожної дитини місце,{" "}
                <strong>бали Виклику</strong>, чи було ввімкнено читання вголос, знаків за
                хвилину, точність, знаки, помилки й непевні клавіші. Крім того, надходить
                підсумковий лист електронною поштою.
              </li>
            </ol>
          </Abschnitt>
        )}

        {tastenflow && (
          <>
            <Abschnitt titel="Що означають стовпці таблиці">
              <SpaltenHilfe />
            </Abschnitt>

            <Abschnitt titel="Що означає рівень складності">
              <LeistungsstufeHilfe />
            </Abschnitt>

            <Abschnitt titel="Значення, на яких можна будувати оцінку">
              <DreiWerteHilfe />
            </Abschnitt>
          </>
        )}

        <Abschnitt titel="Код класу">
          <p className="m-0">
            Він стоїть угорі поруч із назвою класу і діє для всіх програм. Під час входу
            вводять код класу, ім'я й пароль; пристрій запам'ятовує код, тож потім досить
            імені й пароля.
          </p>
          <p className="m-0">
            Під час створення класу він <strong>обов'язковий</strong>. Поки ви вводите
            назву, програма пропонує відповідний код - з «MS-Wein» виходить «MSWEIN». Його
            можна змінити, але не можна залишити порожнім. Пізніше його можна змінити в
            розділі Учні й доступи кнопкою Редагувати.
          </p>
          <p className="m-0">
            ⚠️ Якщо ви зміните код, усі діти класу відтоді входитимуть із новим кодом.
          </p>
        </Abschnitt>

        <Abschnitt titel="Перевести дитину до іншого класу">
          <p className="m-0">
            У розділі Учні й доступи біля кожної дитини є кнопка{" "}
            <strong>Перевести до іншого класу</strong>. Вона відкриває поле Код нового
            класу. Це працює з будь-яким класом, код якого ви знаєте, - навіть із класом
            іншого педагога. Перед переведенням програма ще раз запитує.
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>Потім дитина входить із новим кодом класу.</li>
            <li>Педагоги нового класу бачать дитину та її поступ.</li>
            <li>
              {tastenflow
                ? "Результати Викликів і повідомлення залишаються в попередньому класі."
                : "Повідомлення залишаються в попередньому класі."}
            </li>
          </ul>
        </Abschnitt>

        <Abschnitt titel="Керування з клавіатури в цьому розділі">
          <p className="m-0">
            <Taste>Alt</Taste> + <Taste>H</Taste> відкриває й закриває цю довідку.{" "}
            <Taste>Alt</Taste> + <Taste>T</Taste> показує список усіх сполучень клавіш.{" "}
            <Taste>Alt</Taste> + <Taste>U</Taste> веде до власного тренування.{" "}
            <Taste>Alt</Taste> + <Taste>N</Taste> відкриває повідомлення,{" "}
            <Taste>Alt</Taste> + <Taste>K</Taste> - вибір кольорів і контрасту, а{" "}
            <Taste>Alt</Taste> + <Taste>J</Taste> - меню облікового запису.
          </p>
          <p className="m-0">
            Клавішею Tab ви переходите між вкладками; клавіша Enter перемикає вкладку. Після
            перемикання фокус стоїть у новому розділі - читач екрана читає далі звідти.
          </p>
        </Abschnitt>

        <Abschnitt titel="Докладніше">
          <p className="m-0">
            Посібник для педагогів (англійською) ви відкриваєте вгорі кнопкою Завантаження -
            там є також плакат Tastenflow, щоб надрукувати й повісити (A3, англійською),
            який вільно доступний усім, навіть без входу.
            {tastenflow && (
              <>
                {" "}
                Довідку в самій програмі ви відкриваєте там клавішами <Taste>Alt</Taste> +{" "}
                <Taste>H</Taste>.
              </>
            )}
          </p>
        </Abschnitt>
      </div>
    </Modal>
  );
}
