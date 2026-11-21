/**
 * Programmcode zum Abtippen als ÜBUNGSVORLAGE - zehn Ausschnitte, einer je
 * Sprache: Python, JavaScript, Java, C, C++, C#, TypeScript, SQL, Go, Rust.
 *
 * Jeder Eintrag ist eine Übungsvorlage: erst die Einleitungszeile (`introDe`,
 * bei SQL „Eine Abfrage in SQL:", englisch `introEn`), dann die Zeilen des
 * Codes. Die Einleitungszeile gehört, wie bei den Prüfungstexten, zum zu
 * tippenden Text und steht deshalb NICHT in `zeilen`.
 *
 * ── Bewusst NICHT die Ausschnitte der Tippchallenge ─────────────────────────
 * Die Prüfungstexte „Programmcode" (`schreibproben/texteCodeA.ts` und
 * `texteCodeB.ts`, Texte 1 bis 15) sind tabu: Keine Datei, die dort im
 * Kopfkommentar als Herkunft steht, ist hier noch einmal benutzt, und keine
 * Zeile ist dieselbe. Ein Kind, das mit diesen Vorlagen übt, hat einen
 * Prüfungstext also nie schon abgetippt.
 *
 * ── Zwei Zeichen fehlen, und zwar mit Absicht ───────────────────────────────
 * Kein Backslash und kein Backtick: Beide gibt es auf mindestens einer der
 * Tastaturen nicht (Backslash: keine ß-Taste auf der Schweizer Tastatur;
 * Backtick: auf der deutschen Tastatur nur als Tottaste). Das ist eine
 * Einschränkung an die AUSWAHL des Codes; kein Ausschnitt wurde dafür
 * verfälscht. Alle Zeichen sind druckbares ASCII, keine Zeile ist länger als
 * 40 Zeichen (eine Braillezeile hat 40 Module), keine ist leer.
 *
 * ── Was am Original geändert wurde - und was nicht ──────────────────────────
 * Wie in `texteCodeA.ts`: Kein Zeichen des Codes wurde ersetzt, weggelassen
 * oder hinzuerfunden. Angepasst ist nur die Darstellung:
 *  • Tabulatoren am Zeilenanfang (nur das Go-Original hat welche) sind vier
 *    Leerzeichen, Leerzeilen fehlen.
 *  • Zeilen über 40 Zeichen sind umgebrochen, und zwar nur dort, wo es die
 *    Sprache erlaubt (in einer offenen Klammer, hinter einem Komma oder
 *    Operator, zwischen zwei Wörtern einer Deklaration; in Python nur in
 *    Klammern) - nie in einer Zeichenkette. Die Fortsetzung ist um vier
 *    Stellen eingerückt. Bei einer umgebrochenen Kommentarzeile steht das
 *    Kommentarzeichen (// bzw. #) auf der Folgezeile noch einmal, mit
 *    derselben Einrückung.
 *  • Mehrere Leerzeichen mitten in der Zeile würden zu einem (in diesen zehn
 *    Ausschnitten kommt keine solche Zeile vor).
 * Die Einrückung ist die des Originals: In Python ist sie die Syntax.
 * Sieben Ausschnitte (Python, C, C++, C#, TypeScript, Go, Rust) beginnen
 * INNERHALB eines Funktionsrumpfs und schließen dessen Klammer nicht mit:
 * Eine Klammer allein in der ersten Spalte wäre eine Zeile mit einem Zeichen,
 * und die sind verboten. Der Ausschnitt ist dann der Rumpf ohne Kopf und
 * ohne die letzte Klammer, in sich ausgeglichen.
 * Jeder Ausschnitt ist gegen seine Quelldatei nachgerechnet: Ohne Leerraum
 * ergeben die Zeilen Zeichen für Zeichen genau den angegebenen Zeilenbereich
 * - bis auf die wiederholten Kommentarzeichen, sonst nichts.
 *
 * ── Nachweis: woher jeder Ausschnitt stammt ─────────────────────────────────
 * Alle zehn Ausschnitte sind echter, unveränderter Quelltext aus offenen
 * Projekten; keiner ist selbst geschrieben oder nachgebaut. Abgerufen am
 * 21.09.2026, jeweils auf dem Stand des Hauptzweigs von diesem Tag; der feste
 * Commit steht in `quelle.url`. Bei Tastenflow (JavaScript und TypeScript)
 * gibt es kein Remote: Dort steht die git-Schreibweise `git:<Commit>:<Pfad>`
 * (zu lesen mit `git show <Commit>:<Pfad>`). Die Zeilenangaben beziehen sich
 * auf die Datei im jeweiligen Projekt.
 *
 *   Sprache    Projekt              Pfad                                 Zeilen      Lizenz
 *   Python     CPython              Lib/bisect.py                        Z34-54      Python Software Foundation License 2.0
 *   JavaScript Tastenflow           scripts/woerterbuch-macos.js         Z42-61      dieses Repository
 *   Java       TheAlgorithms/Java   sorts/BinaryInsertionSort.java       Z17-39      MIT
 *   C          SQLite               ext/misc/percentile.c                Z345-372    gemeinfrei (der Autor verzichtet auf das Urheberrecht)
 *   C++        TheAlgorithms/C++    search/jump_search.cpp               Z13-40      MIT
 *   C#         dotnet/runtime       System/Array.cs                      Z1114-1142  MIT
 *   TypeScript Tastenflow           src/lib/typing/leseZeile.ts          Z73-87      dieses Repository
 *   SQL        PostgreSQL           src/test/regress/sql/case.sql        Z81-109     PostgreSQL-Lizenz
 *   Go         TheAlgorithms/Go     sort/pancakesort.go                  Z9-34       MIT
 *   Rust       TheAlgorithms/Rust   src/sorting/cocktail_shaker_sort.rs  Z2-34       MIT
 *
 * Zwei Pfade sind in der Tabelle gekürzt: Bei TheAlgorithms/Java liegt alles
 * unter src/main/java/com/thealgorithms/, bei dotnet/runtime unter
 * src/libraries/System.Private.CoreLib/src/. In `quelle.pfad` steht der volle
 * Pfad. Das Repository von TheAlgorithms/C++ heißt auf GitHub
 * C-Plus-Plus; der SQLite-Quelltext kommt vom GitHub-Spiegel sqlite/sqlite,
 * der von PostgreSQL vom Spiegel postgres/postgres.
 */

export interface CodeVorlage {
  /** "code-python", "code-javascript", ... - eine je Sprache. */
  id: string;
  sprache: string;
  /** Erste Übungszeile, deutsch: "Ein Programm in Python:" (bei SQL: "Eine Abfrage in SQL:"). */
  introDe: string;
  /** Erste Übungszeile, englisch: "A program in Python:" (bei SQL: "A query in SQL:"). */
  introEn: string;
  /** Der Code, Zeile für Zeile, OHNE die Einleitungszeile. Die Einrückung des Originals bleibt. */
  zeilen: string[];
  /** Herkunft; `url` ist die Roh-Adresse auf einem festen Commit-Stand. */
  quelle: {
    projekt: string;
    pfad: string;
    zeilen: string;
    lizenz: string;
    url: string;
  };
}

export const CODE_VORLAGEN: readonly CodeVorlage[] = [
  {
    id: "code-python",
    sprache: "Python",
    introDe: "Ein Programm in Python:",
    introEn: "A program in Python:",
    zeilen: [
      "    if lo < 0:",
      "        raise ValueError(",
      "            'lo must be non-negative')",
      "    if hi is None:",
      "        hi = len(a)",
      "    # Note, the comparison uses",
      '    # "<" to match the',
      "    # __lt__() logic in list.sort()",
      "    # and in heapq.",
      "    if key is None:",
      "        while lo < hi:",
      "            mid = (lo + hi) // 2",
      "            if x < a[mid]:",
      "                hi = mid",
      "            else:",
      "                lo = mid + 1",
      "    else:",
      "        while lo < hi:",
      "            mid = (lo + hi) // 2",
      "            if x < key(a[mid]):",
      "                hi = mid",
      "            else:",
      "                lo = mid + 1",
      "    return lo",
    ],
    quelle: {
      projekt: "CPython",
      pfad: "Lib/bisect.py",
      zeilen: "Z34-54",
      lizenz: "Python Software Foundation License 2.0",
      url: "https://raw.githubusercontent.com/python/cpython/1596e58f45a26f2a694d26a2b856064640b06608/Lib/bisect.py",
    },
  },
  {
    id: "code-javascript",
    sprache: "JavaScript",
    introDe: "Ein Programm in JavaScript:",
    introEn: "A program in JavaScript:",
    zeilen: [
      "    const memo = new Map();",
      "    const zerlegbar = (w, tiefe) => {",
      "      const schluessel =",
      '          w + "|" + tiefe;',
      "      if (memo.has(schluessel))",
      "          return memo.get(schluessel);",
      "      let r = false;",
      "      if (tiefe > 0) {",
      "        for (let i = 3;",
      "            i <= w.length - 3 && !r;",
      "            i++) {",
      "          const links = w.slice(0, i);",
      "          const rechts = w.slice(i);",
      "          const linksOk =",
      "            teilOk(links) ||",
      '            (links.endsWith("s") &&',
      "                teilOk(",
      "                links.slice(0, -1))) ||",
      "            zerlegbar(links, tiefe - 1);",
      "          if (!linksOk) continue;",
      "          r = teilOk(rechts) ||",
      "              zerlegbar(rechts,",
      "              tiefe - 1);",
      "        }",
      "      }",
      "      memo.set(schluessel, r);",
      "      return r;",
      "    };",
    ],
    quelle: {
      projekt: "Tastenflow",
      pfad: "scripts/woerterbuch-macos.js",
      zeilen: "Z42-61",
      lizenz: "dieses Repository",
      url: "git:fe289661347fe4c0868d37404856553b49b92f65:scripts/woerterbuch-macos.js",
    },
  },
  {
    id: "code-java",
    sprache: "Java",
    introDe: "Ein Programm in Java:",
    introEn: "A program in Java:",
    zeilen: [
      "    public <T extends Comparable<T>>",
      "        T[] sort(T[] array) {",
      "        for (int i = 1;",
      "            i < array.length; i++) {",
      "            final T temp = array[i];",
      "            int low = 0;",
      "            int high = i - 1;",
      "            while (low <= high) {",
      "                final int mid =",
      "                    (low + high) >>> 1;",
      "                if (SortUtils.less(temp,",
      "                    array[mid])) {",
      "                    high = mid - 1;",
      "                } else {",
      "                    low = mid + 1;",
      "                }",
      "            }",
      "            for (int j = i;",
      "                j >= low + 1; j--) {",
      "                array[j] = array[j - 1];",
      "            }",
      "            array[low] = temp;",
      "        }",
      "        return array;",
      "    }",
    ],
    quelle: {
      projekt: "TheAlgorithms/Java",
      pfad: "src/main/java/com/thealgorithms/sorts/BinaryInsertionSort.java",
      zeilen: "Z17-39",
      lizenz: "MIT",
      url: "https://raw.githubusercontent.com/TheAlgorithms/Java/6bdb1acc2fe643834204abf835a53b915f05c91f/src/main/java/com/thealgorithms/sorts/BinaryInsertionSort.java",
    },
  },
  {
    id: "code-c",
    sprache: "C",
    introDe: "Ein Programm in C:",
    introEn: "A program in C:",
    zeilen: [
      "    if( a[0]>a[n-1] ){",
      "      SWAP_DOUBLE(a[0],a[n-1])",
      "    }",
      "    if( n==2 ) return;",
      "    iGt = n-1;",
      "    i = n/2;",
      "    if( a[0]>a[i] ){",
      "      SWAP_DOUBLE(a[0],a[i])",
      "    }else if( a[i]>a[iGt] ){",
      "      SWAP_DOUBLE(a[i],a[iGt])",
      "    }",
      "    if( n==3 ) return;",
      "    rPivot = a[i];",
      "    iLt = i = 1;",
      "    do{",
      "      if( a[i]<rPivot ){",
      "        if( i>iLt )",
      "            SWAP_DOUBLE(a[i],a[iLt])",
      "        iLt++;",
      "        i++;",
      "      }else if( a[i]>rPivot ){",
      "        do{",
      "          iGt--;",
      "        }while( iGt>i &&",
      "            a[iGt]>rPivot );",
      "        SWAP_DOUBLE(a[i],a[iGt])",
      "      }else{",
      "        i++;",
      "      }",
      "    }while( i<iGt );",
    ],
    quelle: {
      projekt: "SQLite",
      pfad: "ext/misc/percentile.c",
      zeilen: "Z345-372",
      lizenz: "gemeinfrei (der Autor verzichtet auf das Urheberrecht)",
      url: "https://raw.githubusercontent.com/sqlite/sqlite/c908175cbe40c6208150b0e8fc417e4a838107e8/ext/misc/percentile.c",
    },
  },
  {
    id: "code-cpp",
    sprache: "C++",
    introDe: "Ein Programm in C++:",
    introEn: "A program in C++:",
    zeilen: [
      "    // Finding block size to be jumped",
      "    int step = std::sqrt(n);",
      "    // Finding the block where",
      "    // element is",
      "    // present (if it is present)",
      "    int prev = 0;",
      "    while (arr[std::min(step, n) - 1] <",
      "        x) {",
      "        prev = step;",
      "        step += std::sqrt(n);",
      "        if (prev >= n)",
      "            return -1;",
      "    }",
      "    // Doing a linear search for",
      "    // x in block",
      "    // beginning with prev.",
      "    while (arr[prev] < x) {",
      "        prev++;",
      "        // If we reached next block",
      "        // or end of",
      "        // array, element is not",
      "        // present.",
      "        if (prev == std::min(step, n))",
      "            return -1;",
      "    }",
      "    // If element is found",
      "    if (arr[prev] == x)",
      "        return prev;",
      "    return -1;",
    ],
    quelle: {
      projekt: "TheAlgorithms/C++",
      pfad: "search/jump_search.cpp",
      zeilen: "Z13-40",
      lizenz: "MIT",
      url: "https://raw.githubusercontent.com/TheAlgorithms/C-Plus-Plus/af6e2c8991e9a1ebe431811fc891a3bcea4a4d89/search/jump_search.cpp",
    },
  },
  {
    id: "code-csharp",
    sprache: "C#",
    introDe: "Ein Programm in C#:",
    introEn: "A program in C#:",
    zeilen: [
      "            if (other == null)",
      "            {",
      "                return false;",
      "            }",
      "            if (ReferenceEquals(this,",
      "                other))",
      "            {",
      "                return true;",
      "            }",
      "            if (other is not Array o ||",
      "                o.Length != this.Length)",
      "            {",
      "                return false;",
      "            }",
      "            int i = 0;",
      "            while (i < o.Length)",
      "            {",
      "                object? left =",
      "                    GetValue(i);",
      "                object? right =",
      "                    o.GetValue(i);",
      "                if (!comparer.Equals(",
      "                    left, right))",
      "                {",
      "                    return false;",
      "                }",
      "                i++;",
      "            }",
      "            return true;",
    ],
    quelle: {
      projekt: "dotnet/runtime",
      pfad: "src/libraries/System.Private.CoreLib/src/System/Array.cs",
      zeilen: "Z1114-1142",
      lizenz: "MIT",
      url: "https://raw.githubusercontent.com/dotnet/runtime/35423f17d6ebe715711a907badda2a505633daf2/src/libraries/System.Private.CoreLib/src/System/Array.cs",
    },
  },
  {
    id: "code-typescript",
    sprache: "TypeScript",
    introDe: "Ein Programm in TypeScript:",
    introEn: "A program in TypeScript:",
    zeilen: [
      "  const gueltig = rechtecke.filter(",
      "      (r) => r.w > 0 && r.h > 0);",
      "  const sortiert = [...gueltig].sort(",
      "      (a, b) => a.y - b.y || a.x - b.x);",
      "  const gruppen: LesezeileRechteck[][] =",
      "      [];",
      "  for (const r of sortiert) {",
      "    const gruppe = gruppen.find(",
      "        (g) => selbeZeile(g[0], r));",
      "    if (gruppe) gruppe.push(r);",
      "    else gruppen.push([r]);",
      "  }",
      "  return gruppen.map((gruppe) => {",
      "    const links = Math.min(",
      "        ...gruppe.map((g) => g.x));",
      "    const oben = Math.min(",
      "        ...gruppe.map((g) => g.y));",
      "    const rechts = Math.max(",
      "        ...gruppe.map(",
      "        (g) => g.x + g.w));",
      "    const unten = Math.max(",
      "        ...gruppe.map(",
      "        (g) => g.y + g.h));",
      "    return { x: links, y: oben,",
      "        w: rechts - links,",
      "        h: unten - oben };",
      "  });",
    ],
    quelle: {
      projekt: "Tastenflow",
      pfad: "src/lib/typing/leseZeile.ts",
      zeilen: "Z73-87",
      lizenz: "dieses Repository",
      url: "git:fe289661347fe4c0868d37404856553b49b92f65:src/lib/typing/leseZeile.ts",
    },
  },
  {
    id: "code-sql",
    sprache: "SQL",
    introDe: "Eine Abfrage in SQL:",
    introEn: "A query in SQL:",
    zeilen: [
      "SELECT",
      "  CASE",
      "    WHEN i >= 3 THEN i",
      '  END AS ">= 3 or Null"',
      "  FROM CASE_TBL;",
      "SELECT",
      "  CASE WHEN i >= 3 THEN (i + i)",
      "       ELSE i",
      '  END AS "Simplest Math"',
      "  FROM CASE_TBL;",
      'SELECT i AS "Value",',
      "  CASE WHEN (i < 0) THEN 'small'",
      "       WHEN (i = 0) THEN 'zero'",
      "       WHEN (i = 1) THEN 'one'",
      "       WHEN (i = 2) THEN 'two'",
      "       ELSE 'big'",
      '  END AS "Category"',
      "  FROM CASE_TBL;",
      "SELECT",
      "  CASE WHEN ((i < 0) or (i < 0))",
      "      THEN 'small'",
      "       WHEN ((i = 0) or (i = 0))",
      "           THEN 'zero'",
      "       WHEN ((i = 1) or (i = 1))",
      "           THEN 'one'",
      "       WHEN ((i = 2) or (i = 2))",
      "           THEN 'two'",
      "       ELSE 'big'",
      '  END AS "Category"',
      "  FROM CASE_TBL;",
    ],
    quelle: {
      projekt: "PostgreSQL",
      pfad: "src/test/regress/sql/case.sql",
      zeilen: "Z81-109",
      lizenz: "PostgreSQL-Lizenz",
      url: "https://raw.githubusercontent.com/postgres/postgres/9e17d25e79d4756be08b4a5521b4b58450217137/src/test/regress/sql/case.sql",
    },
  },
  {
    id: "code-go",
    sprache: "Go",
    introDe: "Ein Programm in Go:",
    introEn: "A program in Go:",
    zeilen: [
      "    // early return if the array",
      "    // too small",
      "    if len(arr) <= 1 {",
      "        return arr",
      "    }",
      "    // start from the end of the array",
      "    for i := len(arr) - 1; i > 0; i-- {",
      "        // find the index of the",
      "        // maximum element in arr",
      "        max := 0",
      "        for j := 1; j <= i; j++ {",
      "            if arr[j] > arr[max] {",
      "                max = j",
      "            }",
      "        }",
      "        // if the maximum element is not",
      "        // at the end of the array",
      "        if max != i {",
      "            // flip the maximum",
      "            // element to the beginning",
      "            // of the array",
      "            arr = flip(arr, max)",
      "            // flip the maximum element",
      "            // to the end of the array",
      "            // by flipping the whole",
      "            // array",
      "            arr = flip(arr, i)",
      "        }",
      "    }",
      "    return arr",
    ],
    quelle: {
      projekt: "TheAlgorithms/Go",
      pfad: "sort/pancakesort.go",
      zeilen: "Z9-34",
      lizenz: "MIT",
      url: "https://raw.githubusercontent.com/TheAlgorithms/Go/5ba447ec5ff3d1213de65b92e726ee74c5d5cc19/sort/pancakesort.go",
    },
  },
  {
    id: "code-rust",
    sprache: "Rust",
    introDe: "Ein Programm in Rust:",
    introEn: "A program in Rust:",
    zeilen: [
      "    let len = arr.len();",
      "    if len == 0 {",
      "        return;",
      "    }",
      "    loop {",
      "        let mut swapped = false;",
      "        for i in 0..(len - 1).clamp(",
      "            0, len) {",
      "            if arr[i] > arr[i + 1] {",
      "                arr.swap(i, i + 1);",
      "                swapped = true;",
      "            }",
      "        }",
      "        if !swapped {",
      "            break;",
      "        }",
      "        swapped = false;",
      "        for i in (0..(len - 1).clamp(",
      "            0, len)).rev() {",
      "            if arr[i] > arr[i + 1] {",
      "                arr.swap(i, i + 1);",
      "                swapped = true;",
      "            }",
      "        }",
      "        if !swapped {",
      "            break;",
      "        }",
      "    }",
    ],
    quelle: {
      projekt: "TheAlgorithms/Rust",
      pfad: "src/sorting/cocktail_shaker_sort.rs",
      zeilen: "Z2-34",
      lizenz: "MIT",
      url: "https://raw.githubusercontent.com/TheAlgorithms/Rust/2345c668b05ecb6fa074138bdbc5a1cbf2afaec8/src/sorting/cocktail_shaker_sort.rs",
    },
  },
];
