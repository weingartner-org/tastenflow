/**
 * ★ O2 (29.10.2026): NAME, KURZNAME UND ERKLÄRUNG JEDER TASTATUR UNGARISCH.
 *
 * Bauart wie `tastaturTexteCs.ts`: `layouts.ts` bleibt unberührt, die ungarische Tabelle steht HIER, und
 * `layoutTexteIn` (`tastaturTexteIt.ts`) ist der eine Weg, den die Oberfläche geht. Eine Tabelle je `LayoutId`,
 * damit `tsc` für jede Tastatur einen Eintrag verlangt - anders als bei cs auch für die Tastaturen der neun neuen
 * Sprachen (bg, el, hu, nl, pt, br, ro, sv, uk): jede trägt eine echte Übersetzung, keinen englischen Rückfall.
 *
 * Namen nach dem Glossar (`recherche-ungarisch-2026-10-25/GLOSSAR-hu.md` §2.9 `LAYOUT_TEXTE_HU`): „Magyar (QWERTZ)",
 * „Magyar (101 billentyűs, QWERTY)", „Német (Németország és Ausztria)", „Angol (USA)", „Angol (Egyesült Királyság)";
 * die übrigen nach demselben Muster (Sprache, dann Land oder Bauart in Klammern). Der Kurzname klein - er steht nach
 * „Billentyűzet:". Tastennamen wie auf der Kappe und wie in `tastenErklaerungHu.ts`: Shift, Caps Lock, AltGr, Enter,
 * Mac: Option; im Satz IMMER mit Kopfwort „billentyű" (Glossar Regel 11, nie „Shifttel"). Totaste = „holtbillentyű",
 * Akzente nach `AKZENTE_HU`: éles ékezet, tompa ékezet, kalap, két pont; ~ = hullámvonal.
 * Die Erklärungen sagen dasselbe wie die englischen (`layout.en.hinweis`), Satz für Satz an ihnen geprüft; sie sind
 * unpersönlich („írható", „jön"), weil Kind und Lehrkraft sie lesen. Keine französischen Anführungszeichen im Text
 * (sie hiessen auf der Braillezeile etwas anderes) - „francia idézőjel". Kein Satz endet mit einer Ziffer und Punkt
 * (die Stimme läse eine Ordnungszahl).
 */
import type { LayoutId } from "./layouts";

type Texte = { label: string; kurz: string; hinweis?: string };

const ANGOL =
  "Az angol billentyűzeteken nincs ä, ö, ü és ß. A német szövegek ezért a szokásos helyettesítést használják " +
  "(ä → ae, ß → ss) - angol nyelvhez ez a billentyűzet pont megfelelő.";

export const LAYOUT_TEXTE_HU: Record<LayoutId, Texte> = {
  de: { label: "Német (Németország és Ausztria)", kurz: "német billentyűzet" },
  ch: {
    label: "Svájci (német)",
    kurz: "svájci billentyűzet",
    hinweis:
      "A svájci billentyűzeten nincs ß billentyű, ezért a német szavakban a ß helyett ss írható - ahogy Svájcban " +
      "szokás. A nagy Ä, Ö és Ü a ¨ holtbillentyűvel írható (az ü jobb oldalán), utána a Shift billentyű és a betű " +
      "(a Shift billentyű az ä, ö és ü billentyűn à, é és è betűt ad). A Caps Lock billentyű is működik.",
  },
  us: { label: "Angol (USA)", kurz: "amerikai billentyűzet", hinweis: ANGOL },
  uk: { label: "Angol (Egyesült Királyság)", kurz: "brit billentyűzet", hinweis: ANGOL },
  fr: {
    label: "Francia (Franciaország, AZERTY)",
    kurz: "francia billentyűzet",
    hinweis:
      "A francia AZERTY billentyűzeten (Windows) nincs É, Ç, Œ és francia idézőjel - az É-t vagy Ç-t tartalmazó " +
      "szövegek kimaradnak, az Œ és a francia idézőjel helyett a szokásos helyettesítés áll (Œ → Oe, francia " +
      "idézőjel → egyenes idézőjel). Az À, È és Ù a tompa ékezet holtbillentyűjével írható (AltGr + 7), az Ê, Î, " +
      "Ô és Û a ^ billentyűvel - mindegyik után a Shift billentyű és a betű jön.",
  },
  be: {
    label: "Francia (Belgium, AZERTY)",
    kurz: "belga billentyűzet",
    hinweis:
      "A belga AZERTY billentyűzeten (Windows) nincs nagy Ç, Œ és francia idézőjel - a Ç-t tartalmazó szövegek " +
      "kimaradnak, az Œ és a francia idézőjel helyett a szokásos helyettesítés áll. Az É az éles ékezet " +
      "holtbillentyűjével írható (AltGr + ù), az À, È és Ù a tompa ékezet holtbillentyűjével (AltGr + µ), az Ê, " +
      "Î, Ô és Û a ^ billentyűvel - mindegyik után a Shift billentyű és a betű jön.",
  },
  "ch-fr": {
    label: "Svájci francia (Svájc és Luxemburg)",
    kurz: "svájci francia billentyűzet",
    hinweis:
      "A svájci francia billentyűzeten nincs nagy Ç, Œ és francia idézőjel - a Ç-t tartalmazó szövegek " +
      "kimaradnak, az Œ és a francia idézőjel helyett a szokásos helyettesítés áll. Az É az éles ékezet " +
      "holtbillentyűjével írható (AltGr + '), az À, È és Ù a tompa ékezet holtbillentyűjével (Shift + ^) - " +
      "mindegyik után a Shift billentyű és a betű jön. A Shift billentyű az é, à és è billentyűn ö, ä és ü betűt " +
      "ad. Macen az É, À és È a Caps Lock billentyűvel is írható.",
  },
  "ca-csa": {
    label: "Kanadai francia (kanadai többnyelvű szabvány)",
    kurz: "kanadai billentyűzet (CSA)",
    hinweis:
      "A kanadai billentyűzeten (CSA) nincs Œ - a szövegek a szokásos helyettesítést használják (Œ → Oe). Az É, " +
      "À, È, Ç és Ù közvetlenül a Shift billentyűvel írható, az Ê, Î, Ô és Û a ^ billentyűvel (utána a Shift " +
      "billentyű és a betű jön), a francia idézőjel az AltGr + Z és az AltGr + X billentyűkkel, az euró (€) az " +
      "AltGr + E billentyűkkel.",
  },
  "ca-fr": {
    label: "Kanadai francia (Français (Canada), Windows-szabvány)",
    kurz: "kanadai francia billentyűzet",
    hinweis:
      "A kanadai francia nyelv szabványos Windows-billentyűzete. Nincs rajta Œ - a szövegek a szokásos " +
      "helyettesítést használják. Az É közvetlenül a Shift billentyűvel írható; a ç és a Ç a cedille " +
      "holtbillentyűvel (utána c vagy Shift + C), az à, è és ù a tompa ékezet holtbillentyűjével, az Ê, Î, Ô és " +
      "Û a ^ billentyűvel. A francia idézőjelnek saját billentyűje van.",
  },
  es: {
    label: "Spanyol (Spanyolország, ISO)",
    kurz: "spanyol billentyűzet",
    hinweis:
      "A spanyol billentyűzeten az éles ékezet (á é í ó ú) holtbillentyű az ñ jobb oldalán; ugyanezen a " +
      "billentyűn a Shift billentyű a két pontot adja (ü). A ¡ közvetlenül írható, a ¿ a Shift billentyűvel - " +
      "PONT FORDÍTVA, mint a latin-amerikai billentyűzeten.",
  },
  latam: {
    label: "Spanyol (Latin-Amerika)",
    kurz: "latin-amerikai billentyűzet",
    hinweis:
      "A latin-amerikai billentyűzeten az éles ékezet (á é í ó ú) holtbillentyű a p jobb oldalán; ugyanezen a " +
      "billentyűn a Shift billentyű a két pontot adja (ü). A ¿ közvetlenül írható, a ¡ a Shift billentyűvel - " +
      "PONT FORDÍTVA, mint a spanyolországi spanyol billentyűzeten. Az euró jele ezen a kiosztáson nincs " +
      "ellenőrizve.",
  },
  it: {
    label: "Olasz (Olaszország, Windows Italiano / Mac Italiano - Pro)",
    kurz: "olasz billentyűzet",
    hinweis:
      "Az olasz billentyűzeten az à, è, ì, ò és ù betűnek saját billentyűje van; az é a Shift + è. A nagy À È É " +
      "Ì Ò Ù Windowson nem írható (csak Alt-kóddal), ezért ott az ezeket tartalmazó szövegek kimaradnak; Macen az " +
      "Option + Shift billentyűkkel írhatók.",
  },
  "it-qzerty": {
    label: "Olasz (Mac Italiano, QZERTY)",
    kurz: "olasz Mac billentyűzet (QZERTY)",
    hinweis:
      "Az Italiano Mac billentyűzet QZERTY: a z és a w helyet cserél, az m az l jobb oldalán van, és a számokhoz " +
      "a Shift billentyű kell (a számsoron ez látszik: & \" ' ( ç è ) £ à é). Az à, è, é, ì, ò és ù betűnek " +
      "saját billentyűje van.",
  },
  // NVDA-Falle (AltGr + N = Ctrl + Alt + N) wie im englischen Text.
  pl: {
    label: "Lengyel (programozói, QWERTY)",
    kurz: "lengyel programozói billentyűzet",
    hinweis:
      "A lengyel programozói billentyűzeten (Windows: Polski (programisty), Mac: Polski Pro) a lengyel betűk az " +
      "AltGr billentyűvel (Mac: Option) és az alapbetűvel írhatók: ą = a, ć = c, ę = e, ł = l, ń = n, ó = o, " +
      "ś = s, ź = x, ż = z. Nagybetűhöz a Shift billentyű is kell. Windowson, bekapcsolt NVDA mellett az AltGr + " +
      "N (ń) újraindítja az NVDA-t, mert a Ctrl + Alt + N az NVDA billentyűparancsa: ez a billentyűparancs az " +
      "NVDA-ban kikapcsolható, vagy a Shift + Caps Lock + AltGr + N használható.",
  },
  "tr-q": {
    label: "Török Q (Türkçe Q)",
    kurz: "török Q billentyűzet",
    hinweis:
      "A török Q billentyűzeten az ı, ğ, ş, ç, ö és ü betűnek saját billentyűje van, a p, az l és az m jobb " +
      "oldalán. Az ı és az i két külön billentyű: az i a ş jobb oldalán van, az ı ott, ahol a német billentyűzeten " +
      "az i. Az aposztróf a Shift + 2, az idézőjel az 1 bal oldalán van, a ₺ az AltGr + T (Mac: Option + T). " +
      "Az â, î és û a ^ holtbillentyűvel (Shift + 3), utána a magánhangzóval írható.",
  },
  "tr-f": {
    label: "Török F (Türkçe F)",
    kurz: "török F billentyűzet",
    hinweis:
      "A török F billentyűzeten az alapsor u i e a ü t k m l y ş (bal oldalon u i e a, jobb oldalon k m l y). A " +
      "kis kiemelkedéssel jelölt billentyűk az a (bal) és a k (jobb). Az ı, ğ, ş, ç, ö és ü betűnek saját " +
      "billentyűje van. Az aposztróf a Shift + 7, az idézőjel a Shift + 2, a ₺ az AltGr + T (Mac: Option + T). " +
      "Az â, î és û Windowson a ^ holtbillentyűvel írható (Shift + 3); Macen az Option + a, i vagy u billentyűkkel.",
  },
  cs: {
    label: "Cseh (QWERTZ)",
    kurz: "cseh billentyűzet",
    hinweis:
      "A cseh billentyűzeten a számsoron az ě š č ř ž ý á í é betű áll; a számok a Shift billentyűvel jönnek. " +
      "Ezeken a billentyűkön a Shift billentyű a számot adja, sosem a nagybetűt: a nagy Č Š Ř Ž Á É Í Ý Ě a " +
      "hacsek vagy a čárka (éles ékezet) holtbillentyűjével írható (az = billentyű jobb oldalán; a hacsek a Shift " +
      "+ ugyanez a billentyű), utána a Shift billentyű és a betű jön - vagy a Caps Lock billentyűvel. A ď ť ň a " +
      "hacsek + d, t vagy n, az ó a čárka + o. Az ú és az ů betűnek saját billentyűje van. A nagy Ů csak a Caps " +
      "Lock billentyűvel írható.",
  },
  "cs-qwerty": {
    label: "Cseh (QWERTY)",
    kurz: "cseh QWERTY billentyűzet",
    hinweis:
      "A cseh QWERTY billentyűzeten az y és a z ott van, ahol az angol billentyűzeten, egyébként ugyanolyan, mint " +
      "a cseh billentyűzet: a számsoron az ě š č ř ž ý á í é betű áll, a számok a Shift billentyűvel jönnek, és " +
      "ezeken a billentyűkön a Shift billentyű sosem adja a nagybetűt. A nagy Č Š Ř Ž Á É Í Ý Ě a hacsek vagy a " +
      "čárka (éles ékezet) holtbillentyűjével írható (az = billentyű jobb oldalán; a hacsek a Shift + ugyanez a " +
      "billentyű), utána a Shift billentyű és a betű jön - vagy a Caps Lock billentyűvel. A ď ť ň a hacsek + d, t " +
      "vagy n, az ó a čárka + o. A nagy Ů csak a Caps Lock billentyűvel írható.",
  },
  bg: {
    label: "Bolgár (BDS)",
    kurz: "bolgár billentyűzet",
    hinweis:
      "A bolgár BDS billentyűzeten az alapsor ь я а о ж г т н в м ч. A vessző azon a billentyűn van, ahol az angol " +
      "billentyűzeten a Q, a pont a számsor jobb szélén; a számokhoz nem kell a Shift billentyű. A ѝ a ю bal " +
      "oldalán van (a Shift billentyűvel: Ѝ), és a Shift + ь is ezt adja. A nagy Ь csak a Caps Lock billentyűvel " +
      "írható.",
  },
  "bg-schreibm": {
    label: "Bolgár (írógép)",
    kurz: "bolgár írógép-billentyűzet",
    hinweis:
      "A bolgár írógép-billentyűzeten a BDS billentyűzet betűi vannak (alapsor ь я а о ж г т н в м), a vessző a " +
      "Q billentyűn, a pont a számsor jobb szélén. Nincs rajta ѝ, euró jel és bolgár idézőjel: az ezeket " +
      "tartalmazó sorok nem jönnek.",
  },
  "bg-phon": {
    label: "Bolgár (fonetikus)",
    kurz: "bolgár fonetikus billentyűzet",
    hinweis:
      "A bolgár fonetikus billentyűzeten a betűk ott vannak, ahol a latin hangjuk: az а az A-n, a с az S-en, a " +
      "д a D-n, a ф az F-en és így tovább; a ч a Q-n, a ш a W-n, a я és a щ a п jobb oldalán. A vessző, a pont " +
      "és a többi írásjel ott van, ahol az angol billentyűzeten. A nagy Ь csak a Caps Lock billentyűvel írható.",
  },
  "bg-phon-trad": {
    label: "Bolgár (fonetikus, hagyományos)",
    kurz: "hagyományos bolgár fonetikus billentyűzet",
    hinweis:
      "A hagyományos bolgár fonetikus billentyűzet alapsora а с д ф г х й к л, mint az újabb fonetikusé, de a я " +
      "a Q-n, a в a W-n, a ч az 1 bal oldalán, a ь az X-en van (a Shift billentyűvel: ѝ). Nincs rajta gondolatjel " +
      "és bolgár idézőjel: az ezeket tartalmazó sorok nem jönnek. A nagy Ь csak a Caps Lock billentyűvel írható.",
  },
  el: {
    label: "Görög",
    kurz: "görög billentyűzet",
    hinweis:
      "A görög billentyűzeten a betűk ott vannak, ahol a latin hangjuk: az α az A-n, a β a B-n és így tovább. A " +
      "szóvégi szigma (ς) a W-n, a kérdőjel (;) a Q-n van. A tonos (΄) holtbillentyű a λ jobb oldalán: előbb a " +
      "tonos, aztán a magánhangzó (ά). A Shift billentyűvel ugyanez a billentyű a két pontot (¨) adja (ϊ). Ha a " +
      "nagybetűre tonos kell: előbb a tonos, aztán a Shift billentyű és a magánhangzó (Ά).",
  },
  "el-220": {
    label: "Görög (220)",
    kurz: "görög 220 billentyűzet",
    hinweis:
      "A görög 220 billentyűzeten a görög billentyűzet betűi vannak (α az A-n, ς a W-n), és a tonos (΄) " +
      "holtbillentyű a λ jobb oldalán. A két pontnak (¨) saját holtbillentyűje van, attól jobbra; az aposztróf a " +
      "0 jobb oldalán, a kötőjel jobbra lent, a kérdőjel (;) a Q-n van.",
  },
  "el-319": {
    label: "Görög (319)",
    kurz: "görög 319 billentyűzet",
    hinweis:
      "A görög 319 billentyűzeten a görög billentyűzet betűi vannak (α az A-n, ς a W-n), és a tonos (΄) " +
      "holtbillentyű a λ jobb oldalán. Az ano teleia (·) a Q-n van, a kérdőjel (;) a Shift + vessző, a nyomdai " +
      "aposztróf (’) a tonos billentyűtől jobbra. Nincs rajta @, #, &, kapcsos zárójel és csúcsos zárójel.",
  },
  // Glossar §2.9 und Zahlenreihen-Hinweis (Bauplan H7): die 0 links von der 1, ö ü ó dahinter.
  hu: {
    label: "Magyar (QWERTZ)",
    kurz: "magyar billentyűzet",
    hinweis:
      "A magyar billentyűzeten a 0 az 1 bal oldalán van; ahol a 0 általában van, ott az ö áll, utána az ü és az " +
      "ó. Az ő és az ú a p jobb oldalán, az é, á és ű az l jobb oldalán, az í az y bal oldalán van. Minden " +
      "ékezetes betűnek saját billentyűje van, a Shift billentyűvel a nagybetűje. A pontosvessző (;), a kukac " +
      "(@), az euró (€) és a zárójelek az AltGr billentyűvel jönnek.",
  },
  "hu-101": {
    label: "Magyar (101 billentyűs, QWERTY)",
    kurz: "magyar QWERTY billentyűzet",
    hinweis:
      "A 101 billentyűs magyar billentyűzeten az y és a z úgy áll, mint az angol billentyűzeten. Az í az 1 bal " +
      "oldalán van, a 0 az AltGr + ez a billentyű; ahol a 0 általában van, ott az ö áll. Az ő és az ú a p jobb " +
      "oldalán, az ű az Enter billentyű fölött, az é és az á az l jobb oldalán van.",
  },
  "nl-intl": {
    label: "Holland (amerikai nemzetközi)",
    kurz: "amerikai nemzetközi billentyűzet",
    hinweis:
      "Az amerikai nemzetközi billentyűzeten a ' és a \" (a ; jobb oldalán lévő billentyű) holtbillentyű: " +
      "magához a jelhez utána a szóköz billentyű kell. Az ë a \", aztán az e, az ï a \", aztán az i. Az é az " +
      "AltGr + E (vagy ', aztán e), az euró jel az AltGr + 5 billentyűkkel írható.",
  },
  "nl-dutch": {
    label: "Holland (holland kiosztás)",
    kurz: "holland billentyűzet",
    hinweis:
      "A holland billentyűzeten a ' a Shift + 0, a \" a Shift + 2, a kukac (@) pedig az 1 bal oldalán van. Az ë " +
      "és az ï a p jobb oldalán lévő ¨ holtbillentyűvel, az é a + jobb oldalán lévő ´ holtbillentyűvel írható: " +
      "előbb a holtbillentyű, aztán a betű.",
  },
  pt: {
    label: "Portugál (Portugália)",
    kurz: "portugál billentyűzet",
    hinweis:
      "A portugál billentyűzeten a ç-nek saját billentyűje van az l jobb oldalán. Az éles ékezet (´) " +
      "holtbillentyű a + jobb oldalán (a Shift billentyűvel a tompa ékezet, `), a hullámvonal (~) holtbillentyű " +
      "a º jobb oldalán (a Shift billentyűvel a kalap, ^): előbb a holtbillentyű, aztán a magánhangzó (á, ã, ê). " +
      "A francia idézőjeleknek saját billentyűjük van az aposztróf jobb oldalán.",
  },
  "br-abnt2": {
    label: "Portugál (Brazília, ABNT2)",
    kurz: "brazil billentyűzet",
    hinweis:
      "A brazil ABNT2 billentyűzeten a ç-nek saját billentyűje van az l jobb oldalán. Az éles ékezet (´) " +
      "holtbillentyű a p jobb oldalán (a Shift billentyűvel a tompa ékezet, `), a hullámvonal (~) holtbillentyű " +
      "a ç jobb oldalán (a Shift billentyűvel a kalap, ^). A Shift + 6 a két pont (¨) holtbillentyűje, nem jel. " +
      "Az aposztróf (') az 1 bal oldalán van (a Shift billentyűvel \"), a pontosvessző (;) jobbra lent. A / és a ? " +
      "a pontosvessző jobb oldalán lévő külön billentyűn van, vagy AltGr + Q és AltGr + W.",
  },
  ro: {
    label: "Román (szabványos)",
    kurz: "román billentyűzet",
    hinweis:
      "A szabványos román billentyűzeten az ă és az î a p jobb oldalán, az â az Enter billentyű fölött, a ș és a ț " +
      "az l jobb oldalán van - a ș és a ț alul vesszővel, ahogy helyes. A „ és a ” idézőjel az 1 bal oldalán van " +
      "(a ” a Shift billentyűvel). Az aposztróf az AltGr + ț, az euró jel az AltGr + E.",
  },
  "ro-prog": {
    label: "Román (programozói, QWERTY)",
    kurz: "román programozói billentyűzet",
    hinweis:
      "A román programozói billentyűzeten a román betűk az AltGr billentyűvel és az alapbetűvel írhatók: ă = a, " +
      "â = q, î = i, ș = s, ț = t; nagybetűhöz a Shift billentyű is kell. Egyébként ez az angol (USA) billentyűzet.",
  },
  sv: {
    label: "Svéd (Svédország, Finnország)",
    kurz: "svéd billentyűzet",
    hinweis:
      "A svéd billentyűzeten az å a p jobb oldalán, az ö és az ä az l jobb oldalán van - mindegyiknek saját " +
      "billentyűje van, a Shift billentyűvel a nagybetűje. Az é a ´ holtbillentyű (a + jobb oldalán), aztán az e. " +
      "A kukac (@) az AltGr + 2, az euró (€) az AltGr + E. A finn billentyűzet ugyanilyen.",
  },
  ua: {
    label: "Ukrán (bővített)",
    kurz: "ukrán billentyűzet",
    hinweis:
      "Az ukrán billentyűzeten az alapsor ф і в а п р о л д ж є. Az aposztróf (') az 1 bal oldalán van (a Shift " +
      "billentyűvel a hrivnya jele, ₴). A pont jobbra lent van, a vessző a Shift + ugyanez a billentyű. A ґ a я " +
      "bal oldalán van, vagy AltGr + г.",
  },
  "ua-std": {
    label: "Ukrán (szabványos)",
    kurz: "ukrán szabványos billentyűzet",
    hinweis:
      "Az ukrán szabványos billentyűzet az ukrán billentyűzet aposztróf nélkül: az 1 bal oldalán az orosz ё van. " +
      "Az aposztrófot tartalmazó szavak nem jönnek - a bővített ukrán billentyűzeten megvan.",
  },
};
