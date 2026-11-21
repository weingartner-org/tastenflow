/**
 * ★ O2 (29.10.2026): NAME, KURZNAME UND ERKLÄRUNG JEDER TASTATUR NIEDERLÄNDISCH.
 *
 * Bauart wie `tastaturTexteCs.ts`: `layouts.ts` bleibt unberührt, die niederländische Tabelle steht HIER, und
 * `layoutTexteIn` (`tastaturTexteIt.ts`) ist der eine Weg, den die Oberfläche geht. Eine Tabelle je `LayoutId`,
 * damit `tsc` für jede Tastatur einen Eintrag verlangt - anders als bei cs auch für die Tastaturen der neun neuen
 * Sprachen (bg, el, hu, nl, pt, br, ro, sv, uk): jede trägt eine echte Übersetzung, keinen englischen Rückfall.
 *
 * Namen nach dem Glossar (`recherche-niederländisch-2026-10-25/GLOSSAR-nl.md` §2.9 `LAYOUT_TEXTE_NL`): „Verenigde
 * Staten (internationaal)", „Belgisch (punt)", „Nederlands", „Verenigde Staten", „Duits (Duitsland en Oostenrijk)",
 * „Engels (Verenigd Koninkrijk)" - so heissen sie auch in `TippenHilfe.nl.tsx`; die übrigen nach dem Muster „Sprache
 * (Land oder Bauart)". Der Kurzname steht nach „Toetsenbord:"; Landesadjektive schreibt das Niederländische gross
 * („Duits toetsenbord"), sonst klein. Tastennamen wie auf der Kappe und wie in `tastenErklaerungNl.ts`: Shift, Caps
 * Lock, **Alt Gr** (mit Leerzeichen, Glossar §2.9), Enter, spatiebalk, Mac: Option. Totaste = „dode toets", Akzente
 * nach `NAMEN_NL`/Glossar §2.8: accent aigu, accent grave, trema, dakje, cedille, tilde. Reihen: „basisrij",
 * „cijferrij"; Noppen = „voelstreepjes"; Übungszeilen = „regels". Die Erklärungen sagen dasselbe wie die englischen
 * (`layout.en.hinweis`), Satz für Satz an ihnen geprüft; sie sind unpersönlich („komt", „wordt getypt"), weil Kind und
 * Lehrkraft sie lesen. Keine französischen Anführungszeichen im Text - „Franse aanhalingstekens". Kein Satz endet mit
 * einer Ziffer und Punkt (die Stimme läse eine Ordnungszahl).
 */
import type { LayoutId } from "./layouts";

type Texte = { label: string; kurz: string; hinweis?: string };

const ENGELS =
  "Engelse toetsenborden hebben geen ä, ö, ü of ß. Duitse teksten gebruiken daarom de gewone vervanging " +
  "(ä → ae, ß → ss) - voor Engels is dit toetsenbord precies goed.";

export const LAYOUT_TEXTE_NL: Record<LayoutId, Texte> = {
  de: { label: "Duits (Duitsland en Oostenrijk)", kurz: "Duits toetsenbord" },
  ch: {
    label: "Zwitsers (Duits)",
    kurz: "Zwitsers toetsenbord",
    hinweis:
      "Het Zwitserse toetsenbord heeft geen ß-toets, daarom worden Duitse woorden met ß hier met ss geschreven - " +
      "zoals in Zwitserland. De hoofdletters Ä, Ö en Ü komen van de dode toets ¨ (rechts van ü), daarna Shift en " +
      "de letter (Shift op ä, ö en ü geeft à, é en è). Caps Lock werkt ook.",
  },
  us: { label: "Verenigde Staten", kurz: "Amerikaans toetsenbord", hinweis: ENGELS },
  uk: { label: "Engels (Verenigd Koninkrijk)", kurz: "Brits toetsenbord", hinweis: ENGELS },
  fr: {
    label: "Frans (Frankrijk, AZERTY)",
    kurz: "Frans toetsenbord",
    hinweis:
      "Het Franse AZERTY-toetsenbord (Windows) heeft geen É, Ç, Œ en geen Franse aanhalingstekens - teksten met É " +
      "of Ç vallen weg, voor Œ en Franse aanhalingstekens staat de gewone vervanging (Œ → Oe, Franse " +
      "aanhalingstekens → rechte aanhalingstekens). À, È en Ù komen van de dode toets voor het accent grave (Alt " +
      "Gr + 7), Ê, Î, Ô en Û van ^ - telkens gevolgd door Shift en de letter.",
  },
  be: {
    label: "Belgisch (punt)",
    kurz: "Belgisch toetsenbord",
    hinweis:
      "Het Belgische AZERTY-toetsenbord (Windows) heeft geen hoofdletter Ç, geen Œ en geen Franse " +
      "aanhalingstekens - teksten met Ç vallen weg, voor Œ en Franse aanhalingstekens staat de gewone vervanging. " +
      "É komt van de dode toets voor het accent aigu (Alt Gr + ù), À, È en Ù van de dode toets voor het accent " +
      "grave (Alt Gr + µ), Ê, Î, Ô en Û van ^ - telkens gevolgd door Shift en de letter.",
  },
  "ch-fr": {
    label: "Zwitsers-Frans (Zwitserland en Luxemburg)",
    kurz: "Zwitsers-Frans toetsenbord",
    hinweis:
      "Het Zwitsers-Franse toetsenbord heeft geen hoofdletter Ç, geen Œ en geen Franse aanhalingstekens - teksten " +
      "met Ç vallen weg, voor Œ en Franse aanhalingstekens staat de gewone vervanging. É komt van de dode toets " +
      "voor het accent aigu (Alt Gr + '), À, È en Ù van de dode toets voor het accent grave (Shift + ^) - telkens " +
      "gevolgd door Shift en de letter. Shift op é, à en è geeft ö, ä en ü. Op een Mac werkt voor É, À en È ook " +
      "Caps Lock.",
  },
  "ca-csa": {
    label: "Canadees-Frans (Canadese meertalige standaard)",
    kurz: "Canadees toetsenbord (CSA)",
    hinweis:
      "Het Canadese toetsenbord (CSA) heeft geen Œ - teksten gebruiken de gewone vervanging (Œ → Oe). É, À, È, Ç " +
      "en Ù komen direct met Shift, Ê, Î, Ô en Û via ^ (daarna Shift en de letter), de Franse aanhalingstekens met " +
      "Alt Gr + Z en Alt Gr + X, het euroteken (€) met Alt Gr + E.",
  },
  "ca-fr": {
    label: "Canadees-Frans (Français (Canada), Windows-standaard)",
    kurz: "Canadees-Frans toetsenbord",
    hinweis:
      "Het standaardtoetsenbord van Windows voor Frans in Canada. Het heeft geen Œ - teksten gebruiken de gewone " +
      "vervanging. É komt direct met Shift; ç en Ç komen van de dode toets voor de cedille (daarna c of Shift + " +
      "C), à, è en ù van de dode toets voor het accent grave, Ê, Î, Ô en Û van ^. De Franse aanhalingstekens " +
      "hebben een eigen toets.",
  },
  es: {
    label: "Spaans (Spanje, ISO)",
    kurz: "Spaans toetsenbord",
    hinweis:
      "Op het Spaanse toetsenbord is het accent aigu (á é í ó ú) een dode toets rechts van ñ; Shift op dezelfde " +
      "toets geeft het trema (ü). ¡ komt direct, ¿ met Shift - PRECIES OMGEKEERD als op het Latijns-Amerikaanse " +
      "toetsenbord.",
  },
  latam: {
    label: "Spaans (Latijns-Amerika)",
    kurz: "Latijns-Amerikaans toetsenbord",
    hinweis:
      "Op het Latijns-Amerikaanse toetsenbord is het accent aigu (á é í ó ú) een dode toets rechts van p; Shift " +
      "op dezelfde toets geeft het trema (ü). ¿ komt direct, ¡ met Shift - PRECIES OMGEKEERD als op het Spaanse " +
      "toetsenbord uit Spanje. Het euroteken is op deze indeling niet bevestigd.",
  },
  it: {
    label: "Italiaans (Italië, Windows Italiano / Mac Italiano - Pro)",
    kurz: "Italiaans toetsenbord",
    hinweis:
      "Op het Italiaanse toetsenbord hebben à, è, ì, ò en ù een eigen toets; é is Shift + è. De hoofdletters À È " +
      "É Ì Ò Ù bestaan op Windows niet (alleen via een Alt-code), daarom vallen teksten met die letters daar weg; " +
      "op een Mac komen ze met Option + Shift.",
  },
  "it-qzerty": {
    label: "Italiaans (Mac Italiano, QZERTY)",
    kurz: "Italiaans Mac-toetsenbord (QZERTY)",
    hinweis:
      "Het Mac-toetsenbord Italiano is QZERTY: z en w zijn verwisseld, m staat rechts van l, en voor de cijfers is " +
      "Shift nodig (op de cijferrij staat & \" ' ( ç è ) £ à é). à, è, é, ì, ò en ù hebben een eigen toets.",
  },
  // NVDA-Falle (Alt Gr + N = Ctrl + Alt + N) wie im englischen Text.
  pl: {
    label: "Pools (programmeurs, QWERTY)",
    kurz: "Pools programmeurstoetsenbord",
    hinweis:
      "Op het Poolse programmeurstoetsenbord (Windows: Polski (programisty), Mac: Polski Pro) worden de Poolse " +
      "letters getypt met Alt Gr (Mac: Option) en de basisletter: ą = a, ć = c, ę = e, ł = l, ń = n, ó = o, " +
      "ś = s, ź = x, ż = z. Voor een hoofdletter komt Shift erbij. Met NVDA op Windows start Alt Gr + N (ń) NVDA " +
      "opnieuw, omdat Ctrl + Alt + N de sneltoets van NVDA is: die sneltoets kan in NVDA uit, of anders werkt " +
      "Shift + Caps Lock + Alt Gr + N.",
  },
  "tr-q": {
    label: "Turks Q (Türkçe Q)",
    kurz: "Turks Q-toetsenbord",
    hinweis:
      "Op het Turkse Q-toetsenbord hebben ı, ğ, ş, ç, ö en ü een eigen toets, rechts van p, l en m. ı en i zijn " +
      "twee toetsen: i staat rechts van ş, ı waar het Duitse toetsenbord de i heeft. De apostrof is Shift + 2, " +
      "het aanhalingsteken staat links van de 1, ₺ is Alt Gr + T (Mac: Option + T). â, î en û komen van de dode " +
      "toets ^ (Shift + 3), daarna de klinker.",
  },
  "tr-f": {
    label: "Turks F (Türkçe F)",
    kurz: "Turks F-toetsenbord",
    hinweis:
      "Op het Turkse F-toetsenbord is de basisrij u i e a ü t k m l y ş (links u i e a, rechts k m l y). De " +
      "toetsen met de voelstreepjes zijn a (links) en k (rechts). ı, ğ, ş, ç, ö en ü hebben een eigen toets. De " +
      "apostrof is Shift + 7, het aanhalingsteken Shift + 2, ₺ is Alt Gr + T (Mac: Option + T). â, î en û komen " +
      "op Windows van de dode toets ^ (Shift + 3); op een Mac zijn het Option + a, i of u.",
  },
  cs: {
    label: "Tsjechisch (QWERTZ)",
    kurz: "Tsjechisch toetsenbord",
    hinweis:
      "Op het Tsjechische toetsenbord staan ě š č ř ž ý á í é op de cijferrij; de cijfers komen met Shift. Shift " +
      "op die toetsen geeft het cijfer, nooit de hoofdletter: de hoofdletters Č Š Ř Ž Á É Í Ý Ě komen van de dode " +
      "toets háček of čárka (rechts van de toets =; háček is Shift + dezelfde toets), daarna Shift en de letter - " +
      "of met Caps Lock. ď ť ň zijn háček + d, t of n, ó is čárka + o. ú en ů hebben een eigen toets. De " +
      "hoofdletter Ů werkt alleen met Caps Lock.",
  },
  "cs-qwerty": {
    label: "Tsjechisch (QWERTY)",
    kurz: "Tsjechisch QWERTY-toetsenbord",
    hinweis:
      "Het Tsjechische QWERTY-toetsenbord heeft y en z waar het Engelse toetsenbord ze heeft, verder is het het " +
      "Tsjechische toetsenbord: ě š č ř ž ý á í é staan op de cijferrij, de cijfers komen met Shift, en Shift op " +
      "die toetsen geeft nooit de hoofdletter. De hoofdletters Č Š Ř Ž Á É Í Ý Ě komen van de dode toets háček of " +
      "čárka (rechts van de toets =; háček is Shift + dezelfde toets), daarna Shift en de letter - of met Caps " +
      "Lock. ď ť ň zijn háček + d, t of n, ó is čárka + o. De hoofdletter Ů werkt alleen met Caps Lock.",
  },
  bg: {
    label: "Bulgaars (BDS)",
    kurz: "Bulgaars toetsenbord",
    hinweis:
      "Op het Bulgaarse BDS-toetsenbord is de basisrij ь я а о ж г т н в м ч. De komma staat op de toets waar een " +
      "Engels toetsenbord de Q heeft, de punt helemaal rechts op de cijferrij; voor de cijfers is geen Shift " +
      "nodig. ѝ staat links van ю (met Shift: Ѝ) en is ook Shift + ь. De hoofdletter Ь komt alleen met Caps Lock.",
  },
  "bg-schreibm": {
    label: "Bulgaars (typemachine)",
    kurz: "Bulgaars typemachinetoetsenbord",
    hinweis:
      "Het Bulgaarse typemachinetoetsenbord heeft de letters van het BDS-toetsenbord (basisrij ь я а о ж г т н в " +
      "м), de komma op de Q-toets en de punt helemaal rechts op de cijferrij. Het heeft geen ѝ, geen euroteken en " +
      "geen Bulgaarse aanhalingstekens: regels met die tekens komen niet aan de beurt.",
  },
  "bg-phon": {
    label: "Bulgaars (fonetisch)",
    kurz: "Bulgaars fonetisch toetsenbord",
    hinweis:
      "Op het Bulgaarse fonetische toetsenbord staan de letters waar hun Latijnse klank staat: а op A, с op S, д " +
      "op D, ф op F enzovoort; ч staat op Q, ш op W, я en щ rechts van п. Komma, punt en de andere leestekens " +
      "staan waar ze op het Engelse toetsenbord staan. De hoofdletter Ь komt alleen met Caps Lock.",
  },
  "bg-phon-trad": {
    label: "Bulgaars (fonetisch, traditioneel)",
    kurz: "traditioneel Bulgaars fonetisch toetsenbord",
    hinweis:
      "Het traditionele Bulgaarse fonetische toetsenbord heeft de basisrij а с д ф г х й к л zoals het nieuwere " +
      "fonetische, maar я staat op Q, в op W, ч links van 1 en ь op X (met Shift: ѝ). Het heeft geen " +
      "gedachtestreepje en geen Bulgaarse aanhalingstekens: regels met die tekens komen niet aan de beurt. De " +
      "hoofdletter Ь komt alleen met Caps Lock.",
  },
  el: {
    label: "Grieks",
    kurz: "Grieks toetsenbord",
    hinweis:
      "Op het Griekse toetsenbord staan de letters waar hun Latijnse klank staat: α op A, β op B enzovoort. De " +
      "slot-sigma ς staat op W, het vraagteken ; op Q. De tonos ΄ is een dode toets rechts van λ: eerst de tonos, " +
      "dan de klinker (ά). Met Shift geeft dezelfde toets het trema ¨ (ϊ). Voor een hoofdletter met tonos: tonos, " +
      "dan Shift en de klinker (Ά).",
  },
  "el-220": {
    label: "Grieks (220)",
    kurz: "Grieks 220-toetsenbord",
    hinweis:
      "Het Griekse 220-toetsenbord heeft de letters van het Griekse toetsenbord (α op A, ς op W) en de dode toets " +
      "tonos ΄ rechts van λ. Het trema ¨ heeft een eigen dode toets rechts daarvan; de apostrof staat rechts van " +
      "0, het koppelteken rechtsonder, het vraagteken ; op Q.",
  },
  "el-319": {
    label: "Grieks (319)",
    kurz: "Grieks 319-toetsenbord",
    hinweis:
      "Het Griekse 319-toetsenbord heeft de letters van het Griekse toetsenbord (α op A, ς op W) en de dode toets " +
      "tonos ΄ rechts van λ. De ano teleia · staat op Q, het vraagteken ; is Shift + komma, de typografische " +
      "apostrof ’ staat rechts van de tonostoets. Het heeft geen @, #, &, accolades of punthaken.",
  },
  hu: {
    label: "Hongaars (QWERTZ)",
    kurz: "Hongaars toetsenbord",
    hinweis:
      "Op het Hongaarse toetsenbord staat de 0 links van de 1; waar de 0 meestal staat, staat ö, dan ü en ó. ő en " +
      "ú staan rechts van p, é á ű rechts van l, í links van y. Elke letter met accent heeft een eigen toets, met " +
      "Shift de hoofdletter. ; @ € en de haakjes komen met Alt Gr.",
  },
  "hu-101": {
    label: "Hongaars (QWERTY, 101 toetsen)",
    kurz: "Hongaars QWERTY-toetsenbord",
    hinweis:
      "Het Hongaarse toetsenbord met 101 toetsen heeft y en z zoals het Engelse toetsenbord. í staat links van 1, " +
      "de 0 is Alt Gr + die toets; waar de 0 meestal staat, staat ö. ő en ú staan rechts van p, ű boven Enter, é " +
      "en á rechts van l.",
  },
  // Glossar §2.9 Totasten-Hinweis: ' und " sind dode toetsen.
  "nl-intl": {
    label: "Verenigde Staten (internationaal)",
    kurz: "internationaal Amerikaans toetsenbord",
    hinweis:
      "Op het toetsenbord Verenigde Staten (internationaal) zijn ' en \" (de toets rechts van ;) dode toetsen: voor " +
      "het teken zelf volgt daarna de spatiebalk. ë is \" en dan e, ï is \" en dan i. Het euroteken is Alt Gr + 5, " +
      "é is Alt Gr + E (of ' en dan e).",
  },
  "nl-dutch": {
    label: "Nederlands",
    kurz: "Nederlands toetsenbord",
    hinweis:
      "Op het Nederlandse toetsenbord is ' Shift + 0 en \" Shift + 2, en staat @ links van de 1 op de cijferrij. ë " +
      "en ï komen van de dode toets ¨ rechts van p, é van de dode toets ´ rechts van +: eerst de dode toets, dan de " +
      "letter.",
  },
  pt: {
    label: "Portugees (Portugal)",
    kurz: "Portugees toetsenbord",
    hinweis:
      "Op het Portugese toetsenbord heeft ç een eigen toets rechts van l. Het accent aigu ´ is een dode toets " +
      "rechts van + (met Shift het accent grave `), de tilde ~ een dode toets rechts van º (met Shift het dakje " +
      "^): eerst de dode toets, dan de klinker (á, ã, ê). De Franse aanhalingstekens hebben een eigen toets rechts " +
      "van de apostrof.",
  },
  "br-abnt2": {
    label: "Portugees (Brazilië, ABNT2)",
    kurz: "Braziliaans toetsenbord",
    hinweis:
      "Op het Braziliaanse ABNT2-toetsenbord heeft ç een eigen toets rechts van l. Het accent aigu ´ is een dode " +
      "toets rechts van p (met Shift het accent grave `), de tilde ~ een dode toets rechts van ç (met Shift het " +
      "dakje ^). Shift + 6 is de dode toets ¨, geen teken. De apostrof ' staat links van de 1 (met Shift \"), de " +
      "puntkomma ; rechtsonder. / en ? staan op de extra toets rechts van ; of op Alt Gr + Q en Alt Gr + W.",
  },
  ro: {
    label: "Roemeens (standaard)",
    kurz: "Roemeens toetsenbord",
    hinweis:
      "Op het Roemeense standaardtoetsenbord staan ă en î rechts van p, â boven Enter, ș en ț rechts van l - ș en ț " +
      "met een komma eronder, zoals het hoort. De aanhalingstekens „ en ” staan links van de 1 (” met Shift). De " +
      "apostrof is Alt Gr + ț, het euroteken Alt Gr + E.",
  },
  "ro-prog": {
    label: "Roemeens (programmeurs, QWERTY)",
    kurz: "Roemeens programmeurstoetsenbord",
    hinweis:
      "Op het Roemeense programmeurstoetsenbord worden de Roemeense letters getypt met Alt Gr en de basisletter: " +
      "ă = a, â = q, î = i, ș = s, ț = t; voor een hoofdletter komt Shift erbij. Verder is het het Engelse " +
      "toetsenbord (Verenigde Staten).",
  },
  sv: {
    label: "Zweeds (Zweden, Finland)",
    kurz: "Zweeds toetsenbord",
    hinweis:
      "Op het Zweedse toetsenbord staat å rechts van p, ö en ä rechts van l - elk met een eigen toets, met Shift de " +
      "hoofdletter. é is de dode toets ´ (rechts van +), dan e. @ is Alt Gr + 2, € is Alt Gr + E. Het Finse " +
      "toetsenbord is hetzelfde.",
  },
  ua: {
    label: "Oekraïens (uitgebreid)",
    kurz: "Oekraïens toetsenbord",
    hinweis:
      "Op het Oekraïense toetsenbord is de basisrij ф і в а п р о л д ж є. De apostrof ' staat links van de 1 (met " +
      "Shift het hryvnia-teken ₴). De punt staat rechtsonder, de komma is Shift + dezelfde toets. ґ staat links " +
      "van я, of is Alt Gr + г.",
  },
  "ua-std": {
    label: "Oekraïens (standaard)",
    kurz: "Oekraïens standaardtoetsenbord",
    hinweis:
      "Het Oekraïense standaardtoetsenbord is het Oekraïense toetsenbord zonder apostrof: links van de 1 staat de " +
      "Russische ё. Woorden met een apostrof komen niet aan de beurt - het uitgebreide Oekraïense toetsenbord " +
      "heeft hem wel.",
  },
};
