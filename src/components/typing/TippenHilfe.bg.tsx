/**
 * ★★★ O-BG (25.10.2026): DAS HILFE-FENSTER FÜR DIE LERNENDEN, BULGARISCH.
 * ===========================================================================
 * Aufbau wie `TippenHilfe.cs.tsx` (dieselben Abschnitte, `detail`-Stufen,
 * `isAdult`/`jugend`-Fälle), der INHALT nach der deutschen Grundfassung
 * `TippenHilfeDeutsch` - wo cs und de auseinanderliefen, gilt de:
 *  · falsche Umschalttaste oder Caps Lock = kleiner Buchstabe = Fehler (de,
 *    `TypingSession.tsx` `wrongShift`; cs/pl/tr sagen noch „zählt trotzdem").
 *  · „Ein Konto für alle vier Programme" (de; in cs gestrichen).
 *  · die Buchstabenfolge auch für den Screenreader (`sr-only`, de).
 * Ohne den Einführungs-Podcast (die bulgarische Bedienung hat keinen) und ohne
 * den Absatz über die 30 deutschen Lektionen (gilt nur für Weg „de").
 *
 * ── ANREDE UND GESCHLECHT (Glossar `recherche-bulgarisch-2026-10-25/GLOSSAR-bg.md`) ──
 * Immer **ти** (Regel 1). Nie das Geschlecht verraten (Regel 2): kein
 * l-Partizip im Perfekt („си написал"), kein Adjektiv über das Kind („готов",
 * „сигурен", „сам") - Präsens, Aorist, Hauptwort-Sätze, Adjektiv am Ding.
 * Personenzahlwörter („двама", „първите трима") nie - „две покани",
 * „първите три места". Tastennamen lateinisch wie auf der Kappe, nur
 * „интервал" bulgarisch (Regel 11). Knopf- und Bereichsnamen in „…“ (Regel 7,
 * Hilfe = Fliesstext). Ausrufezeichen nur in Sätzen, die allein Kinder sehen.
 *
 * ── WAS BULGARISCH ANDERS IST ──────────────────────────────────────────────
 *  · Die Tastatur (`layouts.ts`, `bg`, `bg-schreibm`, `bg-phon`, `bg-phon-trad`,
 *    G3b, nur gelesen): Bezug ist BDS. Grundreihe ь я а о ж г т н в м ч,
 *    Heimtasten ь я а о | т н в м (F = о, J = т), Komma auf Q, Punkt ganz rechts
 *    in der Zahlenreihe, Ziffern ohne Shift, ѝ links neben ю und auf Shift + ь,
 *    kein @ # & (in `missing` - solche Zeilen kommen nicht). Nur das steht in der
 *    Hilfe; die Lage auf den phonetischen Tastaturen nicht (unsicher, G3b
 *    ungemessen ausser Edge).
 *  · Die Reihenfolge des Weges „bg" entsteht parallel (F4) - die Hilfe zeigt
 *    die Buchstaben des Weges (`layoutLetterOrder`) und nennt nur die Grobfolge.
 *  · Kyrillisch und Latein: der Windows-Weg zurück (Windows + интервал), kein
 *    Versprechen, was die App dabei tut (Bauplan §2.1 Nr. 2 ist noch nicht gebaut).
 *  · Das Plakat gibt es nicht auf Bulgarisch - angeboten wird das englische
 *    (`handbuchInSprache`, „на английски"). Die Grösse in bulgarischer
 *    Schreibweise (Dezimalkomma, „1,2 MB"): `groesse(…, "de")` - das Gerüst
 *    führt für bg noch den englischen Punkt.
 *  · Die Zeile unter dem Übungsfeld heisst „лента" (nicht „ред" - das ist die
 *    Übungszeile), der Ring „кръг", das Feld „поле за писане". ⚠️ „кръг" heisst
 *    auch Runde (Glossar §2.2) - wo beides in einem Satz steht, „кръгът с числото".
 *
 * Fliesstext mit bulgarischer Anführung (U+201E/U+201C), nur Bindestrich, keine Maus-Wörter.
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
import { downloadAdresse, groesse, handbuchInSprache, tastenflowPlakat } from "@/lib/lernwerkstatt/handbuecher";

// ★ O-BG (25.10.2026): das Wort der Tippchallenge (Glossar §2.3, Bauplan B13) -
// wie `VYZVA` in der tschechischen Hilfe. Steht hier, solange `schreibprobe.ts`
// für bg den englischen Rückfall führt; danach von dort holen.
const PREDIZVIKATELSTVO = "Предизвикателство";
const PREDIZVIKATELSTVA = "Предизвикателства";

export function TippenHilfeBulgarisch({ open, onClose, stufe, lernweg = "bg" }: TippenHilfeProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  useFocusTrap(open, cardRef, { initialFocus: closeRef });
  if (!open) return null;

  const skin = skinForStufe(stufe);
  const isAdult = skin === "erwachsen";
  const kind = skin === "kind";
  const detail = detailFor(stufe);
  const letters = layoutLetterOrder(lernweg);
  // Das Höhlenwesen (deutsche Aufnahmen) gibt es nur auf Weg „de".
  const hoehleMitWesen = hoehleHatWesen(lernweg);
  // Dasselbe Wort wie der Ring (Glossar §2.2: Spielstufe „ниво в играта",
  // Übungsstufe „ниво"); beides sächlich - „твоето", „на кое".
  const ringWort = kind ? "ниво в играта" : "ниво";
  // Die Punkte-Einheit wie im Profil (`skin.ts`): XP für Kinder und Jugend.
  const punkte = isAdult ? "Точките" : "XP";
  // „10 минути" - Zählform = Mehrzahl bei weiblichen Wörtern (Glossar §2.11).
  const einstiegsMinuten = mehrzahl(EINSTIEGSFENSTER_MIN, "bg", {
    one: (z) => `${z} минута`,
    other: (z) => `${z} минути`,
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Помощ за Tastenflow"
      onClick={onClose}
    >
      <div
        ref={cardRef}
        className="card my-8 w-full max-w-2xl space-y-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="m-0 text-xl font-semibold text-ink">Помощ - как работи Tastenflow</h2>
          <button
            ref={closeRef}
            type="button"
            className="btn-secondary btn-toggle"
            onClick={onClose}
            aria-label="Затвори помощта"
          >
            ✕ Затвори
          </button>
        </div>

        <RundgangNochmalKnopf onStart={onClose} />

        <Section title="Просто започни да пишеш">
          <p className="m-0">
            Не е нужно първо да избираш полето. Просто започни да пишеш - първата
            буква веднага се появява в полето. Ако курсорът е другаде, натисни{" "}
            <Kbd>Alt</Kbd> + <Kbd>E</Kbd> и веднага се връщаш в полето за писане.
          </p>
          <JawsRueckweg weg="bg" />
          {detail === 1 && (
            <p className="m-0">
              Пиши винаги с правилния пръст - клавиатурата долу ти показва кой
              клавиш е наред. Натисни два пъти бързо клавиша <Kbd>Shift</Kbd> и ще
              чуеш с кой пръст да пишеш.
            </p>
          )}
        </Section>

        <Section title="Тези знаци има в текста">
          <Zeichenerklaerung
            titel={null}
            zeichen={[
              { zeichen: "·", bedeutung: "разделя две неща, които вървят заедно - като запетая в изречение." },
              { zeichen: "→", bedeutung: "след това, или: от това се получава това." },
              { zeichen: "⏱", bedeutung: "времето, през което се упражняваш." },
              {
                zeichen: "↵",
                bedeutung:
                  "стои в края на реда, когато класът ти го има в настройките - тогава завършваш реда с клавиша Enter.",
              },
            ]}
          />
        </Section>

        <Section title="Събирай звездички 🌟">
          <p className="m-0">
            След всеки кръг получаваш <strong>от 1 до 3 звездички</strong> - и
            собствен звук към тях.{" "}
            <strong>Малкото грешки са много по-важни от скоростта:</strong> който
            пише спокойно и точно, получава сигурни звездички - който бърза и често
            бърка, не.
            {kind ? " Всяко дете може да събира звездички!" : ""}
          </p>
          {detail >= 2 && (
            <p className="m-0">
              3 звездички има за наистина добър кръг - написан точно и с добра
              скорост, като <strong>точността</strong> винаги е по-важна от{" "}
              <strong>бързината</strong>. Когато известно време пишеш добри кръгове,
              минаваш на по-високо <strong>ниво на трудност</strong> - тогава
              наградата звучи още малко по-различно.
            </p>
          )}
        </Section>

        <Section title="Събирай значки 🏅">
          <p className="m-0">
            За специални успехи получаваш <strong>значки</strong> - например за кръг
            съвсем без грешки или за три чисти кръга поред. При нова значка
            прозвучава собствено <strong>„та-даа“</strong> и се казва името ѝ.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              Всички значки са в <strong>„Моят напредък“</strong>, веднага след
              седмичните цели и твоите стойности - там винаги се вижда и{" "}
              <strong>следващата награда</strong> (например: още 2 кръга без грешки
              до следващата значка). Повечето значки са за <strong>точно писане</strong>{" "}
              и за <strong>постоянство</strong> - не за бързане. А няколко са{" "}
              <strong>тайни</strong>: условието им не е написано никъде, просто един
              ден се появяват.
            </p>
          )}
          {detail >= 2 && (
            <p className="m-0">
              Там е и твоят <strong>резултат</strong>: той събира точността и
              скоростта в едно число между 0 и 100 - една грешка се брои колкото 5
              знака, а двойно по-висока скорост - само 1,4 пъти. Точността побеждава
              скоростта.
            </p>
          )}
          {detail >= 2 && (
            <p className="m-0">
              По-надолу „Развитие във времето“ (ред, който се разгъва) показва малка
              крива. Нормално е кривата да не върви само нагоре. Когато се добавят
              нови клавиши, тя обикновено първо пада - особено при клавиша Shift и
              при цифрите.
            </p>
          )}
          <p className="m-0">
            Съвет: избери значка в „Моят напредък“ и натисни <Kbd>Enter</Kbd> -
            значката се показва <strong>в едър размер</strong>, с блясък и конфети.
          </p>
        </Section>

        {skin === "jugend" && (
          <Section title="След нов клавиш">
            <p className="m-0">
              <strong>Новият клавиш</strong> е твой, щом предишните са сигурни - за
              това не е нужно да печелиш нищо. Отбелязва се с кратко празненство и
              после упражнението продължава. Нищо повече не се случва.
            </p>
            <p className="m-0">
              Ако искаш, след това може да дойде кратка игра:{" "}
              <strong>„Ледени късове“</strong>. Ти решаваш - в{" "}
              <strong>Настройки</strong> (<AltText>Alt + O</AltText>), в раздела{" "}
              <strong>„Игра за награда“</strong>. По подразбиране е{" "}
              <strong>„Без игра“</strong>. Тази настройка важи за това устройство.
            </p>
          </Section>
        )}

        {!isAdult && (
          <Section title="Ледени късове 🐧">
            {skin === "jugend" ? (
              <>
                <p className="m-0">
                  Можеш да пуснеш играта <strong>по всяко време</strong> - с бутона{" "}
                  <strong>„🐧 Играй“</strong> на лентата под полето за писане.
                  Пингвинът скача по ледените късове, катери се по планината от букви
                  и се пързаля по корем надолу - винаги с клавишите, които в момента
                  ти създават най-много трудности. По пътя изскачат{" "}
                  <strong>бонус рибки</strong> (клавиш, натиснат навреме = хваната
                  рибка; изпусната рибка никога не е грешка), а в{" "}
                  <strong>„Пещерата на ехото“</strong> всеки клавиш само се обявява.
                  Играта <strong>не се брои</strong> за време за упражнения и не е
                  условие за нови знаци - но носи собствени значки.
                </p>
                <p className="m-0">
                  След нов клавиш тя започва сама <strong>само тогава</strong>, когато
                  в Настройки е избрана като <strong>„Игра за награда“</strong>.
                  Иначе нищо не те прекъсва - ти решаваш кога да играеш.
                </p>
              </>
            ) : (
              <>
                <p className="m-0">
                  Когато научиш <strong>нов клавиш</strong>, за празника те чака
                  играта „Ледени късове“: помогни на пингвина да мине през водата -
                  натискай винаги клавиша, който е на следващия леден къс! Понякога
                  след това пътят води дори нагоре по <strong>планината от букви</strong>{" "}
                  и по корем пак надолу. Новият клавиш е твой още преди това - играта
                  е награда, не задължение.
                </p>
                <p className="m-0">
                  Можеш да пуснеш играта и <strong>по всяко време</strong> - с бутона{" "}
                  <strong>„🐧 Играй“</strong> горе в картата за упражнение, точно до
                  кръга с числото. Това е голямото <strong>приключение</strong>: всеки
                  ден изглежда малко по-различно, по пътя изскачат{" "}
                  <strong>бонус рибки</strong> (бързо натисни техния клавиш и са твои),
                  а в <strong>„Пещерата на ехото“</strong> не виждаш букви -{" "}
                  {hoehleMitWesen ? (
                    <>
                      пещерата ти <strong>казва</strong> всеки клавиш.
                    </>
                  ) : (
                    <>
                      всеки клавиш звучи като тон, а екранният четец или брайловият
                      дисплей ти <strong>казва</strong> кой е.
                    </>
                  )}{" "}
                  Играта е само за забава и <strong>не се брои</strong> за време за
                  упражнения - но носи собствени значки!
                </p>
                {detail >= 2 && (
                  <p className="m-0">
                    Не се тревожи: ако леденият къс потъне или се подхлъзнеш на
                    планината, пингвинът просто доплува обратно - веднага можеш да
                    опиташ пак, колкото пъти искаш. А който мине цялото приключение
                    без нито едно цопване, вижда как над иглуто танцува{" "}
                    <strong>полярно сияние</strong>!
                  </p>
                )}
              </>
            )}
          </Section>
        )}

        <Section title="Какво означава кръгът с числото?">
          <p className="m-0">
            Числото в кръга е твоето <strong>{ringWort}</strong>.{" "}
            <strong>{punkte} са точки за упражнение:</strong> след всеки кръг
            упражнения получаваш няколко и кръгът с числото се пълни. Когато е пълен
            (100 точки), минаваш на следващото {ringWort}. Това е само за събиране и{" "}
            <strong>не прави</strong> упражнението по-трудно - като точките в игра.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              Не го бъркай с <strong>нивото на трудност (1-50)</strong>: то казва
              колко бързо трябва да пишеш и се нагласява към теб{" "}
              <strong>само</strong> - качва се, когато върви добре, и слиза, когато е
              трудно.
            </p>
          )}
          {detail >= 3 && (
            <p className="m-0">
              А настройката <strong>„Текстове за възраст“</strong> определя само
              колко трудни са думите и изреченията - според възрастта. В клас я
              настройва учителят за всички; без клас я намираш горе в Настройки ⚙.
              Значи три различни неща: <em>{ringWort}</em> = точки,{" "}
              <em>ниво на трудност</em> = очаквана скорост,{" "}
              <em>Текстове за възраст</em> = възраст.
            </p>
          )}
        </Section>

        <Section title={detail === 1 ? "Колко често да се упражняваш?" : "Време за упражнения и седмична цел"}>
          {detail === 1 ? (
            <p className="m-0">
              Упражнявай се <strong>често и малко</strong>, вместо веднъж много дълго -
              например няколко дни по няколко минути. На лентата под полето за писане
              часовник брои колко време вече пишеш днес; точно това време пълни там и{" "}
              <strong>кръга</strong> - седмичната ти цел.
            </p>
          ) : (
            <p className="m-0">
              С акаунт може да има <strong>седмична цел</strong>: определен брой{" "}
              <strong>минути на седмица</strong>. В клас я задава учителят; без клас
              можеш да я зададеш в Настройки ⚙ в „Моята седмична цел“ - новата цел
              важи от следващия понеделник. Седмицата започва{" "}
              <strong>в понеделник в 8:00</strong> и свършва следващия понеделник в
              същия час. На лентата под полето за писане виждаш състоянието като{" "}
              <strong>кръг</strong>, например „25/60 мин“ - когато седмицата е
              изпълнена, кръгът е пълен и в него се появява отметка. Понякога има и
              минути от по-ранна седмица за <strong>наваксване</strong>; тогава до
              кръга пише колко са. Когато седмичната цел е изпълнена, се появява
              кратък прозорец с поздравление - после можеш по всяко време да
              продължиш да се упражняваш, ако искаш.
            </p>
          )}
        </Section>

        <Section title="Настройки: зъбчатото колело ⚙ горе">
          <p className="m-0">
            Всички настройки са зад бутона <strong>„⚙ Настройки“</strong> най-горе,
            точно вляво от кръглия знак с първата буква на името ти:{" "}
            <strong>„Какво упражняваш?“</strong>, <strong>„Текстове“</strong> (възраст
            и език), <strong>„Клавиатура“</strong>, <strong>„Звук“</strong> и{" "}
            <strong>„Четене на глас“</strong>. Едно натискане ги отваря, второ ги
            затваря - или <Kbd>Alt</Kbd> + <Kbd>O</Kbd>, това става и по средата на
            писането. При отваряне курсорът веднага отива в настройките, при
            затваряне - обратно в полето за писане.
          </p>
          <p className="m-0">
            Най-горе в настройките е <strong>„Какво упражняваш?“</strong>: трите
            пътя <strong>„Моята тренировка“</strong>, <strong>„Истории“</strong> и{" "}
            <strong>„Игри с думи“</strong>. <Kbd>Alt</Kbd> + <Kbd>B</Kbd> минава
            поред към следващия път и новият път се обявява.
          </p>
          <p className="m-0">
            Кръглият бутон със земното кълбо горе сменя езика на Tastenflow -
            бутоните, менютата и веднага и текстовете за упражнение. Езика на самите
            текстове можеш после да смениш отделно в <strong>„Текстове“</strong>,
            освен ако не е определен за класа.
          </p>
          <p className="m-0">
            В <strong>„Клавиатура“</strong> избираш клавиатурата, която наистина е
            пред теб. В България най-често това е <strong>„Българска (БДС)“</strong>;
            има и <strong>„Българска (пишеща машина)“</strong>,{" "}
            <strong>„Българска фонетична“</strong> и{" "}
            <strong>„Българска фонетична (традиционна)“</strong>. Тогава
            клавиатурата на екрана и съветите за пръстите съвпадат - и идват само
            знаци, които ги има на тази клавиатура. Най-важното за българската
            клавиатура (БДС):
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              Основният ред е <strong>ь я а о ж г т н в м ч</strong>. В изходна
              позиция пръстите почиват на ь я а о и т н в м; показалците намират
              мястото си по издатините на клавишите <strong>О</strong> и{" "}
              <strong>Т</strong>.
            </li>
            <li>
              <strong>Цифрите</strong> се пишат без клавиша Shift.
            </li>
            <li>
              <strong>Запетаята</strong> е на клавиша, където на английската
              клавиатура е Q, а <strong>точката</strong> - най-вдясно в реда с
              цифрите.
            </li>
            <li>
              <strong>ѝ</strong> е вляво от ю (с клавиша Shift: Ѝ), а също на{" "}
              <Kbd>Shift</Kbd> + <Kbd>ь</Kbd>.
            </li>
            <li>
              Знаци като @ # & ги няма на българската клавиатура (БДС) - редове с тях
              не идват.
            </li>
            <li>
              Ако вместо кирилица се появяват латински букви, клавиатурата пише на
              латиница. Превключи с <Kbd>Windows</Kbd> + интервал.
            </li>
          </ul>
          <p className="m-0">
            Там е и <strong>„Писане с една ръка“</strong> - за всички, които пишат с
            една ръка: тогава главните букви и символите важат с всеки от двата
            клавиша Shift. В клас това се настройва от учителя.
          </p>
          <p className="m-0">
            Когато е включено <strong>„По-голямо разстояние между знаците (CVI)“</strong>,
            докато пишеш, всичко освен полето, в което се пише в момента (редът за
            упражнение или игралното поле), потъмнява; след 5 секунди без писане
            отново изсветлява. Редът за упражнение при това плавно се плъзга в
            ритъма на писането ти, вместо да подскача. Разстоянието между знаците
            можеш да настроиш в Настройки ⚙ по всяко време - в клас може да го
            настрои и учителят; важи това, което е избрано последно.
          </p>
          <p className="m-0">
            С <strong>Целенасочено упражнение</strong> можеш да избереш до 8 клавиша или знака, които се срещат особено често в кръговете - в настройките в групата <strong>Какво упражняваш?</strong> или с <Kbd>Alt</Kbd> + <Kbd>2</Kbd>. В клас това го настройва твоят учител.
          </p>
        </Section>

        <Section title="Четене на глас - програмата чете на глас">
          <p className="m-0">
            С бутона <strong>„🗣 Четене на глас“</strong> (или <Kbd>Alt</Kbd> +{" "}
            <Kbd>V</Kbd>) програмата чете на глас - за всички, които (още) не
            използват екранен четец. Горе в Настройки ⚙ избираш какво да се чете:{" "}
            <strong>клавиши</strong> („Клавиш по клавиш“), <strong>думи</strong>,{" "}
            <strong>изречения</strong> - едно, няколко или всичко - и колко бързо.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              В <strong>„Глас“</strong> можеш да избереш друг глас.
            </p>
          )}
          {detail >= 3 && (
            <p className="m-0">
              Не се тревожи за скоростта: <strong>времето за четене на глас се
              изважда</strong> - чакането на съобщението не забавя скоростта ти.
            </p>
          )}
        </Section>

        <Section title="Мелодия при писане 🎵">
          <p className="m-0">
            <strong>„Мелодия при писане“</strong> е за упражняване на{" "}
            <strong>равномерен ритъм на писане</strong> - и преди всичко трябва да е{" "}
            <strong>забавна</strong>. Всеки правилен клавиш свири следващия тон от
            песен; който държи ритъма, получава дори цяла група към нея.
          </p>
          <p className="m-0">
            Който пише равномерно, става по-плавен и при по-слабите клавиши: ритъмът
            помага да минеш през местата, където иначе се колебаеш.
          </p>
          <p className="m-0">
            Включва се с <Kbd>Alt</Kbd> + <Kbd>6</Kbd>, в Настройки ⚙ или в менюто
            под кръглия бутон с високоговорителя горе - там с плъзгачи се настройва и
            силата на звука на всички звуци. Звукът на мелодията се сменя с{" "}
            <Kbd>Alt</Kbd> + <Kbd>7</Kbd> и <Kbd>Alt</Kbd> + <Kbd>8</Kbd>.
          </p>
        </Section>

        <Section title="Главни букви и препинателни знаци">
          <p className="m-0">
            На български с <strong>главна буква</strong> започват изреченията и
            имената (Иван, София, Дунав). Tastenflow ги пише{" "}
            <strong>винаги правилно</strong>, затова никога не виждаш грешно
            написана дума.
          </p>
          <p className="m-0">
            <strong>В началото е съвсем лесно:</strong> просто напиши{" "}
            <strong>малката</strong> буква - <strong>главната</strong> се появява
            сама. Още <strong>не е нужно</strong> да можеш да използваш клавиша{" "}
            <Kbd>Shift</Kbd>.
          </p>
          <p className="m-0">
            <strong>Скоро</strong>, след първите букви, научаваш клавиша{" "}
            <Kbd>Shift</Kbd> „истински“: държиш го с <strong>едната</strong> ръка и
            пишеш буквата с <strong>другата</strong> - както на всяка клавиатура. Така
            скоро пишеш главните букви <strong>със собствените си пръсти</strong>, не
            само с автоматичната помощ.
          </p>
          <div className="rounded-lg border border-hairline bg-surface-raised p-3">
            <p className="m-0">
              <strong>Важно - Shift винаги с ДРУГАТА ръка:</strong> клавишите Shift
              са два, вляво и вдясно. Пишеш буквата с едната ръка, а клавиша{" "}
              <Kbd>Shift</Kbd> държиш с <strong>другата</strong>. Така никоя ръка не
              трябва да натиска два клавиша наведнъж.
            </p>
            <p className="m-0 mt-2">
              Пример: главно <strong>А</strong> (лява ръка) → <strong>десният</strong>{" "}
              <Kbd>Shift</Kbd>. Главно <strong>К</strong> (дясна ръка) →{" "}
              <strong>левият</strong> <Kbd>Shift</Kbd>.
            </p>
            <p className="m-0 mt-2">
              Tastenflow приема <strong>само правилния</strong> Shift. Ако натиснеш{" "}
              <strong>грешния</strong> Shift или клавиша <Kbd>Caps Lock</Kbd>, се
              появява <strong>малка</strong> буква - това е <strong>грешка</strong>,
              за да упражняваш правилната ръка от самото начало.
            </p>
          </div>
          {detail >= 2 && (
            <p className="m-0 text-sm text-ink-muted">
              Съвет: натисни клавиша <Kbd>Shift</Kbd> <strong>два пъти бързо</strong>{" "}
              - ще чуеш с кой пръст да го държиш.
            </p>
          )}
          <p className="m-0">
            <strong>Точката, запетаята и въпросителният знак</strong> се появяват
            едва когато ги научиш. Дотогава просто четеш изречението{" "}
            <strong>без тях</strong> - това е нарочно, не е грешка.
          </p>
        </Section>

        <Section title="В какъв ред идват буквите?">
          <p className="m-0">
            Новите клавиши идват винаги в един и същ ред: първо{" "}
            <strong>основният ред</strong>, после останалите букви - най-честите
            първи. Кой клавиш идва следващ, виждаш винаги вдясно на лентата под
            полето за писане: <strong>„Следващ клавиш“</strong>.
          </p>
          <div className="flex flex-wrap gap-1" aria-hidden="true">
            {letters.map((ch) => (
              <Kbd key={ch}>{unitGlyph(ch)}</Kbd>
            ))}
          </div>
          <p className="m-0 text-sm text-ink-muted">
            Още <strong>след първите букви</strong> идват{" "}
            <strong>главните букви</strong> (клавиша Shift),{" "}
            <strong>запетаята и точката</strong> - изречението започва с главна
            буква и завършва с точка. После останалите букви. Накрая идват
            останалите <strong>препинателни знаци</strong> (? ! : ; - и други),{" "}
            <strong>цифрите</strong> и <strong>символите</strong>.
          </p>
          <span className="sr-only">
            Ред на буквите: {letters.join(", ")}.
          </span>
        </Section>

        {detail >= 2 && (
          <Section title="Как работи „Моята тренировка“">
            <p className="m-0">
              <strong>Тя се нагласява към теб.</strong> Програмата помни кои
              клавиши са още несигурни и упражнява точно тях. Нов клавиш идва едва
              когато другите са сигурни. <strong>Най-честите</strong> букви идват
              първи - така още след няколко клавиша пишеш{" "}
              <strong>истински думи и изречения</strong>, а първите{" "}
              <strong>истории</strong> се отключват рано.
            </p>
          </Section>
        )}

        <Section title="Лентата под полето за писане">
          <p className="m-0">
            Под полето за писане има тясна лента с четири неща: твоето{" "}
            <strong>{ringWort}</strong>, днешното <strong>време</strong> за
            упражнения, <strong>седмичната цел</strong> и{" "}
            <strong>следващия клавиш</strong>. При седмичната цел кръгът показва
            колко <strong>минути</strong> упражнения има вече тази седмица -
            например „25/60 мин“; <strong>отметка</strong> означава: седмицата е
            изпълнена. Следващият клавиш се отключва <strong>сам</strong>, щом
            предишните са сигурни - просто продължавай да се упражняваш.
          </p>
          <p className="m-0">
            Лентата се вижда <strong>винаги</strong> - и докато пишеш. Така нищо не
            подскача и по всяко време виждаш колко време вече се упражняваш.
          </p>
          <p className="m-0">
            <Kbd>Alt</Kbd> + <Kbd>D</Kbd> казва времето за упражнения и седмичната
            цел. Кои клавиши вече са сигурни, кои още не и кой идва следващ, ще
            намериш в <strong>„Моят напредък“</strong> под заглавието{" "}
            <strong>„Състояние на клавишите“</strong> (<Kbd>Alt</Kbd> + <Kbd>S</Kbd>,
            с акаунт).
          </p>
        </Section>

        <Section title="Библиотеката: „Истории и любопитни факти“ 📖">
          <p className="m-0">
            Освен „Моята тренировка“ има още един път: <strong>„Истории“</strong> -
            в Настройки ⚙ под <strong>„Какво упражняваш?“</strong>. Там те чакат
            цели истории и поредици с любопитни факти - не отделни изречения, а{" "}
            <strong>една история за много кръгове</strong>. Всяка част е дванадесет
            реда; следващия път продължаваш да четеш точно оттам, докъдето стигна.
          </p>
          <p className="m-0">
            Появява се само това, което наистина можеш да напишеш с вече научените
            клавиши - затова в началото още се виждат катинари. Те се отключват
            сами, щом достатъчно клавиши са сигурни. Всеки ред идва{" "}
            <strong>само веднъж</strong>: каквото вече е написано, не се връща като
            повторение.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              <strong>Червената нишка:</strong> каквото прочетеш в поредица с
              любопитни факти, по-късно идва отново в тренировката - като{" "}
              <strong>въпрос с други думи</strong>, после като малко задълбочаване и
              накрая като шега по темата. Така наученото остава в главата, без да
              прилича на изпитване.
            </p>
          )}
          {detail >= 3 && (
            <p className="m-0 text-sm text-ink-muted">
              Под списъка е „Източници и благодарности“: там виждаш откъде идват
              текстовете. Някои са написани специално за програмата, други идват от
              свободно достъпни източници - те са посочени там с името си, както е
              редно.
            </p>
          )}
        </Section>

        <Section title="Откъде са текстовете? 🤖">
          <p className="m-0">
            Собствените текстове на тази програма - изречения за упражнение, шеги и
            истории - Johannes ги написа <strong>с помощта на изкуствен интелект
            (ИИ)</strong> и после лично ги прочете и провери. Текстовете от други
            източници са посочени с името на източника в „Източници и
            благодарности“.
          </p>
          <p className="m-0">
            {hoehleMitWesen ? (
              <>
                Пеещата риба и мърморещото пещерно същество в „Полярна експедиция“
                също са <strong>компютърни гласове</strong>, не истински хора.
              </>
            ) : (
              <>
                Пеещата риба в „Полярна експедиция“ също е{" "}
                <strong>компютърен глас</strong>, не истински човек.
              </>
            )}{" "}
            Четенето на глас (🗣) използва гласа на твоето устройство.
          </p>
        </Section>

        <Section title={PREDIZVIKATELSTVO}>
          <p className="m-0">
            Понякога в класа започва <strong>{PREDIZVIKATELSTVO}</strong> - за целия
            клас. <strong>Всички получават един и същ текст</strong> и всички имат
            еднакво време.
          </p>
          <p className="m-0">
            <strong>Времето тече едва от първото ти натискане на клавиш</strong> - не
            още от момента, в който {PREDIZVIKATELSTVO}то започне. От началото имаш{" "}
            <strong>{einstiegsMinuten}</strong>, за да започнеш.
          </p>
          <p className="m-0">
            <strong>Как да го познаеш:</strong> над полето за писане стои думата{" "}
            <strong>{PREDIZVIKATELSTVO}</strong>, до нея е времето, а около цялата
            област има друга, <strong>пунктирана рамка</strong>. Щом времето изтече,
            и двете изчезват.
          </p>
          <p className="m-0">
            <strong>Колко време остава, без да гледаш:</strong> <Kbd>Alt</Kbd> +{" "}
            <Kbd>X</Kbd> ти казва. Сам по себе си часовникът се обажда само няколко
            пъти, иначе мълчи.
          </p>
          <p className="m-0">
            <strong>Брайловият дисплей остава спокоен.</strong> Времето{" "}
            <strong>не тиктака</strong> на дисплея: то върви горе, но никога не се
            вмъква в това, което четеш в момента.
          </p>
          <p className="m-0">
            <strong>Понякога {PREDIZVIKATELSTVO}то е „Свободно писане“.</strong>{" "}
            Тогава грешката при писане просто остава - нищо не се отбелязва, никакъв
            звук не я съобщава. Клавишът <Kbd>Backspace</Kbd> поправя само в текущия
            ред; завършеният ред остава какъвто е. В края на реда след последната
            дума натискаш клавиша за интервал - или, ако класът е включил „Край на
            реда с Enter“, клавиша <Kbd>Enter</Kbd>. Какво накрая е още грешно,
            показва едва прегледът след това, като списък за четене.
          </p>
          <p className="m-0">
            <strong>Да спреш по-рано:</strong> <Kbd>Esc</Kbd> пита дали наистина.
            Бутонът <strong>„Пиши нататък“</strong> (също <Kbd>Esc</Kbd>) връща в
            реда, бутонът <strong>„Предай“</strong> предава - оценява се това, което
            е написано дотогава. Същото прави бутонът{" "}
            <strong>„Готово - предай“</strong> под полето, без въпрос.
          </p>
          <p className="m-0">
            <strong>Когато времето изтече,</strong> веднага виждаш своя преглед:
            знака в минута, точност, знаци, грешки, редове и клавишите, които са
            били несигурни. Всяко {PREDIZVIKATELSTVO} после остава в{" "}
            <strong>„Моят напредък“</strong> под заглавието{" "}
            <strong>{PREDIZVIKATELSTVA}</strong> - там можеш да го прочетеш отново по
            всяко време.
          </p>
        </Section>

        <Section title="Състезание в класа ⚔️">
          <p className="m-0">
            В Състезанието в класа пишеш <strong>пет минути наперегонки</strong> с
            другите деца от класа си. Състезанието го има само в клас и само ако е
            разрешено за класа.
          </p>
          <p className="m-0">
            <strong>Обяви състезание:</strong> <Kbd>Alt</Kbd> + <Kbd>M</Kbd> или
            бутона <strong>„⚔️ Състезание в класа“</strong> на лентата над полето за
            писане - точно до <strong>„🐧 Играй“</strong>. При всички останали се
            отваря прозорец с бутоните <strong>„Участвам!“</strong> и{" "}
            <strong>„Не сега“</strong>. С <Kbd>Esc</Kbd> се връщаш към упражнението,
            а същата покана не се появява отново сама.
          </p>
          <p className="m-0">
            <strong>Ако някой вече кани,</strong> <Kbd>Alt</Kbd> + <Kbd>M</Kbd>{" "}
            извиква тази покана отново - второ състезание може да започне едва когато
            първото вече тече. Ако две покани дойдат почти едновременно, важи
            тази, която е дошла първа.
          </p>
          <p className="m-0">
            <strong>Когато точно сега не става:</strong> ако вече участваш в
            състезание, бутонът се казва{" "}
            <strong>„⚔️ Състезанието в класа тече“</strong> - и <Kbd>Alt</Kbd> +{" "}
            <Kbd>M</Kbd> ти казва същото. Другите състезания в класа не пречат: може
            да вървят колкото искат едновременно.
          </p>
          <p className="m-0">
            <strong>Всеки пише на своето ниво.</strong> Който вече може цифрите,
            получава цифри; който е на основния ред, получава основния ред. Грешките
            струват нещо - една грешка тежи колкото пет знака.
          </p>
          <p className="m-0">
            <strong>Как е класирането, без да гледаш:</strong> най-вляво в реда за
            писане винаги има осем клетки - <strong>P2</strong> е мястото, до него е
            оставащото време. <Kbd>Alt</Kbd> + <Kbd>X</Kbd> ти казва мястото,
            времето и първите три места. Само по себе си нищо не се обажда -
            брайловият дисплей остава спокоен.
          </p>
          <p className="m-0">
            <strong>Да спреш по-рано:</strong> <Kbd>Esc</Kbd> или бутонът{" "}
            <strong>„Напусни“</strong> пита дали наистина. Бутонът{" "}
            <strong>„Пиши нататък“</strong> (също <Kbd>Esc</Kbd>) връща в реда.
            Бутонът <strong>„Напусни“</strong> прекратява състезанието само за теб -
            другите продължават да пишат и виждат какво е написано дотогава.
          </p>
          <p className="m-0">
            <strong>Състезанието се брои към времето ти за упражнения</strong> и може
            да отключи нов клавиш - точно като обикновен кръг.{" "}
            <strong>Място не се запазва.</strong> Накрая се появява списъкът: Купа,
            Сребро и Бронз за първите три места, всички останали с номера си. После
            бутонът <strong>„Упражнявай се още“</strong> или <Kbd>Esc</Kbd> те връща
            обратно.
          </p>
        </Section>

        <Section title="Важни клавиши">
          <p className="m-0 text-sm text-ink-muted">
            <AltOderWahl>
              На Mac вместо клавиша <Kbd>Alt</Kbd> е клавишът <Kbd>⌥</Kbd> (Option).
            </AltOderWahl>
          </p>
          <ul className="m-0 list-none space-y-2 p-0">
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Esc</Kbd>
              </span>
              <span>
                <strong>Най-важният клавиш:</strong> затваря всеки прозорец и после
                курсорът е <strong>винаги в полето за писане</strong>. Дори когато
                нищо не е отворено, <Kbd>Esc</Kbd> го връща там. Единственото
                изключение е „Разглеждане на клавишите“: там и клавишът{" "}
                <Kbd>Esc</Kbd> е клавиш за разглеждане и излизаш едва с второто
                натискане.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Shift</Kbd> <Kbd>Shift</Kbd>
              </span>
              <span>Два пъти бързо: казва се правилният пръст.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>E</Kbd>
              </span>
              <span>Скок в полето за писане.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>U</Kbd>
              </span>
              <span>Към упражнението.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>S</Kbd>
              </span>
              <span>
                Отваря „Моят напредък“ (за учители: „Моите класове“). Работи само
                след вход. Второ натискане връща в полето за писане.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>Z</Kbd>
              </span>
              <span>Казва на кой ред си в момента.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>D</Kbd>
              </span>
              <span>
                Казва времето за упражнения - на брайловия дисплей и (с четене на
                глас) като съобщение.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>L</Kbd>
              </span>
              <span>Казва на кое {ringWort} си в момента.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>3</Kbd>
              </span>
              <span>
                <strong>Разглеждане на клавишите:</strong> всеки клавиш, който
                натиснеш, се казва и се показва в едър размер - първо съкращението,
                после името, после какво прави (например „Tab - табулация -
                преминава към следващия елемент“). Това важи и за всички специални
                клавиши и препинателни знаци, за знаците с AltGr (на Mac: Option)
                заедно с пътя до тях и за клавишни комбинации като Ctrl + C - заедно с
                това, което правят. Клавишните комбинации на самия Tastenflow (
                <AltText>Alt + H, Alt + V ...</AltText>) продължават да работят.
                Екранната клавиатура показва кой клавиш е натиснат. Когато четенето на
                глас е изключено, гласът мълчи. На брайловия дисплей обяснението
                остава до следващия клавиш и може да се прочете цялото с клавишите за
                превъртане; на екрана е в прозорец. Нищо не се написва, нищо не се
                губи. <strong>Как се излиза:</strong> още веднъж <Kbd>Alt</Kbd> +{" "}
                <Kbd>3</Kbd>, два пъти <Kbd>Esc</Kbd> - или просто презареди
                страницата.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>4</Kbd>
              </span>
              <span>
                <strong>Търсене на клавиши:</strong> програмата казва името на
                клавиш, а ти го търсиш. При първото попадение програмата те похвалва и
                те моли за друг клавиш, а после за още едно натискане - брои се едва
                второто, и то само след друг клавиш между тях. После идва следващият
                клавиш. Друг клавиш само се назовава. В прозореца <Kbd>Alt</Kbd> +{" "}
                <Kbd>4</Kbd> превключва между разглеждане и търсене.{" "}
                <strong>Как се излиза:</strong> както при разглеждането.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>K</Kbd>
              </span>
              <span>
                <strong>Цветове и контраст:</strong> седем цветови теми - светла,
                тъмна, черно на жълто, жълто на синьо и други. Всяка се показва още в
                списъка в собствените си цветове, така че предварително виждаш как
                изглежда.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>T</Kbd>
              </span>
              <span>Отваря или затваря списъка с клавишни комбинации.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>N</Kbd>
              </span>
              <span>Отваря или затваря съобщенията от учителите.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>+</Kbd> / <Kbd>-</Kbd>
              </span>
              <span>Увеличава или намалява полето за писане.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>V</Kbd>
              </span>
              <span>Включва или изключва четенето на глас.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>H</Kbd>
              </span>
              <span>Отваря или затваря тази помощ.</span>
            </li>
            <WeitereTasten />
          </ul>
        </Section>

        {detail >= 3 && (
          <Section title="Как програмата те подкрепя">
            <p className="m-0">
              Програмата измерва всяка буква поотделно - колко точно и колко бързо я
              пишеш. Сама упражнява най-слабите и отключва нова буква едва когато
              предишните са сигурни. Така се получава твой собствен път на обучение.
            </p>
            <p className="m-0">
              Нивото на трудност (1-50) се грижи винаги да е{" "}
              <strong>трудно, но по силите ти</strong>: когато върви добре, то се
              качва; когато стане прекалено трудно, пак слиза. В{" "}
              <strong>„Моят напредък“</strong> виждаш всичко за напредъка си - и как
              се подобряваш.
            </p>
          </Section>
        )}

        <Section title="Упражнения без клас - собствен акаунт 🙋">
          <p className="m-0">
            Който не е в клас, си създава собствен акаунт: при кръглия бутон{" "}
            <strong>„Акаунт“</strong> сложи отметка на{" "}
            <strong>„Упражнявам се самостоятелно, без клас“</strong>. За това е нужен
            имейл адрес: там всеки понеделник идва седмичният отчет - но само в
            седмиците, в които наистина е имало упражнения. Ако цяла година никой не
            отвори нито една от четирите програми, идва предупреждение по имейл; ако
            после три седмици никой не влезе, акаунтът се изтрива заедно с целия
            напредък.
          </p>
        </Section>

        <PlakatAbschnitt />
      </div>
    </div>
  );
}

/** Плакат за окачване - на български (`handbuchInSprache`). */
function PlakatAbschnitt() {
  const plakat = handbuchInSprache(tastenflowPlakat(), "bg");
  return (
    <Section title="Плакат за окачване">
      <p className="m-0">
        Искаш ли да покажеш Tastenflow в своето училище или организация? Тук има{" "}
        <strong>плакат за отпечатване и окачване</strong>: A3, вертикален - с един
        поглед се вижда какво може Tastenflow, и към това QR код към tastenflow.org.
      </p>
      <p className="m-0">
        <a
          href={downloadAdresse(plakat)}
          download={plakat.speicherName}
          type="application/pdf"
          className="text-accent underline underline-offset-2"
        >
          {/* Die Grösse mit Dezimalkomma wie im Bulgarischen (`groesse(…, "de")`, Dateikopf). */}
          Изтегли плаката (PDF на български, A3, {groesse(plakat.bytes, "de")})
        </a>
      </p>
    </Section>
  );
}
