/**
 * ★★★ O-UK (25.10.2026): DAS HILFE-FENSTER FÜR DIE LERNENDEN, UKRAINISCH.
 * ===========================================================================
 * Aufbau wie `TippenHilfe.cs.tsx` (dieselben Abschnitte, `detail`-Stufen,
 * `isAdult`/`jugend`-Fälle), der INHALT nach der deutschen Grundfassung
 * `TippenHilfeDeutsch` (Stand 25.10.2026) - wo cs und de auseinanderlaufen,
 * gilt de: falsche Umschalttaste und Caps Lock sind ein Fehler (seit
 * `d37e9f6cb`), die Reihenfolge steht zusätzlich als Satz für den
 * Screenreader da, und der letzte Abschnitt nennt das gemeinsame Konto der
 * vier Programme. Wie alle Übersetzungen ohne den Einführungs-Podcast (die
 * ukrainische Bedienung hat keinen) und ohne den Absatz über die deutschen
 * Lektionen.
 *
 * ── ANREDE UND GESCHLECHT (Glossar `recherche-ukrainisch-2026-10-25/GLOSSAR-uk.md`) ──
 * Immer **ти** - Kinder, Jugendliche UND Selbstlernende (Regel 1, §6 Nr. 4).
 * Nie das Geschlecht verraten (Regel 2): keine Vergangenheit in der
 * 2. Person, kein „сам/сама", kein Adjektiv am Kind - Gegenwart, Zukunft,
 * Formen auf -но/-то, Sätze über die Sache. Die Lehrkraft heisst „педагог"
 * (Regel 2). Knopfnamen fett, ohne Anführung (Regel 7); Tastennamen wie auf
 * der Kappe (§2.9: Shift, Enter, Backspace, Caps Lock, Esc, AltGr), „пробіл"
 * gebeugt. Ausrufezeichen nur in Sätzen, die allein Kinder sehen (`kind`),
 * höchstens eines je Absatz - ausgenommen wörtlich zitierte Knopfnamen
 * („Я в грі!").
 *
 * ── WAS UKRAINISCH ANDERS IST ──────────────────────────────────────────────
 *  · Die Tastaturen des Weges (`layouts.ts`, `ua` und `ua-std`, nur gelesen):
 *    Grundreihe ф і в а п р о л д ж є, Noppen auf а und о; der Punkt unten
 *    rechts neben ю, das Komma ist Shift + dieselbe Taste; der Apostroph '
 *    links neben der 1 nur auf „Українська (розширена)"; ґ links neben я oder
 *    AltGr + г; Ziffern ohne Shift, mit Shift ! " № ; % : ? * ( ). Keine
 *    Totasten. Was am Mac gilt, ist ungemessen - darum steht es nicht da.
 *  · Die Reihenfolge des Weges „uk" entsteht parallel (F4) - die Hilfe zeigt
 *    die Buchstaben des Weges, auf dem das Kind wirklich übt
 *    (`layoutLetterOrder`), und nennt nur die Grobfolge.
 *  · Das Plakat gibt es auf Ukrainisch noch nicht - der Abschnitt bietet das
 *    englische an (`handbuchInSprache`, „англійською").
 *  · Keine Zahl mit Punkt am Satzende (§4 Falle 4), Schrägstrich statt „з"
 *    in kurzen Werten („25/60 хв"), Apostroph U+0027 (Regel 7).
 *
 * Fliesstext mit ukrainischer Anführung « », nur Bindestrich, keine Maus-Wörter.
 */
import { JawsRueckweg } from "./ScreenreaderHinweis";
import { useRef } from "react";
import { EINSTIEGSFENSTER_MIN, layoutLetterOrder, skinForStufe, unitGlyph } from "@/lib/typing";
import { mehrzahl } from "@/lib/bedienSprache";
import { useFocusTrap } from "./useFocusTrap";
import { Zeichenerklaerung } from "@/lib/arbeitsblatt/Zeichenerklaerung";
import { AltText, Kbd, Section, detailFor, type TippenHilfeProps } from "./TippenHilfeTeile";
import { AltOderWahl, WeitereTasten } from "./TippenHilfeTasten";
import { RundgangNochmalKnopf } from "./Rundgang";
import { hoehleHatWesen } from "@/lib/typing/expedition/texts";
import { downloadAdresse, handbuchInSprache, tastenflowPlakat } from "@/lib/lernwerkstatt/handbuecher";

// ★ O-UK (25.10.2026): das Wort der Tippchallenge (Glossar §2.3, gross auch
// gebeugt) - wie `VYZVA` in der tschechischen Hilfe. Steht hier, solange
// `schreibprobe.ts` kein ukrainisches Wort hat.
const VYKLYK = "Виклик";
const VYKLYKY = "Виклики";

/**
 * Dateigrösse ukrainisch: Dezimalkomma und „МБ"/„КБ" (Glossar Regel 5;
 * Einheit: Glossar-Ergänzung im Befund). `groesse()` in `handbuecher.ts`
 * zeigt für uk noch den englischen Rückfall - die gemeinsame Tabelle fasse
 * ich in dieser Etappe nicht an.
 */
function groesseUk(bytes: number): string {
  const mb = bytes / 1024 / 1024;
  if (mb >= 1) return `${mb.toFixed(1).replace(".", ",")} МБ`;
  return `${Math.round(bytes / 1024)} КБ`;
}

export function TippenHilfeUkrainisch({ open, onClose, stufe, lernweg = "uk" }: TippenHilfeProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  useFocusTrap(open, cardRef, { initialFocus: closeRef });
  if (!open) return null;

  const skin = skinForStufe(stufe);
  const isAdult = skin === "erwachsen";
  const kind = skin === "kind";
  const detail = detailFor(stufe);
  const letters = layoutLetterOrder(lernweg);
  // Für den Screenreader nur die Buchstaben selbst (Glyphen wie ⇧ trägt die sichtbare Reihe).
  const buchstabenSatz = letters.filter((ch) => /^\p{L}$/u.test(ch)).join(", ");
  // Das Höhlenwesen (deutsche Aufnahmen) gibt es nur auf Weg „de".
  const hoehleMitWesen = hoehleHatWesen(lernweg);
  // Dasselbe Wort wie der Ring (Glossar §2.2: „рівень гри" / „рівень"),
  // dazu der Lokativ für „на якому рівні ти зараз".
  const ringWort = kind ? "рівень гри" : "рівень";
  const ringWortLokal = kind ? "рівні гри" : "рівні";
  // Nominativ nach „є" („у тебе є 5 хвилин"), alle vier Formen (Glossar §2.11).
  const einstiegsMinuten = mehrzahl(EINSTIEGSFENSTER_MIN, "uk", {
    one: (z) => `${z} хвилина`,
    few: (z) => `${z} хвилини`,
    many: (z) => `${z} хвилин`,
    other: (z) => `${z} хвилини`,
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Довідка Tastenflow"
      onClick={onClose}
    >
      <div
        ref={cardRef}
        className="card my-8 w-full max-w-2xl space-y-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="m-0 text-xl font-semibold text-ink">Довідка - як працює Tastenflow</h2>
          <button
            ref={closeRef}
            type="button"
            className="btn-secondary btn-toggle"
            onClick={onClose}
            aria-label="Закрити довідку"
          >
            ✕ Закрити
          </button>
        </div>

        <RundgangNochmalKnopf onStart={onClose} />

        <Section title="Просто почни друкувати">
          <p className="m-0">
            Поле для друку не треба спершу вибирати. Просто почни друкувати - перша
            літера одразу з'явиться в полі. Якщо курсор деінде, натисни <Kbd>Alt</Kbd> +{" "}
            <Kbd>E</Kbd>, і ти одразу знову в полі для друку.
          </p>
          <JawsRueckweg weg="uk" />
          {detail === 1 && (
            <p className="m-0">
              Друкуй завжди правильним пальцем - клавіатура внизу показує, яка клавіша
              потрібна зараз. Двічі швидко натисни клавішу <Kbd>Shift</Kbd> - і почуєш,
              яким пальцем друкувати.
            </p>
          )}
        </Section>

        <Section title="Ці знаки є в тексті">
          <Zeichenerklaerung
            titel={null}
            zeichen={[
              { zeichen: "·", bedeutung: "розділяє дві частини, які належать одна до одної, - як кома в реченні." },
              { zeichen: "→", bedeutung: "потім, або: ось що з цього виходить." },
              { zeichen: "⏱", bedeutung: "твій час тренування." },
              {
                zeichen: "↵",
                bedeutung:
                  "стоїть у кінці рядка, якщо так налаштовано для твого класу, - тоді рядок завершуєш клавішею Enter.",
              },
            ]}
          />
        </Section>

        <Section title="Збирай зірки 🌟">
          <p className="m-0">
            Після кожного раунду ти отримуєш <strong>від 1 до 3 зірок</strong> - і до них
            власний звук.{" "}
            <strong>Точність важить набагато більше, ніж швидкість:</strong> хто друкує
            спокійно й уважно, отримує надійні зірки, а хто поспішає й часто
            помиляється - ні.
            {kind ? " Зірки може здобути кожна дитина!" : ""}
          </p>
          {detail >= 2 && (
            <p className="m-0">
              3 зірки - за справді добрий раунд: точно надрукований і в хорошому темпі,
              причому <strong>точність</strong> завжди важливіша за{" "}
              <strong>швидкість</strong>. Коли тобі якийсь час вдаються добрі раунди, ти
              піднімаєшся на <strong>рівень складності</strong> вище - тоді нагорода
              звучить ще трохи інакше.
            </p>
          )}
        </Section>

        <Section title="Збирай медалі 🏅">
          <p className="m-0">
            За особливі успіхи ти здобуваєш <strong>медалі</strong> - наприклад, за раунд
            зовсім без помилок або за три чисті раунди поспіль. Коли з'являється нова
            медаль, лунає власне <strong>«та-да»</strong> і звучить її назва.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              Усі медалі є в розділі <strong>Мій поступ</strong>, одразу після тижневої
              мети й твоїх показників - там завжди видно і <strong>наступну ціль</strong>{" "}
              (наприклад: ще 2 раунди без помилок до наступної медалі). Найбільше медалей
              дають за <strong>точний друк</strong> і за <strong>наполегливість</strong> -
              не за поспіх. А кілька медалей <strong>таємні</strong>: їхня умова ніде не
              написана, вони просто одного дня з'являються.
            </p>
          )}
          {detail >= 2 && (
            <p className="m-0">
              Там є і твої <strong>бали</strong>: вони поєднують точність і швидкість в
              одне число від 0 до 100 - одне хибне натискання важить, як 5 знаків, а вдвічі
              вища швидкість дає лише в 1,4 раза більше. Отже, точність перемагає швидкість.
            </p>
          )}
          {detail >= 2 && (
            <p className="m-0">
              Нижче розділ «Зміни з часом» (рядок, який можна розгорнути) показує невелику
              криву. Це нормально, що крива не тільки піднімається. Коли додаються нові
              клавіші, вона зазвичай спершу опускається - особливо з клавішею Shift і з
              цифрами.
            </p>
          )}
          <p className="m-0">
            Порада: вибери медаль у розділі Мій поступ і натисни <Kbd>Enter</Kbd> - вона
            з'явиться <strong>великою</strong>, з блиском і конфеті.
          </p>
        </Section>

        {skin === "jugend" && (
          <Section title="Після нової клавіші">
            <p className="m-0">
              <strong>Нова клавіша</strong> твоя, щойно попередні клавіші впевнені, - для
              цього не треба нічого вигравати. Її коротко святкують, а потім тренування
              триває. Більше нічого не відбувається.
            </p>
            <p className="m-0">
              Якщо хочеш, після цього може бути коротка гра: <strong>Крижини</strong>. Це
              вирішуєш ти - у <strong>Налаштуваннях</strong> (<AltText>Alt + O</AltText>), у
              розділі <strong>Гра-нагорода</strong>. Типово вибрано{" "}
              <strong>Без гри</strong>. Це налаштування діє для цього пристрою.
            </p>
          </Section>
        )}

        {!isAdult && (
          <Section title="Крижини 🐧">
            {skin === "jugend" ? (
              <>
                <p className="m-0">
                  Гру можна <strong>будь-коли запустити</strong> - кнопкою{" "}
                  <strong>🐧 Грати</strong> в рядку під полем для друку. Пінгвін стрибає по
                  крижинах, вилазить на гору літер і з'їжджає вниз на животі - завжди з
                  клавішами, які зараз даються тобі найважче. Дорогою вистрибують{" "}
                  <strong>бонусні рибки</strong> (вчасно натиснуто - рибку спіймано, і це
                  ніколи не помилка), а в <strong>Печері відлуння</strong> кожну клавішу
                  тільки називають. Гра <strong>не</strong> зараховується до часу тренування
                  і не є умовою для нових знаків - але має власні медалі.
                </p>
                <p className="m-0">
                  Після нової клавіші вона починається сама <strong>тільки тоді</strong>,
                  коли в Налаштуваннях її вибрано як <strong>Гру-нагороду</strong>. Інакше
                  тебе ніщо не перериває - коли грати, вирішуєш ти.
                </p>
              </>
            ) : (
              <>
                <p className="m-0">
                  Коли відкрито <strong>нову клавішу</strong>, на святкування чекає гра
                  Крижини: допоможи пінгвінові перебратися через воду - натискай щоразу
                  клавішу, яка стоїть на наступній крижині! Іноді шлях веде навіть на{" "}
                  <strong>гору літер</strong>, а потім на животі знову вниз. Нова клавіша
                  твоя вже до гри - гра є нагородою, а не обов'язком.
                </p>
                <p className="m-0">
                  Гру можна також <strong>будь-коли запустити</strong> - кнопкою{" "}
                  <strong>🐧 Грати</strong> вгорі на твоїй картці вправ, одразу біля кола.
                  Це велика <strong>пригода</strong>: щодня вона виглядає трохи інакше,
                  дорогою вистрибують <strong>бонусні рибки</strong> (швидко натисни їхню
                  клавішу - і вони твої), а в <strong>Печері відлуння</strong> ти не бачиш
                  жодних літер -{" "}
                  {hoehleMitWesen ? (
                    <>
                      печера <strong>називає</strong> тобі кожну клавішу.
                    </>
                  ) : (
                    <>
                      кожна клавіша звучить як тон, а читач екрана або брайлівський дисплей{" "}
                      <strong>каже</strong> тобі, яка це клавіша.
                    </>
                  )}{" "}
                  Гра лише для розваги й <strong>не</strong> зараховується до часу
                  тренування - але приносить власні медалі!
                </p>
                {detail >= 2 && (
                  <p className="m-0">
                    Не хвилюйся: якщо крижина тоне або ти посковзнешся на горі, пінгвін
                    просто пливе назад - можна одразу спробувати знову, скільки завгодно
                    разів. А хто пройде всю пригоду без жодного «бульк», побачить над іглу
                    танець <strong>полярного сяйва</strong>!
                  </p>
                )}
              </>
            )}
          </Section>
        )}

        <Section title="Що означає коло з числом?">
          <p className="m-0">
            Число в колі - це твій <strong>{ringWort}</strong>.{" "}
            <strong>{kind ? "XP - це бали за тренування:" : "Бали в колі - за тренування:"}</strong>{" "}
            за кожен раунд ти отримуєш кілька, і коло заповнюється. Коли воно повне (100
            балів), ти переходиш на наступний {ringWort}. Це тільки для збирання і{" "}
            <strong>не</strong> робить тренування важчим - як бали в грі.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              Не плутай це з <strong>рівнем складності (1-50)</strong>: він показує, як
              швидко тобі варто друкувати, і <strong>сам</strong> підлаштовується під
              тебе - росте, коли все йде добре, і стає легшим, коли важко.
            </p>
          )}
          {detail >= 3 && (
            <p className="m-0">
              А налаштування <strong>Тексти для віку</strong> визначає лише, наскільки
              складні слова й речення, - щоб вони пасували до віку. У класі його для всіх
              встановлює твій педагог; без класу ти знайдеш його вгорі в Налаштуваннях ⚙.
              Отже, три різні речі: <em>{ringWort}</em> - бали,{" "}
              <em>рівень складності</em> - очікувана швидкість, <em>Тексти для віку</em> -
              вік.
            </p>
          )}
        </Section>

        <Section title={detail === 1 ? "Як часто тренуватися?" : "Час тренування і тижнева мета"}>
          {detail === 1 ? (
            <p className="m-0">
              Краще тренуйся <strong>часто й потроху</strong>, ніж один раз дуже довго -
              наприклад, кілька днів по кілька хвилин. У рядку під полем для друку годинник
              рахує, скільки ти сьогодні вже друкуєш; саме цей час заповнює там і{" "}
              <strong>коло</strong> - твою тижневу мету.
            </p>
          ) : (
            <p className="m-0">
              З обліковим записом може бути <strong>тижнева мета</strong>: певна кількість{" "}
              <strong>хвилин на тиждень</strong>. У класі її встановлює твій педагог; без
              класу її можна встановити в Налаштуваннях ⚙, у розділі «Моя тижнева мета», -
              нова мета діє з наступного понеділка. Тиждень починається{" "}
              <strong>у понеділок о 8:00</strong> і триває до наступного понеділка. У рядку
              під полем для друку твій стан видно як <strong>коло</strong>, наприклад
              «25/60 хв»: коли тиждень виконано, коло повне і в ньому з'являється галочка.
              Іноді є ще пропущені хвилини з попереднього тижня, які можна{" "}
              <strong>надолужити</strong>; тоді поруч написано, скільки їх. Коли тижневу
              мету досягнуто, з'являється коротке вікно з привітанням - після цього можна
              будь-коли тренуватися далі, якщо хочеш.
            </p>
          )}
        </Section>

        <Section title="Налаштування: шестірня ⚙ угорі">
          <p className="m-0">
            Усі налаштування - за кнопкою <strong>⚙ Налаштування</strong> в самому верху,
            одразу ліворуч від круглого значка з першою літерою твого імені:{" "}
            <strong>Що ти тренуєш?</strong>, <strong>Тексти</strong> (вік і мова),{" "}
            <strong>Клавіатура</strong>, <strong>Звук</strong> і{" "}
            <strong>Читання вголос</strong>. Одне натискання їх відкриває, друге закриває -
            або <Kbd>Alt</Kbd> + <Kbd>O</Kbd>, це працює й посеред друку. Коли вони
            відкриваються, курсор одразу переходить у налаштування, коли закриваються -
            назад у поле для друку.
          </p>
          <p className="m-0">
            На самому верху Налаштувань є <strong>Що ти тренуєш?</strong>: три шляхи -{" "}
            <strong>Моє тренування</strong>, <strong>Історії</strong> та{" "}
            <strong>Ігри зі словами</strong>. <Kbd>Alt</Kbd> + <Kbd>B</Kbd> по черзі
            перемикає на наступний шлях, і програма називає новий шлях.
          </p>
          <p className="m-0">
            Кругла кнопка з глобусом угорі змінює мову Tastenflow - кнопки, меню й одразу
            також тексти для вправ. Мову самих текстів потім можна окремо змінити в
            розділі <strong>Тексти</strong>, якщо твій педагог не встановив її для класу.
          </p>
          <p className="m-0">
            У розділі <strong>Клавіатура</strong> ти вибираєш клавіатуру, яка справді лежить
            перед тобою. Зазвичай це <strong>Українська (розширена)</strong>; є також
            розкладка <strong>Українська</strong> - без апострофа. Тоді екранна клавіатура
            й підказки для пальців збігаються з твоєю клавіатурою, і з'являються тільки
            знаки, які на ній є. Найважливіше про українську клавіатуру:
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              Основний ряд - <strong>ф і в а п р о л д ж є</strong>. На клавішах{" "}
              <strong>а</strong> і <strong>о</strong> є виступи: так пальці знаходять
              основне положення, не дивлячись на клавіатуру.
            </li>
            <li>
              <strong>Крапка</strong> - унизу праворуч, поруч із ю. <strong>Кома</strong> -
              це <Kbd>Shift</Kbd> і та сама клавіша.
            </li>
            <li>
              <strong>Апостроф</strong> ' - ліворуч від 1, але тільки на розкладці
              Українська (розширена). На розкладці Українська апострофа немає, тому слова
              з апострофом там не з'являються.
            </li>
            <li>
              <strong>ґ</strong> - на клавіші ліворуч від я. Якщо такої клавіші немає, ґ
              друкується з <Kbd>AltGr</Kbd> + г.
            </li>
            <li>
              Цифри у верхньому ряду друкуються без клавіші Shift. З клавішею Shift там
              розділові знаки: ! " № ; % : ? * ( ).
            </li>
            <li>
              Мертвих клавіш немає: кожна літера має власну клавішу.
            </li>
            <li>
              Якщо замість українських літер з'являються латинські, перемкни мову введення:
              клавіша Windows і пробіл.
            </li>
          </ul>
          <p className="m-0">
            Там є і <strong>Друк однією рукою</strong> - для всіх, хто друкує однією рукою:
            тоді великі літери й символи приймаються з будь-якою клавішею Shift. У класі
            це налаштовує твій педагог.
          </p>
          <p className="m-0">
            Якщо ввімкнено <strong>Широкі інтервали (CVI)</strong>, під час друку
            затемнюється все, крім поля, у якому саме друкують (рядок вправи або ігрове
            поле); через 5 секунд без друку все знову стає світлим. Рядок вправи при цьому
            плавно рухається в ритмі твого друку, а не стрибає. Інтервали між знаками ти
            можеш будь-коли налаштувати в Налаштуваннях ⚙ - у класі їх може налаштувати і
            твій педагог; діє те, що вибрано останнім.
          </p>
          <p className="m-0">
            За допомогою <strong>Цілеспрямованої вправи</strong> можна вибрати до 8 клавіш чи знаків, які особливо часто трапляються в раундах - у налаштуваннях у групі <strong>Що ти тренуєш?</strong> або клавішами <Kbd>Alt</Kbd> + <Kbd>2</Kbd>. У класі це налаштовує твій учитель.
          </p>
        </Section>

        <Section title="Читання вголос - програма читає для тебе">
          <p className="m-0">
            Кнопкою <strong>🗣 Читання вголос</strong> (або <Kbd>Alt</Kbd> +{" "}
            <Kbd>V</Kbd>) програма читає вголос - для всіх, хто (ще) не користується
            читачем екрана. Угорі в Налаштуваннях ⚙ можна вибрати, що читати:{" "}
            <strong>клавіші</strong> (Клавіша за клавішею), <strong>слова</strong>,{" "}
            <strong>речення</strong> - одне, кілька або все, - і як швидко.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              У розділі <strong>Голос</strong> можна вибрати інший голос. Якщо мова текстів
              - <strong>українська</strong>, програма сама шукає український голос.
            </p>
          )}
          {detail >= 3 && (
            <p className="m-0">
              Не хвилюйся за швидкість: <strong>час читання вголос не враховується</strong>{" "}
              - очікування на повідомлення не робить твою швидкість меншою.
            </p>
          )}
        </Section>

        <Section title="Мелодія під час друку 🎵">
          <p className="m-0">
            <strong>Мелодія під час друку</strong> допомагає тренувати{" "}
            <strong>рівномірний ритм друку</strong> - і має приносити{" "}
            <strong>задоволення</strong>. Кожна правильна клавіша грає наступну ноту
            пісні; хто тримає ритм, отримує ще й цілий гурт.
          </p>
          <p className="m-0">
            Хто друкує рівномірно, друкує впевненіше і на слабших клавішах: ритм допомагає
            пройти місця, де інакше виникає вагання.
          </p>
          <p className="m-0">
            Увімкнути її можна клавішами <Kbd>Alt</Kbd> + <Kbd>6</Kbd>, у Налаштуваннях ⚙
            або в меню під круглою кнопкою з динаміком угорі - там повзунками можна
            налаштувати й гучність усіх звуків. Звук мелодії змінюється клавішами{" "}
            <Kbd>Alt</Kbd> + <Kbd>7</Kbd> і <Kbd>Alt</Kbd> + <Kbd>8</Kbd>.
          </p>
        </Section>

        <Section title="Великі літери й розділові знаки">
          <p className="m-0">
            В українській мові <strong>великі літери</strong> потрібні на початку речення і
            у власних назвах (Оксана, Київ, Дніпро). Tastenflow завжди пише їх{" "}
            <strong>правильно</strong>, тож ти ніколи не побачиш неправильно написаного
            слова.
          </p>
          <p className="m-0">
            <strong>На початку зовсім легко:</strong> просто надрукуй{" "}
            <strong>малу</strong> літеру - <strong>велика</strong> з'явиться сама. Клавішу{" "}
            <Kbd>Shift</Kbd> для цього ще <strong>не</strong> треба вміти.
          </p>
          <p className="m-0">
            <strong>Уже скоро</strong>, після перших літер, ти вчишся користуватися клавішею{" "}
            <Kbd>Shift</Kbd> «по-справжньому»: тримаєш її <strong>однією</strong> рукою, а
            літеру друкуєш <strong>другою</strong> - як на будь-якій клавіатурі. Так ти скоро
            друкуватимеш великі літери <strong>власними пальцями</strong>, а не лише з
            автоматичною допомогою.
          </p>
          <div className="rounded-lg border border-hairline bg-surface-raised p-3">
            <p className="m-0">
              <strong>Важливо - Shift завжди ДРУГОЮ рукою:</strong> клавіш Shift дві,
              ліворуч і праворуч. Літеру друкуєш однією рукою, клавішу <Kbd>Shift</Kbd>{" "}
              тримаєш <strong>другою</strong>. Так жодній руці не доводиться натискати дві
              клавіші одночасно.
            </p>
            <p className="m-0 mt-2">
              Приклад: велика <strong>А</strong> (ліва рука) → <strong>правий</strong>{" "}
              <Kbd>Shift</Kbd>. Велика <strong>О</strong> (права рука) →{" "}
              <strong>лівий</strong> <Kbd>Shift</Kbd>.
            </p>
            <p className="m-0 mt-2">
              Tastenflow приймає <strong>тільки правильний</strong> Shift. Якщо натиснути{" "}
              <strong>не той</strong> Shift або клавішу <Kbd>Caps Lock</Kbd>, з'явиться{" "}
              <strong>мала</strong> літера - це вважається <strong>помилкою</strong>: так
              правильна рука тренується від самого початку.
            </p>
          </div>
          {detail >= 2 && (
            <p className="m-0 text-sm text-ink-muted">
              Порада: натисни клавішу <Kbd>Shift</Kbd> <strong>двічі швидко</strong> - і
              почуєш, яким пальцем її тримати.
            </p>
          )}
          <p className="m-0">
            <strong>Крапка, кома й знак питання</strong> з'являються тільки тоді, коли ти їх
            вивчиш. До того ти просто читаєш речення <strong>без них</strong> - так задумано,
            це не помилка. На українській клавіатурі кома - це клавіша Shift і клавіша з
            крапкою.
          </p>
        </Section>

        <Section title="У якому порядку з'являються літери?">
          <p className="m-0">
            Нові клавіші завжди додаються в тому самому порядку: спершу{" "}
            <strong>основне положення</strong>, потім інші літери - найчастіші першими. Яка
            клавіша буде наступною, ти завжди бачиш праворуч у рядку під полем для друку:{" "}
            <strong>Наступна клавіша</strong>.
          </p>
          <div className="flex flex-wrap gap-1" aria-hidden="true">
            {letters.map((ch) => (
              <Kbd key={ch}>{unitGlyph(ch)}</Kbd>
            ))}
          </div>
          <p className="m-0 text-sm text-ink-muted">
            Уже <strong>після перших літер</strong> додаються <strong>великі літери</strong>{" "}
            (клавіша Shift), а одразу після них <strong>крапка й кома</strong> - речення
            починається з великої літери і закінчується крапкою. Потім інші літери.
            Наостанок - інші <strong>розділові знаки</strong> (- ? ! : ;),{" "}
            <strong>цифри</strong> і <strong>символи</strong>.
          </p>
          <span className="sr-only">
            Порядок: перші літери, потім великі літери (клавіша Shift), потім крапка й кома,
            потім інші літери, після них інші розділові знаки, цифри й символи. Порядок
            літер: {buchstabenSatz}.
          </span>
        </Section>

        {detail >= 2 && (
          <Section title="Як працює «Моє тренування»">
            <p className="m-0">
              <strong>Воно підлаштовується під тебе.</strong> Програма запам'ятовує, які
              клавіші ще непевні, і тренує саме їх. Нова клавіша додається тільки тоді, коли
              інші впевнені. <strong>Найчастіші</strong> літери йдуть першими - тож уже після
              кількох клавіш ти друкуєш <strong>справжні слова й речення</strong>, а перші{" "}
              <strong>історії</strong> відкриваються рано.
            </p>
          </Section>
        )}

        <Section title="Рядок стану під полем для друку">
          <p className="m-0">
            Під полем для друку є вузький рядок із чотирма даними: твій{" "}
            <strong>{ringWort}</strong>, сьогоднішній <strong>час</strong> тренування,{" "}
            <strong>тижнева мета</strong> і <strong>наступна клавіша</strong>. Біля
            тижневої мети коло показує, скільки <strong>хвилин</strong> тренування вже є
            цього тижня, - наприклад «25/60 хв»; <strong>галочка</strong> означає: тиждень
            виконано. Наступна клавіша відкривається <strong>сама</strong>, щойно попередні
            впевнені, - просто тренуйся далі.
          </p>
          <p className="m-0">
            Рядок видно <strong>завжди</strong> - і під час друку. Тож нічого не стрибає, і
            ти будь-коли бачиш, скільки вже тренуєшся.
          </p>
          <p className="m-0">
            <Kbd>Alt</Kbd> + <Kbd>D</Kbd> називає час тренування і тижневу мету. Які
            клавіші вже впевнені, які ще ні і яка буде наступною, видно в розділі{" "}
            <strong>Мій поступ</strong> під заголовком <strong>Стан клавіш</strong> (
            <Kbd>Alt</Kbd> + <Kbd>S</Kbd>, з обліковим записом).
          </p>
        </Section>

        <Section title="Бібліотека: «Історії і цікавинки» 📖">
          <p className="m-0">
            Крім шляху Моє тренування, є ще один: <strong>Історії</strong> - у
            Налаштуваннях ⚙, у розділі <strong>Що ти тренуєш?</strong>. Там чекають цілі
            історії та серії пізнавальних текстів - не окремі речення, а{" "}
            <strong>одна історія на багато раундів</strong>. Кожна частина - це дванадцять
            рядків; наступного разу ти читаєш далі саме з того місця, де читання
            зупинилося.
          </p>
          <p className="m-0">
            З'являється тільки те, що справді можна надрукувати вже вивченими клавішами, -
            тому на початку ще видно замки. Вони відкриваються самі, щойно достатньо клавіш
            стануть впевненими. Кожен рядок з'являється <strong>лише один раз</strong>: що
            вже надруковано, не повертається як повторення.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              <strong>Червона нитка:</strong> те, що ти прочитаєш у серії пізнавальних
              текстів, пізніше повернеться в тренуванні - як{" "}
              <strong>питання іншими словами</strong>, потім як невелике поглиблення і
              наостанок як жарт на цю тему. Так вивчене залишається в пам'яті, і це зовсім не
              схоже на опитування.
            </p>
          )}
          {detail >= 3 && (
            <p className="m-0 text-sm text-ink-muted">
              Під списком є розділ «Джерела й подяка»: там видно, звідки тексти. Деякі
              написано спеціально для цієї програми, інші взято з вільних джерел - їх там
              названо, як і належить.
            </p>
          )}
        </Section>

        <Section title="Звідки тексти? 🤖">
          <p className="m-0">
            Власні тексти цієї програми - речення для вправ, жарти й історії - Johannes
            написав <strong>за допомогою штучного інтелекту (ШІ)</strong>, а потім сам
            прочитав і перевірив. Тексти з інших джерел (наприклад, з Вікіпедії) названо з
            джерелом у розділі «Джерела й подяка».
          </p>
          <p className="m-0">
            {hoehleMitWesen ? (
              <>
                Співоча риба і бурмотлива печерна істота в Полярній експедиції - це теж{" "}
                <strong>комп'ютерні голоси</strong>, а не справжні люди.
              </>
            ) : (
              <>
                Співоча риба в Полярній експедиції - це теж <strong>комп'ютерний голос</strong>,
                а не справжня людина.
              </>
            )}{" "}
            Читання вголос (🗣) використовує голос твого пристрою.
          </p>
        </Section>

        <Section title={VYKLYK}>
          <p className="m-0">
            Іноді твій педагог запускає <strong>Виклик</strong> - для всього класу.{" "}
            <strong>Усі отримують той самий текст</strong>, і в усіх однаково часу.
          </p>
          <p className="m-0">
            <strong>Час іде тільки від твого першого натискання клавіші</strong> - а не з
            тієї миті, коли педагог запускає Виклик. Після запуску в тебе є{" "}
            <strong>{einstiegsMinuten}</strong>, щоб почати.
          </p>
          <p className="m-0">
            <strong>Як його впізнати:</strong> над полем для друку стоїть слово{" "}
            <strong>{VYKLYK}</strong>, поруч - час, а навколо всієї ділянки - інша,{" "}
            <strong>пунктирна рамка</strong>. Щойно час вийшов, і слово, і рамка зникають.
          </p>
          <p className="m-0">
            <strong>Скільки часу лишилося, не дивлячись:</strong> <Kbd>Alt</Kbd> +{" "}
            <Kbd>X</Kbd> скаже тобі. Сам годинник озивається лише кілька разів, а решту часу
            мовчить.
          </p>
          <p className="m-0">
            <strong>Брайлівський дисплей залишається спокійним.</strong> Час{" "}
            <strong>не</strong> цокає в рядку: він іде вгорі, але ніколи не втручається в те,
            що ти саме читаєш.
          </p>
          <p className="m-0">
            <strong>Іноді Виклик - це Вільне письмо.</strong> Тоді помилка під час друку
            просто залишається - нічого не позначається, жоден звук про неї не повідомляє.
            Клавіша <Kbd>Backspace</Kbd> виправляє тільки в поточному рядку; готовий рядок
            залишається таким, як є. У кінці рядка після останнього слова натисни пробіл -
            або, якщо в класі ввімкнено «Кінець рядка - клавішею Enter», клавішу{" "}
            <Kbd>Enter</Kbd>. Що в кінці ще неправильно, покаже тільки підсумок після цього -
            як список, який можна перечитати.
          </p>
          <p className="m-0">
            <strong>Закінчити раніше:</strong> <Kbd>Esc</Kbd> запитує, чи справді. Кнопка{" "}
            <strong>Друкувати далі</strong> (також <Kbd>Esc</Kbd>) повертає в рядок, кнопка{" "}
            <strong>Здати</strong> здає Виклик - оцінюється те, що надруковано до цієї миті.
            Те саме робить кнопка <strong>Готово - здати</strong> під полем, без запитання.
          </p>
          <p className="m-0">
            <strong>Коли час вийшов,</strong> одразу з'являється твій підсумок: швидкість у
            знаках за хвилину, точність, знаки, помилки, рядки і клавіші, які були непевні.
            Кожен Виклик потім залишається в розділі <strong>Мій поступ</strong> під
            заголовком <strong>{VYKLYKY}</strong> - там його можна будь-коли перечитати.
          </p>
        </Section>

        <Section title="Перегони класу ⚔️">
          <p className="m-0">
            У Перегонах класу ти <strong>п'ять хвилин друкуєш наввипередки</strong> з іншими
            дітьми свого класу. Перегони є тільки в класі і тільки тоді, коли твій педагог їх
            дозволив.
          </p>
          <p className="m-0">
            <strong>Оголосити перегони:</strong> <Kbd>Alt</Kbd> + <Kbd>M</Kbd> або кнопка{" "}
            <strong>⚔️ Перегони класу</strong> в рядку над полем для друку - одразу біля
            кнопки <strong>🐧 Грати</strong>. У всіх інших тоді відкривається вікно з
            кнопками <strong>Я в грі!</strong> і <strong>Не зараз</strong>.{" "}
            <Kbd>Esc</Kbd> повертає до тренування, і те саме запрошення само вже не
            з'явиться.
          </p>
          <p className="m-0">
            <strong>Якщо хтось уже запрошує,</strong> <Kbd>Alt</Kbd> + <Kbd>M</Kbd> знову
            відкриває це запрошення - другі перегони можна почати тільки тоді, коли перші вже
            тривають. Якщо двоє запрошують майже одночасно, діє запрошення, яке прийшло
            першим.
          </p>
          <p className="m-0">
            <strong>Коли зараз не можна:</strong> якщо ти вже береш участь у перегонах,
            кнопка називається <strong>⚔️ Перегони класу тривають</strong> - і{" "}
            <Kbd>Alt</Kbd> + <Kbd>M</Kbd> каже тобі те саме. Інші перегони в класі не
            заважають: одночасно їх може тривати скільки завгодно.
          </p>
          <p className="m-0">
            <strong>Усі друкують на своєму рівні.</strong> Хто вже знає цифри, отримує цифри;
            хто тренує основний ряд, отримує основний ряд. Хибні натискання коштують: одне
            хибне натискання важить, як п'ять знаків.
          </p>
          <p className="m-0">
            <strong>Як справи, не дивлячись:</strong> зліва в рядку для друку завжди вісім
            клітинок - <strong>P2</strong> означає місце, поруч час, що лишився.{" "}
            <Kbd>Alt</Kbd> + <Kbd>X</Kbd> каже тобі місце, час і перших трьох. Само нічого
            не озивається - брайлівський дисплей залишається спокійним.
          </p>
          <p className="m-0">
            <strong>Закінчити раніше:</strong> <Kbd>Esc</Kbd> або кнопка{" "}
            <strong>Вийти</strong> запитує, чи справді. Кнопка{" "}
            <strong>Друкувати далі</strong> (також <Kbd>Esc</Kbd>) повертає в рядок. Кнопка{" "}
            <strong>Вийти</strong> завершує перегони тільки для тебе - інші друкують далі й
            бачать твій текст до цієї миті.
          </p>
          <p className="m-0">
            <strong>Перегони зараховуються до твого часу тренування</strong> і можуть
            відкрити нову клавішу - так само, як звичайний раунд.{" "}
            <strong>Місце не зберігається.</strong> Наприкінці з'являється список: Кубок,
            Срібло й Бронза для перших трьох, усі інші - зі своїм числом. Потім кнопка{" "}
            <strong>Тренуватися далі</strong> або <Kbd>Esc</Kbd> повертає назад.
          </p>
        </Section>

        <Section title="Важливі клавіші">
          <p className="m-0 text-sm text-ink-muted">
            <AltOderWahl>
              На Mac замість клавіші <Kbd>Alt</Kbd> - клавіша <Kbd>⌥</Kbd> (Option).
            </AltOderWahl>
          </p>
          <ul className="m-0 list-none space-y-2 p-0">
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Esc</Kbd>
              </span>
              <span>
                <strong>Найважливіша клавіша:</strong> вона закриває кожне вікно, і курсор
                після цього <strong>завжди в полі для друку</strong>. Навіть якщо нічого не
                відкрито, <Kbd>Esc</Kbd> повертає його туди. Єдиний виняток - Дослідити
                клавіші: там <Kbd>Esc</Kbd> сама є клавішею для дослідження, і вийти можна
                лише другим натисканням.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Shift</Kbd> <Kbd>Shift</Kbd>
              </span>
              <span>Двічі швидко: програма називає правильний палець.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>E</Kbd>
              </span>
              <span>Перейти в поле для друку.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>U</Kbd>
              </span>
              <span>Перейти до тренування.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>S</Kbd>
              </span>
              <span>
                Відкриває Мій поступ (педагоги: Мої класи). Для цього треба увійти. Друге
                натискання повертає в поле для друку.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>Z</Kbd>
              </span>
              <span>Називає, який рядок зараз.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>D</Kbd>
              </span>
              <span>
                Називає час тренування - на брайлівському дисплеї і (з читанням вголос) як
                повідомлення.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>L</Kbd>
              </span>
              <span>Називає, на якому {ringWortLokal} ти зараз.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>3</Kbd>
              </span>
              <span>
                <strong>Дослідити клавіші:</strong> кожну клавішу, яку ти натискаєш,
                програма називає і показує великою - спершу скорочення, потім назву, потім що
                вона робить (наприклад, «Tab - клавіша Tab - переходить до наступного
                елемента»). Це діє також для всіх спеціальних клавіш і розділових знаків, для
                знаків через AltGr (на Mac: Option) разом зі шляхом до них і для сполучень
                клавіш, як-от Ctrl + C, - разом із тим, що вони роблять. Сполучення клавіш
                самого Tastenflow (<AltText>Alt + H, Alt + V</AltText> тощо) працюють далі.
                Екранна клавіатура показує, яку клавішу натиснуто. Якщо читання вголос
                вимкнено, голос мовчить. На брайлівському дисплеї пояснення залишається, доки
                не прийде наступна клавіша, і його можна повністю прочитати клавішами
                прокручування; на екрані воно у вікні. Нічого не друкується, нічого не
                губиться. <strong>Вийти:</strong> ще раз <Kbd>Alt</Kbd> + <Kbd>3</Kbd>, двічі{" "}
                <Kbd>Esc</Kbd> - або просто перезавантаж сторінку.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>4</Kbd>
              </span>
              <span>
                <strong>Знайти клавіші:</strong> програма називає клавішу, а ти її шукаєш.
                Коли ти знаходиш її вперше, програма хвалить і просить натиснути іншу
                клавішу, а потім ще раз цю - зараховується тільки друге натискання, і лише
                після іншої клавіші між ними. Потім іде наступна клавіша. Іншу клавішу
                програма тільки називає. У вікні <Kbd>Alt</Kbd> + <Kbd>4</Kbd> перемикає між
                дослідженням і пошуком. <strong>Вийти:</strong> так само, як під час
                дослідження.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>K</Kbd>
              </span>
              <span>
                <strong>Кольори й контраст:</strong> сім колірних тем - світла, темна, чорне
                на жовтому, жовте на синьому та інші. Кожна вже в списку показується у
                власних кольорах, тож ти заздалегідь бачиш, який вона має вигляд.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>T</Kbd>
              </span>
              <span>Відкрити або закрити список сполучень клавіш.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>N</Kbd>
              </span>
              <span>Відкрити або закрити повідомлення від педагогів.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>+</Kbd> / <Kbd>-</Kbd>
              </span>
              <span>Зробити поле для друку більшим або меншим.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>V</Kbd>
              </span>
              <span>Увімкнути або вимкнути читання вголос.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>H</Kbd>
              </span>
              <span>Відкрити або закрити цю довідку.</span>
            </li>
            <WeitereTasten />
          </ul>
        </Section>

        {detail >= 3 && (
          <Section title="Як програма тебе підтримує">
            <p className="m-0">
              Програма вимірює кожну літеру окремо - наскільки точно і як швидко ти її
              друкуєш. Вона сама тренує найслабші й відкриває нову літеру тільки тоді, коли
              попередні впевнені. Так виникає твій власний шлях навчання.
            </p>
            <p className="m-0">
              Рівень складності (1-50) дбає про те, щоб завжди було{" "}
              <strong>складно, але посильно</strong>: коли все вдається, він росте; коли
              надто важко, знову знижується. У розділі <strong>Мій поступ</strong> ти бачиш
              усе про свій поступ - і те, як ти вдосконалюєшся.
            </p>
          </Section>
        )}

        <Section title="Тренуватися без класу - власний обліковий запис 🙋">
          <p className="m-0">
            Якщо ти не належиш до жодного класу, можна створити власний обліковий запис:
            натисни круглу кнопку <strong>Обліковий запис</strong> і постав позначку{" "}
            <strong>Тренуюся самостійно, без класу</strong>. Для цього потрібна адреса
            електронної пошти: туди щопонеділка приходить тижневий звіт - але тільки за ті
            тижні, коли справді було тренування. Якщо цілий рік ніхто не відкриває жодної з
            чотирьох програм, приходить попередження електронною поштою; якщо після цього
            три тижні ніхто не входить, обліковий запис видаляється разом з усім поступом.
          </p>
        </Section>

        <PlakatAbschnitt />
      </div>
    </div>
  );
}

/** Плакат для стіни - українською (`handbuchInSprache`). */
function PlakatAbschnitt() {
  const plakat = handbuchInSprache(tastenflowPlakat(), "uk");
  return (
    <Section title="Плакат, щоб повісити">
      <p className="m-0">
        Хочеш показати Tastenflow у своїй школі чи закладі? Ось{" "}
        <strong>плакат, який можна надрукувати й повісити</strong>: формат A3, вертикальний,
        з першого погляду видно, що вміє Tastenflow, а ще є QR-код на tastenflow.org.
      </p>
      <p className="m-0">
        <a
          href={downloadAdresse(plakat)}
          download={plakat.speicherName}
          type="application/pdf"
          className="text-accent underline underline-offset-2"
        >
          Завантажити плакат (PDF українською, A3, {groesseUk(plakat.bytes)})
        </a>
      </p>
    </Section>
  );
}
