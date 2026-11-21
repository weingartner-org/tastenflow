/**
 * ★ O-CS (03.10.2026): die tschechischen Präpositionen vor einer ZAHL.
 *
 * Tschechisch schreibt „z" oder „ze", „v" oder „ve" - je nachdem, wie das
 * gesprochene Zahlwort beginnt: „z 5" (z pěti), aber „ze 6" (ze šesti); „v 8:00"
 * (v osm), aber „ve 4:00" (ve čtyři). Eine feste Präposition vor `${n}` ist darum
 * bei einem Teil der Zahlen falsch (Glossar Tschechisch §1 Regel 13, §4 Falle 5).
 *
 * Wo es geht, steht in der Oberfläche statt eines Satzes ein Schrägstrich
 * („Řádek 2/12") oder ein Doppelpunkt („Místo: 2/6") - dann gibt es nichts zu
 * wählen. Diese zwei Funktionen sind für die Sätze, die eine Präposition
 * brauchen („2. místo ze 6").
 *
 * ⚠️ Die Regel ist eigenes Sprachwissen [G] (Glossar §4 Falle 5: „vor dem Bau
 * gegenprüfen") - von einer Person mit Tschechisch als Erstsprache zu prüfen
 * (Befund O-CS, Fragen). Grundlage: „ze" vor einem Zahlwort, das mit s, z, š, ž
 * oder einer Konsonantengruppe (dv, tř, čt) beginnt; „ve" vor dv, tř, čt.
 */

/**
 * „z" oder „ze" vor einer ganzen Zahl (n ≥ 0): „ze" bei 2, 3, 4, 6, 7, 12, 13,
 * 14, 16, 17, 20-49, 60-79, 100-499, 600-799, 2 000-4 999 …, sonst „z".
 */
export function zZe(n: number): "z" | "ze" {
  const k = Math.floor(Math.abs(n));
  if (k >= 1_000_000) {
    const vorn = Math.floor(k / 1_000_000);
    return vorn === 1 ? "z" : zZe(vorn); // „milion" · „dva miliony"
  }
  if (k >= 1000) {
    const vorn = Math.floor(k / 1000);
    return vorn === 1 ? "z" : zZe(vorn); // „tisíc" · „dva tisíce"
  }
  if (k >= 100) {
    const vorn = Math.floor(k / 100);
    return vorn === 1 ? "ze" : zZe(vorn); // „sto" · „dvě stě" · „pět set" · „šest set"
  }
  if (k >= 20) {
    const zehner = Math.floor(k / 10); // dvacet, třicet, čtyřicet, šedesát, sedmdesát
    return [2, 3, 4, 6, 7].includes(zehner) ? "ze" : "z";
  }
  // jeden, dva, tři, čtyři, pět, šest, sedm, osm, devět, deset, jedenáct,
  // dvanáct, třináct, čtrnáct, patnáct, šestnáct, sedmnáct, osmnáct, devatenáct
  return [2, 3, 4, 6, 7, 12, 13, 14, 16, 17].includes(k) ? "ze" : "z";
}

/**
 * „v" oder „ve" vor einer Uhrzeit (Stunde 0-23): „ve 2:00", „ve 3:00", „ve 4:00",
 * „ve 12:00", „ve 13:00", „ve 14:00", „ve 20:00" bis „ve 23:00", sonst „v 8:00".
 */
export function vVe(stunde: number): "v" | "ve" {
  const h = Math.floor(Math.abs(stunde)) % 24;
  return [2, 3, 4, 12, 13, 14, 20, 21, 22, 23].includes(h) ? "ve" : "v";
}
