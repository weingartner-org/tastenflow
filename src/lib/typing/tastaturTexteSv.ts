/**
 * ★ O2-TASTATUR (29.10.2026): NAME, KURZNAME UND ERKLÄRUNG JEDER TASTATUR SCHWEDISCH.
 *
 * Bauart wie `tastaturTexteCs.ts`: `layouts.ts` bleibt unberührt, die Tabelle für die Bedienungssprache `sv` steht HIER,
 * und `layoutTexteIn` (`tastaturTexteIt.ts`) ist der eine Weg, den die Oberfläche geht. Eine Tabelle je `LayoutId`, damit
 * `tsc` für jede Tastatur einen Eintrag verlangt. Auch die Tastaturen der neun neuen Wege tragen eine EIGENE Übersetzung.
 *
 * Namen nach dem Glossar (`recherche-schwedisch-2026-10-25/GLOSSAR-sv.md` §2.9 `LAYOUT_TEXTE_SV`): „Svenskt (Sverige och
 * Finland)", „Tyskt (Tyskland och Österrike)", „Engelskt (USA)", „Engelskt (Storbritannien)"; die übrigen nach demselben
 * Muster (sächliches Adjektiv zu „tangentbord", dann Land in Klammern). Nie „finskt tangentbord" für die schwedische
 * Belegung (Glossar §2.9). Der Kurzname klein - er steht nach „Tangentbord:". Tastennamen wie in `tastenErklaerungSv.ts`
 * und ungebeugt (Regel 12): Skift, Caps Lock, Alt Gr, Retur, Mellanslag, Mac: Alternativ; die Totaste heisst „död tangent"
 * (§2.2), « » heissen „gåsögon" (Isof), die Tastnoppen „upphöjningarna" (§2.2). Reihen: „grundraden", „sifferraden". Die
 * Erklärungen sagen dasselbe wie die englischen (`layout.en.hinweis`), Satz für Satz an ihnen geprüft; sie sind
 * unpersönlich („skrivs", „får man"), weil Kind und Lehrkraft sie lesen. Das Zeichen « » selbst steht nie im Text.
 */
import type { LayoutId } from "./layouts";

type Texte = { label: string; kurz: string; hinweis?: string };

const ENGELSKT =
  "Engelska tangentbord har inte ä, ö, ü eller ß. Tyska texter använder därför de vanliga ersättningarna " +
  "(ä → ae, ß → ss) - för engelska passar det här tangentbordet utmärkt.";

const TJECKISKA_VERSALER =
  "Stora Č Š Ř Ž Á É Í Ý Ě får man med den döda tangenten háček eller čárka (till höger om tangenten =; háček " +
  "är Skift + samma tangent), sedan Skift och bokstaven - eller med Caps Lock. ď ť ň är háček + d, t eller n, " +
  "ó är čárka + o.";

export const LAYOUT_TEXTE_SV: Record<LayoutId, Texte> = {
  de: { label: "Tyskt (Tyskland och Österrike)", kurz: "tyskt tangentbord" },
  ch: {
    label: "Schweiziskt (tyskt)",
    kurz: "schweiziskt tangentbord",
    hinweis:
      "Det schweiziska tangentbordet har ingen ß-tangent, så tyska ord med ß skrivs här med ss - som i Schweiz. " +
      "Stora Ä, Ö och Ü får man med den döda tangenten ¨ (till höger om ü), sedan Skift och bokstaven (Skift på " +
      "ä, ö och ü ger à, é och è). Caps Lock fungerar också.",
  },
  us: { label: "Engelskt (USA)", kurz: "amerikanskt tangentbord", hinweis: ENGELSKT },
  uk: { label: "Engelskt (Storbritannien)", kurz: "brittiskt tangentbord", hinweis: ENGELSKT },
  fr: {
    label: "Franskt (Frankrike, AZERTY)",
    kurz: "franskt tangentbord",
    hinweis:
      "Det franska AZERTY-tangentbordet (Windows) har inte É, Ç, Œ eller gåsögon - texter med É eller Ç tas " +
      "inte med, för Œ och gåsögon används de vanliga ersättningarna (Œ → Oe, gåsögon → raka citattecken). À, È " +
      "och Ù får man med den döda tangenten för grav accent (Alt Gr + 7), Ê, Î, Ô och Û med ^ - varje gång " +
      "följt av Skift och bokstaven.",
  },
  be: {
    label: "Franskt (Belgien, AZERTY)",
    kurz: "belgiskt tangentbord",
    hinweis:
      "Det belgiska AZERTY-tangentbordet (Windows) har inte stort Ç, inte Œ och inte gåsögon - texter med Ç tas " +
      "inte med, för Œ och gåsögon används de vanliga ersättningarna. É får man med den döda tangenten för akut " +
      "accent (Alt Gr + ù), À, È och Ù med den döda tangenten för grav accent (Alt Gr + µ), Ê, Î, Ô och Û med ^ " +
      "- varje gång följt av Skift och bokstaven.",
  },
  "ch-fr": {
    label: "Schweiziskt (franskt; Schweiz och Luxemburg)",
    kurz: "schweiziskt franskt tangentbord",
    hinweis:
      "Det schweiziska franska tangentbordet har inte stort Ç, inte Œ och inte gåsögon - texter med Ç tas inte " +
      "med, för Œ och gåsögon används de vanliga ersättningarna. É får man med den döda tangenten för akut accent " +
      "(Alt Gr + '), À, È och Ù med den döda tangenten för grav accent (Skift + ^) - varje gång följt av Skift " +
      "och bokstaven. Skift på é, à och è ger ö, ä och ü. På Mac fungerar Caps Lock också för É, À och È.",
  },
  "ca-csa": {
    label: "Kanadensiskt franskt (Canadien multilingue standard)",
    kurz: "kanadensiskt tangentbord (CSA)",
    hinweis:
      "Det kanadensiska tangentbordet (CSA) har inte Œ - texterna använder den vanliga ersättningen (Œ → Oe). É, " +
      "À, È, Ç och Ù skrivs direkt med Skift, Ê, Î, Ô och Û med ^ (sedan Skift och bokstaven), gåsögon med " +
      "Alt Gr + Z och Alt Gr + X, € med Alt Gr + E.",
  },
  "ca-fr": {
    label: "Kanadensiskt franskt (Français (Canada), standard i Windows)",
    kurz: "kanadensiskt franskt tangentbord",
    hinweis:
      "Standardtangentbordet i Windows för franska i Kanada. Det har inte Œ - texterna använder den vanliga " +
      "ersättningen. É skrivs direkt med Skift; ç och Ç får man med den döda tangenten för cedilj (sedan c eller " +
      "Skift + C), à, è och ù med den döda tangenten för grav accent, Ê, Î, Ô och Û med ^. Gåsögon har en egen " +
      "tangent.",
  },
  es: {
    label: "Spanskt (Spanien, ISO)",
    kurz: "spanskt tangentbord",
    hinweis:
      "På det spanska tangentbordet är akut accent (á é í ó ú) en död tangent till höger om ñ; Skift på samma " +
      "tangent ger trema (ü). ¡ skrivs direkt, ¿ kräver Skift - PRECIS TVÄRTOM mot det latinamerikanska " +
      "tangentbordet.",
  },
  latam: {
    label: "Spanskt (Latinamerika)",
    kurz: "latinamerikanskt tangentbord",
    hinweis:
      "På det latinamerikanska tangentbordet är akut accent (á é í ó ú) en död tangent till höger om p; Skift på " +
      "samma tangent ger trema (ü). ¿ skrivs direkt, ¡ kräver Skift - PRECIS TVÄRTOM mot det spanska " +
      "tangentbordet (Spanien). Eurotecknet är inte bekräftat på det här tangentbordet.",
  },
  it: {
    label: "Italienskt (Italien, Windows Italiano / Mac Italiano - Pro)",
    kurz: "italienskt tangentbord",
    hinweis:
      "På det italienska tangentbordet har à, è, ì, ò och ù egna tangenter; é är Skift + è. Stora À È É Ì Ò Ù " +
      "finns inte i Windows (bara via en Alt-kod), därför tas texter med dem inte med där; på Mac får man dem " +
      "med Alternativ + Skift.",
  },
  "it-qzerty": {
    label: "Italienskt (Mac Italiano, QZERTY)",
    kurz: "italienskt Mac-tangentbord (QZERTY)",
    hinweis:
      "Mac-tangentbordet Italiano är QZERTY: z och w har bytt plats, m sitter till höger om l, och siffrorna " +
      "kräver Skift (sifferraden visar & \" ' ( ç è ) £ à é). à, è, é, ì, ò och ù har egna tangenter.",
  },
  // NVDA-Falle (Alt Gr + N = Ctrl + Alt + N) wie im englischen Text.
  pl: {
    label: "Polskt (programmerare, QWERTY)",
    kurz: "polskt programmerartangentbord",
    hinweis:
      "På det polska programmerartangentbordet (Windows: Polski (programisty), Mac: Polski Pro) skriver man de " +
      "polska bokstäverna med Alt Gr (Mac: Alternativ) och grundbokstaven: ą = a, ć = c, ę = e, ł = l, ń = n, " +
      "ó = o, ś = s, ź = x, ż = z. För stor bokstav lägger man till Skift. Med NVDA i Windows startar Alt Gr + N " +
      "(ń) om NVDA, eftersom Ctrl + Alt + N är dess kortkommando: det kortkommandot kan stängas av i NVDA, annars " +
      "fungerar Skift + Caps Lock + Alt Gr + N.",
  },
  "tr-q": {
    label: "Turkiskt Q (Türkçe Q)",
    kurz: "turkiskt Q-tangentbord",
    hinweis:
      "På det turkiska Q-tangentbordet har ı, ğ, ş, ç, ö och ü egna tangenter, till höger om p, l och m. ı och " +
      "i är två tangenter: i sitter till höger om ş, ı där det tyska tangentbordet har i. Apostrofen är " +
      "Skift + 2, citattecknet sitter till vänster om 1, ₺ är Alt Gr + T (Mac: Alternativ + T). â, î och û får " +
      "man med den döda tangenten ^ (Skift + 3), sedan vokalen.",
  },
  "tr-f": {
    label: "Turkiskt F (Türkçe F)",
    kurz: "turkiskt F-tangentbord",
    hinweis:
      "På det turkiska F-tangentbordet är grundraden u i e a ü t k m l y ş (till vänster u i e a, till höger k " +
      "m l y). Tangenterna med upphöjningarna är a (vänster) och k (höger). ı, ğ, ş, ç, ö och ü har egna " +
      "tangenter. Apostrofen är Skift + 7, citattecknet Skift + 2, ₺ är Alt Gr + T (Mac: Alternativ + T). â, î " +
      "och û får man i Windows med den döda tangenten ^ (Skift + 3); på Mac är de Alternativ + a, i eller u.",
  },
  cs: {
    label: "Tjeckiskt (QWERTZ)",
    kurz: "tjeckiskt tangentbord",
    hinweis:
      "På det tjeckiska tangentbordet står ě š č ř ž ý á í é på sifferraden; siffrorna får man med Skift. Skift " +
      "på de tangenterna ger siffran, aldrig den stora bokstaven. " + TJECKISKA_VERSALER + " ú och ů har egna " +
      "tangenter. Stort Ů går bara med Caps Lock.",
  },
  "cs-qwerty": {
    label: "Tjeckiskt (QWERTY)",
    kurz: "tjeckiskt QWERTY-tangentbord",
    hinweis:
      "Det tjeckiska QWERTY-tangentbordet har y och z där det engelska tangentbordet har dem, annars är det det " +
      "tjeckiska tangentbordet: ě š č ř ž ý á í é står på sifferraden, siffrorna får man med Skift, och Skift på " +
      "de tangenterna ger aldrig den stora bokstaven. " + TJECKISKA_VERSALER + " Stort Ů går bara med Caps Lock.",
  },
  bg: {
    label: "Bulgariskt (BDS)",
    kurz: "bulgariskt tangentbord",
    hinweis:
      "På det bulgariska BDS-tangentbordet är grundraden ь я а о ж г т н в м ч. Kommat sitter på tangenten där " +
      "det engelska tangentbordet har Q, punkten längst till höger på sifferraden; siffrorna kräver inte Skift. " +
      "ѝ sitter till vänster om ю (med Skift: Ѝ) och är också Skift + ь. Stort Ь går bara med Caps Lock.",
  },
  "bg-schreibm": {
    label: "Bulgariskt (skrivmaskin)",
    kurz: "bulgariskt skrivmaskinstangentbord",
    hinweis:
      "Det bulgariska skrivmaskinstangentbordet har bokstäverna från BDS-tangentbordet (grundraden ь я а о ж г т " +
      "н в м), kommat på Q-tangenten och punkten längst till höger på sifferraden. Det har inte ѝ, inget " +
      "eurotecken och inga bulgariska citattecken: rader med dem erbjuds inte.",
  },
  "bg-phon": {
    label: "Bulgariskt (fonetiskt)",
    kurz: "bulgariskt fonetiskt tangentbord",
    hinweis:
      "På det bulgariska fonetiska tangentbordet sitter bokstäverna där deras latinska ljud finns: а på A, с på " +
      "S, д på D, ф på F och så vidare; ч sitter på Q, ш på W, я och щ till höger om п. Komma, punkt och de " +
      "andra skiljetecknen sitter där de sitter på det engelska tangentbordet. Stort Ь går bara med Caps Lock.",
  },
  "bg-phon-trad": {
    label: "Bulgariskt (fonetiskt, traditionellt)",
    kurz: "traditionellt bulgariskt fonetiskt tangentbord",
    hinweis:
      "Det traditionella bulgariska fonetiska tangentbordet har grundraden а с д ф г х й к л som det nyare " +
      "fonetiska, men я sitter på Q, в på W, ч till vänster om 1 och ь på X (med Skift: ѝ). Det har inget " +
      "tankstreck och inga bulgariska citattecken: rader med dem erbjuds inte. Stort Ь går bara med Caps Lock.",
  },
  el: {
    label: "Grekiskt",
    kurz: "grekiskt tangentbord",
    hinweis:
      "På det grekiska tangentbordet sitter bokstäverna där deras latinska ljud finns: α på A, β på B och så " +
      "vidare. Slut-sigma ς sitter på W, frågetecknet ; på Q. Tonos ΄ är en död tangent till höger om λ: först " +
      "tonos, sedan vokalen (ά). Med Skift ger samma tangent dialytika ¨ (ϊ). För stor bokstav med tonos: tonos, " +
      "sedan Skift och vokalen (Ά).",
  },
  "el-220": {
    label: "Grekiskt (220)",
    kurz: "grekiskt 220-tangentbord",
    hinweis:
      "Det grekiska 220-tangentbordet har bokstäverna från det grekiska tangentbordet (α på A, ς på W) och den " +
      "döda tangenten tonos ΄ till höger om λ. Dialytika ¨ har en egen död tangent till höger om den; apostrofen " +
      "sitter till höger om 0, bindestrecket längst ned till höger, frågetecknet ; på Q.",
  },
  "el-319": {
    label: "Grekiskt (319)",
    kurz: "grekiskt 319-tangentbord",
    hinweis:
      "Det grekiska 319-tangentbordet har bokstäverna från det grekiska tangentbordet (α på A, ς på W) och den " +
      "döda tangenten tonos ΄ till höger om λ. Ano teleia · sitter på Q, frågetecknet ; är Skift + komma, den " +
      "typografiska apostrofen ’ sitter till höger om tonos-tangenten. Det har inte @, #, &, klammerparenteser " +
      "eller vinkelparenteser.",
  },
  hu: {
    label: "Ungerskt (QWERTZ)",
    kurz: "ungerskt tangentbord",
    hinweis:
      "På det ungerska tangentbordet sitter 0 till vänster om 1; där 0 brukar sitta finns ö, sedan ü och ó. ő " +
      "och ú sitter till höger om p, é á ű till höger om l, í till vänster om y. Varje bokstav med accent har en " +
      "egen tangent, med Skift sin stora bokstav. ; @ € och hakparenteserna får man med Alt Gr.",
  },
  "hu-101": {
    label: "Ungerskt (QWERTY, 101 tangenter)",
    kurz: "ungerskt QWERTY-tangentbord",
    hinweis:
      "Det ungerska 101-tangentbordet har y och z som det engelska tangentbordet. í sitter till vänster om 1, 0 " +
      "är Alt Gr + den tangenten; där 0 brukar sitta finns ö. ő och ú sitter till höger om p, ű ovanför Retur, " +
      "é och á till höger om l.",
  },
  "nl-intl": {
    label: "Nederländskt (USA, internationellt)",
    kurz: "amerikanskt internationellt tangentbord",
    hinweis:
      "På det amerikanska internationella tangentbordet är ' och \" (tangenten till höger om ;) döda tangenter: " +
      "för själva tecknet trycker man på Mellanslag efteråt. ë är \" och sedan e, ï är \" och sedan i. é är " +
      "Alt Gr + E (eller ' och sedan e), eurotecknet Alt Gr + 5.",
  },
  "nl-dutch": {
    label: "Nederländskt (Nederländerna)",
    kurz: "nederländskt tangentbord",
    hinweis:
      "På det nederländska tangentbordet sitter @ till vänster om 1, ' är Skift + 0 och \" är Skift + 2. ë och " +
      "ï får man med den döda tangenten ¨ till höger om p, é med den döda tangenten ´ till höger om +: först den " +
      "döda tangenten, sedan bokstaven.",
  },
  pt: {
    label: "Portugisiskt (Portugal)",
    kurz: "portugisiskt tangentbord",
    hinweis:
      "På det portugisiska tangentbordet har ç en egen tangent till höger om l. Akut accent ´ är en död tangent " +
      "till höger om + (med Skift grav accent `), tilde ~ en död tangent till höger om º (med Skift cirkumflex " +
      "^): först den döda tangenten, sedan vokalen (á, ã, ê). Gåsögon har en egen tangent till höger om " +
      "apostrofen.",
  },
  "br-abnt2": {
    label: "Portugisiskt (Brasilien, ABNT2)",
    kurz: "brasilianskt tangentbord",
    hinweis:
      "På det brasilianska ABNT2-tangentbordet har ç en egen tangent till höger om l. Akut accent ´ är en död " +
      "tangent till höger om p (med Skift grav accent `), tilde ~ en död tangent till höger om ç (med Skift " +
      "cirkumflex ^). Skift + 6 är den döda tangenten ¨, inget tecken. ' sitter till vänster om 1 (med Skift \"), " +
      "; längst ned till höger. / och ? sitter på extratangenten till höger om ; eller på Alt Gr + Q och " +
      "Alt Gr + W.",
  },
  ro: {
    label: "Rumänskt (standard)",
    kurz: "rumänskt tangentbord",
    hinweis:
      "På det rumänska standardtangentbordet sitter ă och î till höger om p, â ovanför Retur, ș och ț till höger " +
      "om l - ș och ț med komma under, som det ska vara. Citattecknen „ och ” sitter till vänster om 1 (” med " +
      "Skift). Apostrofen är Alt Gr + ț, eurotecknet Alt Gr + E.",
  },
  "ro-prog": {
    label: "Rumänskt (programmerare, QWERTY)",
    kurz: "rumänskt programmerartangentbord",
    hinweis:
      "På det rumänska programmerartangentbordet skriver man de rumänska bokstäverna med Alt Gr och " +
      "grundbokstaven: ă = a, â = q, î = i, ș = s, ț = t; för stor bokstav lägger man till Skift. Annars är det " +
      "det engelska tangentbordet (USA).",
  },
  // Glossar §2.9: der Hinweis nennt die Merkmale (å rechts von p); nie „finskt tangentbord" für diese Belegung.
  sv: {
    label: "Svenskt (Sverige och Finland)",
    kurz: "svenskt tangentbord",
    hinweis:
      "På det svenska tangentbordet sitter å till höger om p, ö och ä till höger om l - var och en har en egen " +
      "tangent, med Skift sin stora bokstav. é får man med den döda tangenten ´ (till höger om +), sedan e. @ är " +
      "Alt Gr + 2, € Alt Gr + E. Tangentbordet i Finland är likadant.",
  },
  ua: {
    label: "Ukrainskt (utökat)",
    kurz: "ukrainskt tangentbord",
    hinweis:
      "På det ukrainska tangentbordet är grundraden ф і в а п р о л д ж є. Apostrofen ' sitter till vänster om 1 " +
      "(med Skift hryvnjatecknet ₴). Punkten sitter längst ned till höger, kommat är Skift + samma tangent. ґ " +
      "sitter till vänster om я, eller Alt Gr + г.",
  },
  "ua-std": {
    label: "Ukrainskt (standard)",
    kurz: "ukrainskt standardtangentbord",
    hinweis:
      "Det ukrainska standardtangentbordet är det ukrainska tangentbordet utan apostrof: till vänster om 1 sitter " +
      "det ryska ё. Ord med apostrof erbjuds inte - det utökade ukrainska tangentbordet har den.",
  },
};
