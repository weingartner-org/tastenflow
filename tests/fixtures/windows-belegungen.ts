/**
 * ★★★ W1 (27.09.2026): Die Windows-Belegungstabellen als Test-Fixture -
 * wörtlich aus BEFUND-2026-09-27-WINDOWS-MESSUNG.md, Anhang A (gelesen aus den
 * Windows-Belegungs-DLLs, `KbdLayerDescriptor`, samt Totasten und
 * Feststell-Verhalten; für die sechs installierten Belegungen gegen Windows'
 * eigenes `ToUnicodeEx` verglichen: 6 × 288 Kombinationen, 0 Abweichungen).
 *
 * Spalten: sc (Scancode, hex) · vk · attr (Feststell-Merkmal) · ohne ·
 * Umschalt · AltGr · Umschalt+AltGr · Feststell · Feststell+Umschalt.
 * `DEAD:x` = Totaste x, `·` = nichts. Die Gravis-Totaste steht als
 * `DEAD:GRAVIS` (ein Backtick hätte die Vorlage beendet) - `leseBelegung`
 * macht daraus wieder „`".
 *
 * ⚠️ Schweiz (deutsch, KBDSG) ist auf dem Mess-PC NICHT installiert und steht
 * nicht in Anhang A. Die Tabelle unten ist aus KBDSF ABGELEITET: dieselbe
 * Belegung bis auf die drei getauschten Tasten (sc 1A ü/è, sc 27 ö/é,
 * sc 28 ä/à) - so bestätigt es der Code-Abgleich des Befunds (vergleich.json:
 * „Umschalt + ü gibt è", „Feststell + ä gibt ä", „£ = Umschalt + $",
 * „~ ist Totaste"). Keine eigene DLL-Lesung.
 */

/** Scancode → `KeyboardEvent.code` (in Edge und Chrome gemessen, Befund Teil 1). */
export const SCANCODE_CODE: Readonly<Record<string, string>> = {
  "29": "Backquote",
  "02": "Digit1", "03": "Digit2", "04": "Digit3", "05": "Digit4", "06": "Digit5",
  "07": "Digit6", "08": "Digit7", "09": "Digit8", "0A": "Digit9", "0B": "Digit0",
  "0C": "Minus", "0D": "Equal",
  "10": "KeyQ", "11": "KeyW", "12": "KeyE", "13": "KeyR", "14": "KeyT", "15": "KeyY",
  "16": "KeyU", "17": "KeyI", "18": "KeyO", "19": "KeyP", "1A": "BracketLeft", "1B": "BracketRight",
  "1E": "KeyA", "1F": "KeyS", "20": "KeyD", "21": "KeyF", "22": "KeyG", "23": "KeyH",
  "24": "KeyJ", "25": "KeyK", "26": "KeyL", "27": "Semicolon", "28": "Quote", "2B": "Backslash",
  "56": "IntlBackslash",
  "2C": "KeyZ", "2D": "KeyX", "2E": "KeyC", "2F": "KeyV", "30": "KeyB", "31": "KeyN", "32": "KeyM",
  "33": "Comma", "34": "Period", "35": "Slash",
};

export const KBDSP = String.raw`
29  DC  0 | º | ª | \ | · | º | ª
02  31  0 | 1 | ! | | | · | 1 | !
03  32  0 | 2 | " | @ | · | 2 | "
04  33  0 | 3 | · | # | · | 3 | ·
05  34  0 | 4 | $ | DEAD:~ | · | 4 | $
06  35  0 | 5 | % | € | · | 5 | %
07  36  0 | 6 | & | ¬ | · | 6 | &
08  37  0 | 7 | / | · | · | 7 | /
09  38  0 | 8 | ( | · | · | 8 | (
0A  39  0 | 9 | ) | · | · | 9 | )
0B  30  0 | 0 | = | · | · | 0 | =
0C  DB  0 | ' | ? | · | · | ' | ?
0D  DD  0 | ¡ | ¿ | · | · | ¡ | ¿
10  51  1 | q | Q | · | · | Q | q
11  57  1 | w | W | · | · | W | w
12  45  1 | e | E | € | · | E | e
13  52  1 | r | R | · | · | R | r
14  54  1 | t | T | · | · | T | t
15  59  1 | y | Y | · | · | Y | y
16  55  1 | u | U | · | · | U | u
17  49  1 | i | I | · | · | I | i
18  4F  1 | o | O | · | · | O | o
19  50  1 | p | P | · | · | P | p
1A  BA  0 | DEAD:GRAVIS | DEAD:^ | [ | · | DEAD:GRAVIS | DEAD:^
1B  BB  0 | + | * | ] | · | + | *
1E  41  1 | a | A | · | · | A | a
1F  53  1 | s | S | · | · | S | s
20  44  1 | d | D | · | · | D | d
21  46  1 | f | F | · | · | F | f
22  47  1 | g | G | · | · | G | g
23  48  1 | h | H | · | · | H | h
24  4A  1 | j | J | · | · | J | j
25  4B  1 | k | K | · | · | K | k
26  4C  1 | l | L | · | · | L | l
27  C0  1 | ñ | Ñ | · | · | Ñ | ñ
28  DE  0 | DEAD:´ | DEAD:¨ | { | · | DEAD:´ | DEAD:¨
2B  BF  1 | ç | Ç | } | · | Ç | ç
56  E2  0 | < | > | · | · | < | >
2C  5A  1 | z | Z | · | · | Z | z
2D  58  1 | x | X | · | · | X | x
2E  43  1 | c | C | · | · | C | c
2F  56  1 | v | V | · | · | V | v
30  42  1 | b | B | · | · | B | b
31  4E  1 | n | N | · | · | N | n
32  4D  1 | m | M | · | · | M | m
33  BC  0 | , | ; | · | · | , | ;
34  BE  0 | . | : | · | · | . | :
35  BD  0 | - | _ | · | · | - | _
`;

export const KBDLA = String.raw`
29  DC  0 | | | ° | ¬ | · | | | °
02  31  0 | 1 | ! | · | · | 1 | !
03  32  0 | 2 | " | · | · | 2 | "
04  33  0 | 3 | # | · | · | 3 | #
05  34  0 | 4 | $ | · | · | 4 | $
06  35  0 | 5 | % | · | · | 5 | %
07  36  0 | 6 | & | · | · | 6 | &
08  37  0 | 7 | / | · | · | 7 | /
09  38  0 | 8 | ( | · | · | 8 | (
0A  39  0 | 9 | ) | · | · | 9 | )
0B  30  0 | 0 | = | · | · | 0 | =
0C  DB  0 | ' | ? | \ | · | ' | ?
0D  DD  0 | ¿ | ¡ | · | · | ¿ | ¡
10  51  1 | q | Q | @ | · | Q | q
11  57  1 | w | W | · | · | W | w
12  45  1 | e | E | · | · | E | e
13  52  1 | r | R | · | · | R | r
14  54  1 | t | T | · | · | T | t
15  59  1 | y | Y | · | · | Y | y
16  55  1 | u | U | · | · | U | u
17  49  1 | i | I | · | · | I | i
18  4F  1 | o | O | · | · | O | o
19  50  1 | p | P | · | · | P | p
1A  BA  0 | DEAD:´ | DEAD:¨ | · | · | DEAD:´ | DEAD:¨
1B  BB  0 | + | * | ~ | · | + | *
1E  41  1 | a | A | · | · | A | a
1F  53  1 | s | S | · | · | S | s
20  44  1 | d | D | · | · | D | d
21  46  1 | f | F | · | · | F | f
22  47  1 | g | G | · | · | G | g
23  48  1 | h | H | · | · | H | h
24  4A  1 | j | J | · | · | J | j
25  4B  1 | k | K | · | · | K | k
26  4C  1 | l | L | · | · | L | l
27  C0  1 | ñ | Ñ | · | · | Ñ | ñ
28  DE  0 | { | [ | DEAD:^ | · | { | [
2B  BF  0 | } | ] | DEAD:GRAVIS | · | } | ]
56  E2  0 | < | > | · | · | < | >
2C  5A  1 | z | Z | · | · | Z | z
2D  58  1 | x | X | · | · | X | x
2E  43  1 | c | C | · | · | C | c
2F  56  1 | v | V | · | · | V | v
30  42  1 | b | B | · | · | B | b
31  4E  1 | n | N | · | · | N | n
32  4D  1 | m | M | · | · | M | m
33  BC  0 | , | ; | · | · | , | ;
34  BE  0 | . | : | · | · | . | :
35  BD  0 | - | _ | · | · | - | _
`;

export const KBDSF = String.raw`
29  BF  0 | § | ° | · | · | § | °
02  31  0 | 1 | + | ¦ | · | 1 | +
03  32  0 | 2 | " | @ | · | 2 | "
04  33  0 | 3 | * | # | · | 3 | *
05  34  0 | 4 | ç | ° | · | 4 | ç
06  35  0 | 5 | % | § | · | 5 | %
07  36  0 | 6 | & | ¬ | · | 6 | &
08  37  0 | 7 | / | | | · | 7 | /
09  38  0 | 8 | ( | ¢ | · | 8 | (
0A  39  0 | 9 | ) | · | · | 9 | )
0B  30  0 | 0 | = | · | · | 0 | =
0C  DB  0 | ' | ? | DEAD:´ | · | ' | ?
0D  DD  0 | DEAD:^ | DEAD:GRAVIS | DEAD:~ | · | DEAD:^ | DEAD:GRAVIS
10  51  1 | q | Q | · | · | Q | q
11  57  1 | w | W | · | · | W | w
12  45  1 | e | E | € | · | E | e
13  52  1 | r | R | · | · | R | r
14  54  1 | t | T | · | · | T | t
15  5A  1 | z | Z | · | · | Z | z
16  55  1 | u | U | · | · | U | u
17  49  1 | i | I | · | · | I | i
18  4F  1 | o | O | · | · | O | o
19  50  1 | p | P | · | · | P | p
1A  BA  0 | è | ü | [ | · | è | ü
1B  C0  0 | DEAD:¨ | ! | ] | · | DEAD:¨ | !
1E  41  1 | a | A | · | · | A | a
1F  53  1 | s | S | · | · | S | s
20  44  1 | d | D | · | · | D | d
21  46  1 | f | F | · | · | F | f
22  47  1 | g | G | · | · | G | g
23  48  1 | h | H | · | · | H | h
24  4A  1 | j | J | · | · | J | j
25  4B  1 | k | K | · | · | K | k
26  4C  1 | l | L | · | · | L | l
27  DE  0 | é | ö | · | · | é | ö
28  DC  0 | à | ä | { | · | à | ä
2B  DF  0 | $ | £ | } | · | $ | £
56  E2  0 | < | > | \ | · | < | >
2C  59  1 | y | Y | · | · | Y | y
2D  58  1 | x | X | · | · | X | x
2E  43  1 | c | C | · | · | C | c
2F  56  1 | v | V | · | · | V | v
30  42  1 | b | B | · | · | B | b
31  4E  1 | n | N | · | · | N | n
32  4D  1 | m | M | · | · | M | m
33  BC  0 | , | ; | · | · | , | ;
34  BE  0 | . | : | · | · | . | :
35  BD  0 | - | _ | · | · | - | _
`;

/** Schweiz (deutsch) - ABGELEITET aus KBDSF, siehe Kopf-Kommentar. */
export const KBDSG_ABGELEITET = KBDSF.replace("1A  BA  0 | è | ü | [ | · | è | ü", "1A  BA  0 | ü | è | [ | · | ü | è")
  .replace("27  DE  0 | é | ö | · | · | é | ö", "27  DE  0 | ö | é | · | · | ö | é")
  .replace("28  DC  0 | à | ä | { | · | à | ä", "28  DC  0 | ä | à | { | · | ä | à");

export const KBDCAN = String.raw`
29  DE  0 | / | \ | | | · | / | \
02  31  0 | 1 | ! | · | · | 1 | !
03  32  0 | 2 | @ | · | · | 2 | @
04  33  0 | 3 | # | · | · | 3 | #
05  34  0 | 4 | $ | ¤ | · | 4 | $
06  35  0 | 5 | % | · | · | 5 | %
07  36  0 | 6 | ? | · | · | 6 | ?
08  37  0 | 7 | & | { | · | 7 | &
09  38  0 | 8 | * | } | · | 8 | *
0A  39  0 | 9 | ( | [ | · | 9 | (
0B  30  0 | 0 | ) | ] | · | 0 | )
0C  BD  0 | - | _ | · | · | - | _
0D  BB  0 | = | + | ¬ | · | = | +
10  51  1 | q | Q | · | · | Q | q
11  57  1 | w | W | · | · | W | w
12  45  1 | e | E | € | · | E | e
13  52  1 | r | R | · | · | R | r
14  54  1 | t | T | · | · | T | t
15  59  1 | y | Y | · | · | Y | y
16  55  1 | u | U | · | · | U | u
17  49  1 | i | I | · | · | I | i
18  4F  1 | o | O | · | · | O | o
19  50  1 | p | P | · | · | P | p
1A  DB  0 | DEAD:^ | DEAD:¨ | DEAD:GRAVIS | · | DEAD:^ | DEAD:¨
1B  DD  1 | ç | Ç | DEAD:~ | · | Ç | ç
1E  41  1 | a | A | · | · | A | a
1F  53  1 | s | S | · | · | S | s
20  44  1 | d | D | · | · | D | d
21  46  1 | f | F | · | · | F | f
22  47  1 | g | G | · | · | G | g
23  48  1 | h | H | · | · | H | h
24  4A  1 | j | J | · | · | J | j
25  4B  1 | k | K | · | · | K | k
26  4C  1 | l | L | · | · | L | l
27  BA  0 | ; | : | ° | · | ; | :
28  C0  1 | è | È | · | · | È | è
2B  DC  1 | à | À | · | · | À | à
56  E2  1 | ù | Ù | · | · | Ù | ù
2C  5A  1 | z | Z | « | · | Z | z
2D  58  1 | x | X | » | · | X | x
2E  43  1 | c | C | · | · | C | c
2F  56  1 | v | V | · | · | V | v
30  42  1 | b | B | · | · | B | b
31  4E  1 | n | N | · | · | N | n
32  4D  1 | m | M | · | · | M | m
33  BC  0 | , | ' | < | · | , | '
34  BE  0 | . | " | > | · | . | "
35  BF  1 | é | É | · | · | É | é
`;

export const KBDCA = String.raw`
29  DE  0 | # | | | \ | · | # | |
02  31  0 | 1 | ! | ± | · | 1 | !
03  32  0 | 2 | " | @ | · | 2 | "
04  33  0 | 3 | / | £ | · | 3 | /
05  34  0 | 4 | $ | ¢ | · | 4 | $
06  35  0 | 5 | % | ¤ | · | 5 | %
07  36  0 | 6 | ? | ¬ | · | 6 | ?
08  37  0 | 7 | & | ¦ | · | 7 | &
09  38  0 | 8 | * | ² | · | 8 | *
0A  39  0 | 9 | ( | ³ | · | 9 | (
0B  30  0 | 0 | ) | ¼ | · | 0 | )
0C  BD  0 | - | _ | ½ | · | - | _
0D  BB  0 | = | + | ¾ | · | = | +
10  51  1 | q | Q | · | · | Q | q
11  57  1 | w | W | · | · | W | w
12  45  1 | e | E | € | · | E | e
13  52  1 | r | R | · | · | R | r
14  54  1 | t | T | · | · | T | t
15  59  1 | y | Y | · | · | Y | y
16  55  1 | u | U | · | · | U | u
17  49  1 | i | I | · | · | I | i
18  4F  1 | o | O | § | · | O | o
19  50  1 | p | P | ¶ | · | P | p
1A  DB  0 | DEAD:^ | DEAD:^ | [ | · | DEAD:^ | DEAD:^
1B  DD  0 | DEAD:¸ | DEAD:¨ | ] | · | DEAD:¸ | DEAD:¨
1E  41  1 | a | A | · | · | A | a
1F  53  1 | s | S | · | · | S | s
20  44  1 | d | D | · | · | D | d
21  46  1 | f | F | · | · | F | f
22  47  1 | g | G | · | · | G | g
23  48  1 | h | H | · | · | H | h
24  4A  1 | j | J | · | · | J | j
25  4B  1 | k | K | · | · | K | k
26  4C  1 | l | L | · | · | L | l
27  BA  0 | ; | : | ~ | · | ; | :
28  C0  0 | DEAD:GRAVIS | DEAD:GRAVIS | { | · | DEAD:GRAVIS | DEAD:GRAVIS
2B  DC  0 | < | > | } | · | < | >
56  E2  0 | « | » | ° | · | « | »
2C  5A  1 | z | Z | · | · | Z | z
2D  58  1 | x | X | · | · | X | x
2E  43  1 | c | C | · | · | C | c
2F  56  1 | v | V | · | · | V | v
30  42  1 | b | B | · | · | B | b
31  4E  1 | n | N | · | · | N | n
32  4D  1 | m | M | µ | · | M | m
33  BC  0 | , | ' | ¯ | · | , | '
34  BE  0 | . | . | · | · | . | .
35  BF  1 | é | É | DEAD:´ | · | É | é
`;

export const KBDBE = String.raw`
29  DE  0 | ² | ³ | · | · | ² | ³
02  31  1 | & | 1 | | | · | 1 | &
03  32  1 | é | 2 | @ | · | 2 | é
04  33  1 | " | 3 | # | · | 3 | "
05  34  1 | ' | 4 | { | · | 4 | '
06  35  1 | ( | 5 | [ | · | 5 | (
07  36  1 | § | 6 | ^ | · | 6 | §
08  37  1 | è | 7 | · | · | 7 | è
09  38  1 | ! | 8 | · | · | 8 | !
0A  39  1 | ç | 9 | { | · | 9 | ç
0B  30  1 | à | 0 | } | · | 0 | à
0C  DB  1 | ) | ° | · | · | ° | )
0D  BD  1 | - | _ | · | · | _ | -
10  41  1 | a | A | · | · | A | a
11  5A  1 | z | Z | · | · | Z | z
12  45  1 | e | E | € | · | E | e
13  52  1 | r | R | · | · | R | r
14  54  1 | t | T | · | · | T | t
15  59  1 | y | Y | · | · | Y | y
16  55  1 | u | U | · | · | U | u
17  49  1 | i | I | · | · | I | i
18  4F  1 | o | O | · | · | O | o
19  50  1 | p | P | · | · | P | p
1A  DD  1 | DEAD:^ | DEAD:¨ | [ | · | DEAD:¨ | DEAD:^
1B  BA  1 | $ | * | ] | · | * | $
1E  51  1 | q | Q | · | · | Q | q
1F  53  1 | s | S | · | · | S | s
20  44  1 | d | D | · | · | D | d
21  46  1 | f | F | · | · | F | f
22  47  1 | g | G | · | · | G | g
23  48  1 | h | H | · | · | H | h
24  4A  1 | j | J | · | · | J | j
25  4B  1 | k | K | · | · | K | k
26  4C  1 | l | L | · | · | L | l
27  4D  1 | m | M | · | · | M | m
28  C0  1 | ù | % | DEAD:´ | DEAD:´ | % | ù
2B  DC  1 | µ | £ | DEAD:GRAVIS | DEAD:GRAVIS | £ | µ
56  E2  0 | < | > | \ | · | < | >
2C  57  1 | w | W | · | · | W | w
2D  58  1 | x | X | · | · | X | x
2E  43  1 | c | C | · | · | C | c
2F  56  1 | v | V | · | · | V | v
30  42  1 | b | B | · | · | B | b
31  4E  1 | n | N | · | · | N | n
32  BC  1 | , | ? | · | · | ? | ,
33  BE  1 | ; | . | · | · | . | ;
34  BF  1 | : | / | · | · | / | :
35  BB  1 | = | + | DEAD:~ | DEAD:~ | + | =
`;

export const KBDFR = String.raw`
29  DE  0 | ² | · | · | · | ² | ·
02  31  1 | & | 1 | · | · | 1 | &
03  32  1 | é | 2 | DEAD:~ | · | 2 | é
04  33  1 | " | 3 | # | · | 3 | "
05  34  1 | ' | 4 | { | · | 4 | '
06  35  1 | ( | 5 | [ | · | 5 | (
07  36  1 | - | 6 | | | · | 6 | -
08  37  1 | è | 7 | DEAD:GRAVIS | · | 7 | è
09  38  1 | _ | 8 | \ | · | 8 | _
0A  39  1 | ç | 9 | ^ | · | 9 | ç
0B  30  1 | à | 0 | @ | · | 0 | à
0C  DB  1 | ) | ° | ] | · | ° | )
0D  BB  1 | = | + | } | · | + | =
10  41  1 | a | A | · | · | A | a
11  5A  1 | z | Z | · | · | Z | z
12  45  1 | e | E | € | · | E | e
13  52  1 | r | R | · | · | R | r
14  54  1 | t | T | · | · | T | t
15  59  1 | y | Y | · | · | Y | y
16  55  1 | u | U | · | · | U | u
17  49  1 | i | I | · | · | I | i
18  4F  1 | o | O | · | · | O | o
19  50  1 | p | P | · | · | P | p
1A  DD  1 | DEAD:^ | DEAD:¨ | · | · | DEAD:¨ | DEAD:^
1B  BA  1 | $ | £ | ¤ | · | £ | $
1E  51  1 | q | Q | · | · | Q | q
1F  53  1 | s | S | · | · | S | s
20  44  1 | d | D | · | · | D | d
21  46  1 | f | F | · | · | F | f
22  47  1 | g | G | · | · | G | g
23  48  1 | h | H | · | · | H | h
24  4A  1 | j | J | · | · | J | j
25  4B  1 | k | K | · | · | K | k
26  4C  1 | l | L | · | · | L | l
27  4D  1 | m | M | · | · | M | m
28  C0  1 | ù | % | · | · | % | ù
2B  DC  1 | * | µ | · | · | µ | *
56  E2  0 | < | > | · | · | < | >
2C  57  1 | w | W | · | · | W | w
2D  58  1 | x | X | · | · | X | x
2E  43  1 | c | C | · | · | C | c
2F  56  1 | v | V | · | · | V | v
30  42  1 | b | B | · | · | B | b
31  4E  1 | n | N | · | · | N | n
32  BC  1 | , | ? | · | · | ? | ,
33  BE  1 | ; | . | · | · | . | ;
34  BF  1 | : | / | · | · | / | :
35  DF  1 | ! | § | · | · | § | !
`;

/** Eine Zeile der Tabelle: Scancode → die sechs Ebenen. */
export interface WindowsTaste {
  sc: string;
  code: string;
  ohne: string;
  umschalt: string;
  altgr: string;
  umschaltAltgr: string;
  feststell: string;
  feststellUmschalt: string;
}

/** Eine Tabelle lesen. */
export function leseBelegung(text: string): WindowsTaste[] {
  const out: WindowsTaste[] = [];
  for (const zeile of text.split("\n")) {
    const m = /^([0-9A-F]{2})\s+[0-9A-F]{2}\s+\d\s+\| (.*)$/.exec(zeile);
    if (!m) continue;
    // „DEAD:GRAVIS" steht für „DEAD:`" (ein Backtick beendete die Vorlage).
    const teile = m[2].split(" | ").map((t) => t.replace("GRAVIS", "`"));
    if (teile.length !== 6) throw new Error(`Zeile nicht lesbar: ${zeile}`);
    const code = SCANCODE_CODE[m[1]];
    if (!code) throw new Error(`Scancode unbekannt: ${m[1]}`);
    const [ohne, umschalt, altgr, umschaltAltgr, feststell, feststellUmschalt] = teile;
    out.push({ sc: m[1], code, ohne, umschalt, altgr, umschaltAltgr, feststell, feststellUmschalt });
  }
  return out;
}
