import type { Challenge } from "@/types/challenge";

/**
 * 組み込みチャレンジデータ
 * AI生成が失敗した場合のフォールバックとして使用
 * カテゴリごとに beginner → intermediate → advanced の順
 */
export const builtinChallenges: Challenge[] = [
  // ===== Movement =====
  {
    id: "movement-b-1",
    title: "単語間移動: w と b",
    description:
      "カーソルを 'world' の先頭に移動してください。\n\n💡 `w` で次の単語の先頭へ、`b` で前の単語の先頭へ移動します。",
    category: "movement",
    difficulty: "beginner",
    type: "command-input",
    initialContent: "hello world foo bar",
    expectedContent: "w",
    hints: [
      "`w` は次の単語の先頭にジャンプします",
      "現在カーソルは hello の先頭にあります",
    ],
    acceptedAnswers: ["w"],
    suggestedCommands: ["w", "b", "e"],
  },
  {
    id: "movement-b-2",
    title: "行頭・行末移動: 0 と $",
    description:
      "カーソルを行末に移動するコマンドを入力してください。\n\n💡 `0` で行頭、`$` で行末に移動します。`^` は行の最初の非空白文字に移動します。",
    category: "movement",
    difficulty: "beginner",
    type: "command-input",
    initialContent: "  const result = getValue();",
    expectedContent: "$",
    hints: [
      "`$` は現在の行の末尾に移動します",
      "`0` は行頭（列0）に移動します",
    ],
    acceptedAnswers: ["$"],
    suggestedCommands: ["0", "$", "^"],
  },
  {
    id: "movement-b-3",
    title: "ファイル先頭・末尾: gg と G",
    description:
      "ファイルの末尾に移動するコマンドを入力してください。\n\n💡 `gg` でファイル先頭、`G` でファイル末尾に移動します。`5G` で5行目に移動できます。",
    category: "movement",
    difficulty: "beginner",
    type: "command-input",
    initialContent:
      "line 1\nline 2\nline 3\nline 4\nline 5\nline 6\nline 7\nline 8\nline 9\nline 10",
    expectedContent: "G",
    hints: [
      "`G`(大文字) でファイルの最終行に移動します",
      "`gg` でファイルの先頭行に移動します",
    ],
    acceptedAnswers: ["G"],
    suggestedCommands: ["gg", "G"],
  },
  {
    id: "movement-i-1",
    title: "文字検索: f と t",
    description:
      "カーソルを次の `=` 記号に移動するコマンドを入力してください。\n\n💡 `f{char}` でその文字の上に、`t{char}` でその文字の直前に移動します。`;` で次のマッチ、`,` で前のマッチに移動できます。",
    category: "movement",
    difficulty: "intermediate",
    type: "command-input",
    initialContent: "const result = getValue();",
    expectedContent: "f=",
    hints: [
      "`f=` で次の `=` の上にカーソルが移動します",
      "`t=` だと `=` の1文字手前に止まります",
      "`;` で同じ方向の次のマッチに移動できます",
    ],
    acceptedAnswers: ["f="],
    suggestedCommands: ["f", "t", "F", "T", ";", ","],
  },
  {
    id: "movement-i-2",
    title: "段落移動: { と }",
    description:
      "次の段落（空行の次）に移動するコマンドを入力してください。\n\n💡 `{` で前の段落、`}` で次の段落に移動します。コードのブロック間を素早く移動するのに便利です。",
    category: "movement",
    difficulty: "intermediate",
    type: "command-input",
    initialContent:
      "function hello() {\n  console.log('hello');\n}\n\nfunction world() {\n  console.log('world');\n}",
    expectedContent: "}",
    hints: ["`}` で次の空行の後に移動します", "`{` で前の空行の前に移動します"],
    acceptedAnswers: ["}"],
    suggestedCommands: ["{", "}"],
  },
  {
    id: "movement-a-1",
    title: "対応する括弧へジャンプ: %",
    description:
      "対応する閉じ括弧に移動するコマンドを入力してください。\n\n💡 `%` は現在の括弧 `()`, `{}`, `[]` に対応するペアにジャンプします。コード構造の把握に必須のコマンドです。",
    category: "movement",
    difficulty: "advanced",
    type: "command-input",
    initialContent:
      "if (isValid(data[0])) {\n  process(data);\n  return true;\n}",
    expectedContent: "%",
    hints: [
      "`%` は対応する括弧ペアにジャンプします",
      "カーソルが `(` の上にあれば対応する `)` に、`{` なら `}` に移動します",
    ],
    acceptedAnswers: ["%"],
    suggestedCommands: ["%"],
  },

  // ===== Editing =====
  {
    id: "editing-b-1",
    title: "行の削除: dd",
    description:
      "現在の行を削除するコマンドを入力してください。\n\n💡 `dd` で現在の行全体を削除します。`3dd` で3行削除できます。削除した内容はレジスタに保存され `p` で貼り付けられます。",
    category: "editing",
    difficulty: "beginner",
    type: "command-input",
    initialContent: "keep this line\ndelete this line\nkeep this too",
    expectedContent: "dd",
    hints: [
      "`dd` で現在の行を丸ごと削除できます",
      "削除した内容は `p` で貼り付けられます",
    ],
    acceptedAnswers: ["dd"],
    suggestedCommands: ["dd", "cc", "yy"],
  },
  {
    id: "editing-b-2",
    title: "貼り付け: p と P",
    description:
      "削除・コピーした内容をカーソルの後ろに貼り付けるコマンドを入力してください。\n\n💡 `p` はカーソルの後ろ/下に、`P` はカーソルの前/上に貼り付けます。",
    category: "editing",
    difficulty: "beginner",
    type: "command-input",
    initialContent: "(yy でコピー済みの状態で)行を下に貼り付ける",
    expectedContent: "p",
    hints: [
      "`p` はカーソル位置の後ろ（行なら下）に貼り付けます",
      "`P` はカーソル位置の前（行なら上）に貼り付けます",
    ],
    acceptedAnswers: ["p"],
    suggestedCommands: ["p", "P"],
  },
  {
    id: "editing-b-3",
    title: "アンドゥ: u",
    description:
      "直前の操作を取り消すコマンドを入力してください。\n\n💡 `u` で取り消し(undo)、`Ctrl-r` でやり直し(redo)ができます。Vimのundo履歴はツリー構造で非常に強力です。",
    category: "editing",
    difficulty: "beginner",
    type: "command-input",
    initialContent: "間違って編集してしまった → 取り消したい",
    expectedContent: "u",
    hints: [
      "`u` で直前の操作を1つ取り消せます",
      "`Ctrl-r` で取り消した操作をやり直せます",
    ],
    acceptedAnswers: ["u"],
    suggestedCommands: ["u", "Ctrl-r"],
  },
  {
    id: "editing-i-1",
    title: "行の結合: J",
    description:
      "現在の行と次の行を結合するコマンドを入力してください。\n\n💡 `J` は現在の行と次の行をスペース1つで結合します。`gJ` だとスペースなしで結合します。",
    category: "editing",
    difficulty: "intermediate",
    type: "command-input",
    initialContent: "hello\nworld",
    expectedContent: "J",
    hints: [
      "`J`(大文字) で現在行と次の行を結合します",
      "結合時にスペースが1つ挿入されます",
    ],
    acceptedAnswers: ["J"],
    suggestedCommands: ["J", "gJ"],
  },
  {
    id: "editing-i-2",
    title: "ドットリピート: .",
    description:
      "直前の編集操作を繰り返すコマンドを入力してください。\n\n💡 `.`(ドット) は直前の変更操作を繰り返します。Vimで最も強力なコマンドの一つで、`ciw`→新しい単語→Esc→`n.n.n.` のように検索と組み合わせると効率的です。",
    category: "editing",
    difficulty: "intermediate",
    type: "command-input",
    initialContent:
      "foo bar foo baz foo → (ciwで置換した後に) 同じ操作を繰り返す",
    expectedContent: ".",
    hints: [
      "`.` は直前のノーマルモードの変更を繰り返します",
      "`n` で次の検索結果に移動して `.` で同じ変更を適用するパターンが強力です",
    ],
    acceptedAnswers: ["."],
    suggestedCommands: ["."],
  },

  // ===== Text Objects =====
  {
    id: "text-objects-b-1",
    title: 'ダブルクォート内を変更: ci"',
    description:
      'ダブルクォートの中身を変更するコマンドを入力してください。\n\n💡 `ci"` は "change inner double-quote" の意味です。`c` (変更) + `i` (内側) + `"` (ダブルクォート) の組み合わせです。',
    category: "text-objects",
    difficulty: "beginner",
    type: "command-input",
    initialContent: 'const msg = "hello world";',
    expectedContent: 'ci"',
    hints: [
      '`ci"` でダブルクォートの中身を削除してインサートモードに入ります',
      '`di"` だと削除のみ（インサートモードに入らない）',
      '`vi"` だと中身を選択（ビジュアルモード）',
    ],
    acceptedAnswers: ['ci"'],
    suggestedCommands: ['ci"', 'di"', 'vi"', 'ca"'],
  },
  {
    id: "text-objects-b-2",
    title: "単語を削除: diw",
    description:
      'カーソル位置の単語を削除するコマンドを入力してください。\n\n💡 `diw` は "delete inner word" です。`daw` だと周囲の空白も含めて削除します。',
    category: "text-objects",
    difficulty: "beginner",
    type: "command-input",
    initialContent: "hello beautiful world",
    expectedContent: "diw",
    hints: [
      "`diw` で現在の単語を削除します（空白は残る）",
      "`daw` だと周囲の空白も含めて削除します",
      "`ciw` だと削除してインサートモードに入ります",
    ],
    acceptedAnswers: ["diw"],
    suggestedCommands: ["diw", "daw", "ciw", "caw"],
  },
  {
    id: "text-objects-i-1",
    title: "括弧内を変更: ci(",
    description:
      "括弧の中身を変更するコマンドを入力してください。\n\n💡 `ci(` は括弧の中身を削除してインサートモードに入ります。`ca(` だと括弧自体も含めます。`ci)` も同じ動作です。",
    category: "text-objects",
    difficulty: "intermediate",
    type: "command-input",
    initialContent: "console.log(oldValue, extraArg);",
    expectedContent: "ci(",
    hints: [
      "`ci(` で括弧の中身を削除してインサートモードに入ります",
      "`ci)` でも同じ結果になります",
      "カーソルは括弧の中にある必要があります",
    ],
    acceptedAnswers: ["ci(", "ci)"],
    suggestedCommands: ["ci(", "ca(", "di(", "da("],
  },
  {
    id: "text-objects-i-2",
    title: "段落を選択: vap",
    description:
      '段落全体をビジュアルモードで選択するコマンドを入力してください。\n\n💡 `ap` は "a paragraph" です。段落は空行で区切られたテキストブロックです。`ip` だと前後の空行を含みません。',
    category: "text-objects",
    difficulty: "intermediate",
    type: "command-input",
    initialContent:
      "First paragraph\nwith multiple lines.\n\nSecond paragraph\nalso multiple lines.",
    expectedContent: "vap",
    hints: [
      "`vap` でビジュアルモードに入り段落全体を選択します",
      "`dap` で段落を削除、`yap` でコピーもできます",
    ],
    acceptedAnswers: ["vap"],
    suggestedCommands: ["vap", "vip", "dap", "yap"],
  },

  // ===== Search & Replace =====
  {
    id: "search-replace-b-1",
    title: "前方検索: /",
    description:
      "ファイル内で 'error' を前方検索するコマンドを入力してください。\n\n💡 `/pattern` で前方検索、`?pattern` で後方検索。`n` で次の結果、`N` で前の結果に移動します。",
    category: "search-replace",
    difficulty: "beginner",
    type: "command-input",
    initialContent:
      "const result = process();\nif (result.error) {\n  handleError(result.error);\n}",
    expectedContent: "/error",
    hints: [
      "`/error` と入力してEnterで 'error' を検索します",
      "`n` で次のマッチ、`N` で前のマッチに移動できます",
    ],
    acceptedAnswers: ["/error"],
    suggestedCommands: ["/", "?", "n", "N", "*", "#"],
  },
  {
    id: "search-replace-b-2",
    title: "カーソル下の単語を検索: *",
    description:
      "カーソル位置の単語を前方検索するコマンドを入力してください。\n\n💡 `*` はカーソル下の単語を前方検索します。`#` は後方検索です。単語境界つきで検索されるので完全一致します。",
    category: "search-replace",
    difficulty: "beginner",
    type: "command-input",
    initialContent: "const value = getValue();\nreturn value;",
    expectedContent: "*",
    hints: [
      "`*` でカーソル下の単語を前方検索します",
      "`#` は後方検索です",
      "単語境界 `\\<` `\\>` が自動的に付きます",
    ],
    acceptedAnswers: ["*"],
    suggestedCommands: ["*", "#"],
  },
  {
    id: "search-replace-i-1",
    title: "全置換: :%s",
    description:
      "ファイル全体で 'foo' を 'bar' に置換するコマンドを入力してください。\n\n💡 `:%s/old/new/g` でファイル全体を置換します。`%` は全行、`g` は行内の全マッチを意味します。`c` フラグで確認付き置換になります。",
    category: "search-replace",
    difficulty: "intermediate",
    type: "command-input",
    initialContent: "foo = getFoo();\nlog(foo);\nreturn foo;",
    expectedContent: ":%s/foo/bar/g",
    hints: [
      "`:%s/foo/bar/g` でファイル全体の foo を bar に置換します",
      "`%` なしだと現在行のみ、`g` なしだと各行の最初のマッチのみ",
      "`gc` フラグで1つずつ確認しながら置換できます",
    ],
    acceptedAnswers: [":%s/foo/bar/g"],
    suggestedCommands: [":%s///g", ":%s///gc"],
  },
  {
    id: "search-replace-i-2",
    title: "cgn で検索＆置換",
    description:
      "検索結果を1つずつ置換する `cgn` の使い方：まず `/old` で検索 → `cgn` → 新しいテキスト → Esc → `.` で次を置換。\n\n`cgn` を入力してください。",
    category: "search-replace",
    difficulty: "intermediate",
    type: "command-input",
    initialContent:
      "/old で検索済みの状態で、次のマッチを変更してインサートモードに入る",
    expectedContent: "cgn",
    hints: [
      "`cgn` = change + gn (次の検索マッチを選択して変更)",
      "`.` で同じ操作を繰り返し、`n` でスキップできます",
      ":%s よりも柔軟：1つずつ確認しながら置換できます",
    ],
    acceptedAnswers: ["cgn"],
    suggestedCommands: ["cgn", "dgn"],
  },

  // ===== Visual Mode =====
  {
    id: "visual-mode-b-1",
    title: "行ビジュアルモード: V",
    description:
      "行単位でビジュアルモードに入るコマンドを入力してください。\n\n💡 `v` は文字単位、`V` は行単位、`Ctrl-v` は矩形（ブロック）選択です。",
    category: "visual-mode",
    difficulty: "beginner",
    type: "command-input",
    initialContent: "line 1\nline 2\nline 3",
    expectedContent: "V",
    hints: [
      "`V`（大文字）で行ビジュアルモードに入ります",
      "`j`/`k` で選択範囲を上下に拡大できます",
      "選択後に `d` で削除、`y` でコピーなど",
    ],
    acceptedAnswers: ["V"],
    suggestedCommands: ["v", "V", "Ctrl-v"],
  },
  {
    id: "visual-mode-i-1",
    title: "矩形選択: Ctrl-v",
    description:
      "矩形（ブロック）ビジュアルモードに入るコマンドを入力してください。\n\n💡 `Ctrl-v` で矩形選択モードに入り、`I` で選択範囲の各行の先頭に一括挿入、`A` で末尾に一括追加ができます。",
    category: "visual-mode",
    difficulty: "intermediate",
    type: "command-input",
    initialContent:
      "item1\nitem2\nitem3\nitem4\n\n→ 各行の先頭に '- ' を追加したい",
    expectedContent: "Ctrl-v",
    hints: [
      "`Ctrl-v` で矩形ビジュアルモードに入ります",
      "`j` で下に選択を広げて `I` で各行の先頭に挿入できます",
      "Escを押すと全行に変更が反映されます",
    ],
    acceptedAnswers: ["Ctrl-v", "<C-v>"],
    suggestedCommands: ["Ctrl-v", "I", "A"],
  },

  // ===== Registers =====
  {
    id: "registers-b-1",
    title: '名前付きレジスタにコピー: "ayy',
    description:
      '現在の行をレジスタ `a` にコピーするコマンドを入力してください。\n\n💡 `"ayy` で「レジスタaに現在行をヤンク」します。`"ap` でレジスタaの内容を貼り付けます。レジスタは a-z の26個使えます。',
    category: "registers",
    difficulty: "beginner",
    type: "command-input",
    initialContent: "この行をレジスタ a にコピーしたい",
    expectedContent: '"ayy',
    hints: [
      '`"a` でレジスタaを指定、`yy` で行をヤンク',
      '大文字 `"Ayy` だとレジスタaに追記します',
      "`:reg` で全レジスタの中身を確認できます",
    ],
    acceptedAnswers: ['"ayy'],
    suggestedCommands: ['"ayy', '"ap', '"+y', ":reg"],
  },
  {
    id: "registers-i-1",
    title: 'システムクリップボードにコピー: "+y',
    description:
      '選択範囲をシステムクリップボードにコピーするコマンドを入力してください。\n\n💡 `"+` はシステムクリップボードレジスタです。`"+y` でコピー、`"+p` で貼り付け。他のアプリとの間でコピペできます。',
    category: "registers",
    difficulty: "intermediate",
    type: "command-input",
    initialContent:
      "ビジュアルモードで選択済みの状態で → クリップボードにコピー",
    expectedContent: '"+y',
    hints: [
      '`"+y` でシステムクリップボードにヤンクします',
      '`"+p` でシステムクリップボードから貼り付けます',
      '`"*` も同様にクリップボードを指します（OS依存）',
    ],
    acceptedAnswers: ['"+y'],
    suggestedCommands: ['"+y', '"+p', '"*y'],
  },

  // ===== Macros =====
  {
    id: "macros-b-1",
    title: "マクロの記録開始: qq",
    description:
      "レジスタ `q` にマクロの記録を開始するコマンドを入力してください。\n\n💡 `qq` でマクロ記録開始 → 操作 → `q` で記録終了 → `@q` で再生。`@@` で直前のマクロを再生、`100@q` で100回繰り返します。",
    category: "macros",
    difficulty: "beginner",
    type: "command-input",
    initialContent: "マクロを記録してレジスタ q に保存する",
    expectedContent: "qq",
    hints: [
      "`qq` でレジスタqへのマクロ記録を開始します",
      "記録中は左下に 'recording @q' と表示されます",
      "もう一度 `q` を押すと記録終了です",
    ],
    acceptedAnswers: ["qq"],
    suggestedCommands: ["qq", "q", "@q", "@@"],
  },
  {
    id: "macros-i-1",
    title: "マクロの再生: @q",
    description:
      "レジスタ `q` に記録したマクロを再生するコマンドを入力してください。\n\n💡 `@q` で再生、`@@` で直前に実行したマクロを再生、`5@q` で5回繰り返し実行します。",
    category: "macros",
    difficulty: "intermediate",
    type: "command-input",
    initialContent: "記録済みマクロを再生する",
    expectedContent: "@q",
    hints: [
      "`@q` でレジスタqのマクロを1回再生します",
      "`@@` で直前に実行したマクロを再生します",
      "数字をつけて `100@q` で100回繰り返せます",
    ],
    acceptedAnswers: ["@q"],
    suggestedCommands: ["@q", "@@", "100@q"],
  },

  // ===== Marks =====
  {
    id: "marks-b-1",
    title: "マークを設定: ma",
    description:
      "現在のカーソル位置にマーク `a` を設定するコマンドを入力してください。\n\n💡 `ma` でマーク設定、`'a` でその行に移動、`` `a `` で正確な位置に移動します。小文字はファイル内、大文字はグローバルマークです。",
    category: "marks",
    difficulty: "beginner",
    type: "command-input",
    initialContent: "ここにマークを設定して後で戻ってこれるようにする",
    expectedContent: "ma",
    hints: [
      "`ma` で現在位置にマーク a を設定します",
      "`'a` でマーク a の行に移動できます",
      "`` `a `` で行+列の正確な位置に移動します",
    ],
    acceptedAnswers: ["ma"],
    suggestedCommands: ["ma", "'a", "`a", ":marks"],
  },

  // ===== Windows & Buffers =====
  {
    id: "windows-buffers-b-1",
    title: "ウィンドウを水平分割: Ctrl-w s",
    description:
      "ウィンドウを水平方向に分割するコマンドを入力してください。\n\n💡 `Ctrl-w s` で水平分割、`Ctrl-w v` で垂直分割。`Ctrl-w h/j/k/l` でウィンドウ間を移動します。",
    category: "windows-buffers",
    difficulty: "beginner",
    type: "command-input",
    initialContent: "現在のウィンドウを上下に分割する",
    expectedContent: "Ctrl-w s",
    hints: [
      "`Ctrl-w s` (split) で水平分割します",
      "`:sp` でも同じ操作ができます",
      "`Ctrl-w v` で垂直分割（`:vs`）です",
    ],
    acceptedAnswers: ["Ctrl-w s", "<C-w>s", ":sp", ":split"],
    suggestedCommands: ["Ctrl-w s", "Ctrl-w v", "Ctrl-w h", "Ctrl-w j"],
  },

  // ===== Ex Commands =====
  {
    id: "ex-commands-b-1",
    title: "保存: :w",
    description:
      "ファイルを保存するExコマンドを入力してください。\n\n💡 `:w` で保存、`:q` で閉じる、`:wq` で保存して閉じる、`:q!` で保存せず強制終了です。",
    category: "ex-commands",
    difficulty: "beginner",
    type: "command-input",
    initialContent: "編集した内容を保存する",
    expectedContent: ":w",
    hints: [
      "`:w` (write) でファイルを保存します",
      "`:wq` で保存して閉じる、`ZZ` も同じです",
      "`:w filename` で別名保存もできます",
    ],
    acceptedAnswers: [":w"],
    suggestedCommands: [":w", ":wq", ":q", ":q!"],
  },
  {
    id: "ex-commands-i-1",
    title: "行のソート: :sort",
    description:
      "選択範囲（またはファイル全体）の行をアルファベット順にソートするコマンドを入力してください。\n\n💡 `:sort` で昇順ソート、`:sort!` で降順、`:sort u` で重複削除つきソート、`:sort n` で数値ソートです。",
    category: "ex-commands",
    difficulty: "intermediate",
    type: "command-input",
    initialContent: "cherry\napple\nbanana\ndate",
    expectedContent: ":sort",
    hints: [
      "`:sort` で行をアルファベット順に並べ替えます",
      "`:sort!` で逆順ソート",
      "`:sort u` で重複行を除去しながらソート",
    ],
    acceptedAnswers: [":sort"],
    suggestedCommands: [":sort", ":sort!", ":sort u", ":sort n"],
  },

  // ===== Telescope =====
  {
    id: "telescope-b-1",
    title: "ファイル検索: <leader>ff",
    description:
      "Telescopeでファイルをファジー検索するコマンドを入力してください。\n\n💡 `<leader>ff` (find files) でプロジェクト内のファイルを名前で検索します。<leader>はSpaceキーに設定されていることが多いです。",
    category: "telescope",
    difficulty: "beginner",
    type: "command-input",
    initialContent:
      "Telescopeのファジーファインダーでファイルを検索する\n<leader>は通常 Space キー",
    expectedContent: "<leader>ff",
    hints: [
      "`<leader>ff` でファイル検索を開きます",
      "<leader>は多くの設定でSpaceキーです",
      "入力するとリアルタイムで候補が絞られます",
    ],
    acceptedAnswers: ["<leader>ff", "<Space>ff"],
    suggestedCommands: ["<leader>ff", "<leader>fg", "<leader>fb"],
  },
  {
    id: "telescope-i-1",
    title: "grep検索: <leader>fg",
    description:
      "Telescopeでプロジェクト全体のテキストをgrep検索するコマンドを入力してください。\n\n💡 `<leader>fg` (find grep) でファイル内容をリアルタイム検索します。ripgrepが必要です。",
    category: "telescope",
    difficulty: "intermediate",
    type: "command-input",
    initialContent: "プロジェクト全体のソースコードからテキストを検索する",
    expectedContent: "<leader>fg",
    hints: [
      "`<leader>fg` でlive grepを開きます",
      "ファイル名ではなく中身を検索します",
      "内部的にripgrep(rg)を使用しています",
    ],
    acceptedAnswers: ["<leader>fg", "<Space>fg"],
    suggestedCommands: ["<leader>fg", "<leader>ff"],
  },

  // ===== Neo-tree =====
  {
    id: "neo-tree-b-1",
    title: "新規ファイル作成: a",
    description:
      "Neo-treeでファイルを新規作成するキーを入力してください。\n\n💡 Neo-treeのファイルツリー上で `a` を押すとファイル/フォルダの新規作成ダイアログが開きます。末尾に `/` をつけるとフォルダになります。",
    category: "neo-tree",
    difficulty: "beginner",
    type: "command-input",
    initialContent: "Neo-treeのファイルツリーで新しいファイルを作成する",
    expectedContent: "a",
    hints: [
      "Neo-tree上で `a` を押すと作成ダイアログが開きます",
      "末尾に `/` をつけるとディレクトリを作成します",
      "`d` で削除、`r` でリネームです",
    ],
    acceptedAnswers: ["a"],
    suggestedCommands: ["a", "d", "r", "c", "m"],
  },

  // ===== LSP =====
  {
    id: "lsp-b-1",
    title: "定義にジャンプ: gd",
    description:
      "カーソル下のシンボルの定義にジャンプするコマンドを入力してください。\n\n💡 `gd` (go to definition) で関数や変数の定義場所にジャンプします。`Ctrl-o` で元の場所に戻れます。",
    category: "lsp",
    difficulty: "beginner",
    type: "command-input",
    initialContent:
      "const result = calculateTotal(items);\n// calculateTotal の定義を見たい",
    expectedContent: "gd",
    hints: [
      "`gd` でカーソル下のシンボルの定義にジャンプします",
      "`Ctrl-o` で元の位置に戻れます",
      "`gr` で参照（usages）を検索できます",
    ],
    acceptedAnswers: ["gd"],
    suggestedCommands: ["gd", "gr", "K", "gi"],
  },
  {
    id: "lsp-i-1",
    title: "ホバードキュメント: K",
    description:
      "カーソル下のシンボルのドキュメント（型情報など）を表示するコマンドを入力してください。\n\n💡 `K` でホバー情報（型、ドキュメント、シグネチャなど）がフローティングウィンドウに表示されます。",
    category: "lsp",
    difficulty: "intermediate",
    type: "command-input",
    initialContent:
      "const result: string = getValue();\n// getValue の型情報を見たい",
    expectedContent: "K",
    hints: [
      "`K` でカーソル下のシンボルのドキュメントを表示します",
      "もう一度 `K` を押すとフローティングウィンドウに入れます",
      "関数のシグネチャや型情報が確認できます",
    ],
    acceptedAnswers: ["K"],
    suggestedCommands: ["K", "gd", "gr"],
  },

  // ===== Ghostty =====
  {
    id: "ghostty-b-1",
    title: "ペインの垂直分割: Cmd+D",
    description:
      "Ghosttyでペインを垂直方向に分割するショートカットを入力してください。\n\n💡 `Cmd+D` で垂直分割、`Cmd+Shift+D` で水平分割。ペイン間は `Cmd+[` / `Cmd+]` や `Cmd+Option+矢印` で移動できます。",
    category: "ghostty",
    difficulty: "beginner",
    type: "command-input",
    initialContent: "Ghosttyでターミナルを垂直に分割する",
    expectedContent: "Cmd+D",
    hints: [
      "`Cmd+D` でペインを垂直分割します",
      "`Cmd+Shift+D` で水平分割です",
      "ペインは `Cmd+W` で閉じられます",
    ],
    acceptedAnswers: ["Cmd+D"],
    suggestedCommands: ["Cmd+D", "Cmd+Shift+D", "Cmd+T"],
  },
  {
    id: "ghostty-b-2",
    title: "新しいタブ: Cmd+T",
    description:
      "Ghosttyで新しいタブを開くショートカットを入力してください。\n\n💡 `Cmd+T` で新しいタブを開きます。`Cmd+Shift+[` / `Cmd+Shift+]` でタブを切り替えます。",
    category: "ghostty",
    difficulty: "beginner",
    type: "command-input",
    initialContent: "Ghosttyで新しいタブを開く",
    expectedContent: "Cmd+T",
    hints: [
      "`Cmd+T` で新しいタブを開きます",
      "`Cmd+Shift+[` で前のタブ、`Cmd+Shift+]` で次のタブ",
      "`Cmd+W` でタブを閉じます",
    ],
    acceptedAnswers: ["Cmd+T"],
    suggestedCommands: ["Cmd+T", "Cmd+Shift+[", "Cmd+Shift+]"],
  },

  // ===== Claude Code =====
  {
    id: "claude-code-b-1",
    title: "ヘルプ: /help",
    description:
      "Claude Codeのヘルプを表示するコマンドを入力してください。\n\n💡 `/help` で利用可能なスラッシュコマンド一覧を表示します。`/clear` で会話履歴をリセット、`/compact` でコンテキストを圧縮します。",
    category: "claude-code",
    difficulty: "beginner",
    type: "command-input",
    initialContent: "Claude Codeのスラッシュコマンド一覧を見る",
    expectedContent: "/help",
    hints: [
      "`/help` でコマンド一覧が表示されます",
      "スラッシュコマンドは `/` で始まります",
      "`/clear` で会話をリセットできます",
    ],
    acceptedAnswers: ["/help"],
    suggestedCommands: ["/help", "/clear", "/compact", "/commit"],
  },
  {
    id: "claude-code-b-2",
    title: "コミット作成: /commit",
    description:
      "Claude Codeでgitコミットを作成するコマンドを入力してください。\n\n💡 `/commit` でステージングされた変更のコミットメッセージを自動生成して提案してくれます。",
    category: "claude-code",
    difficulty: "beginner",
    type: "command-input",
    initialContent: "Claude Codeにコミットメッセージを自動生成してもらう",
    expectedContent: "/commit",
    hints: [
      "`/commit` でAIがdiffを分析してコミットメッセージを生成します",
      "事前に `git add` でステージングしておく必要があります",
    ],
    acceptedAnswers: ["/commit"],
    suggestedCommands: ["/commit", "/review-pr"],
  },
  {
    id: "claude-code-i-1",
    title: "コンテキスト圧縮: /compact",
    description:
      "Claude Codeの会話コンテキストを圧縮するコマンドを入力してください。\n\n💡 `/compact` で長くなった会話を要約して圧縮します。トークン制限に近づいた時に使うと効果的です。",
    category: "claude-code",
    difficulty: "intermediate",
    type: "command-input",
    initialContent:
      "長い会話でコンテキストウィンドウが圧迫されてきた → 圧縮したい",
    expectedContent: "/compact",
    hints: [
      "`/compact` で会話履歴を圧縮します",
      "重要な情報は保持しつつトークン使用量を削減します",
      "会話が長くなってきたら使うと良いです",
    ],
    acceptedAnswers: ["/compact"],
    suggestedCommands: ["/compact", "/clear"],
  },

  // ===== Workflow =====
  {
    id: "workflow-b-1",
    title: "バグ修正ワークフロー",
    description:
      "バグを見つけて修正する典型的なVimワークフロー。最初のステップとして、エラーメッセージを検索するコマンドを入力してください。\n\n💡 実践ワークフロー: `/error` で検索 → `gd` で定義に飛ぶ → `ciw` で修正 → `:w` で保存",
    category: "workflow",
    difficulty: "beginner",
    type: "command-input",
    initialContent:
      "1. エラーメッセージを検索する (/error)\n2. 定義にジャンプする (gd)\n3. 単語を変更する (ciw)\n4. 保存する (:w)",
    expectedContent: "/error",
    hints: [
      "ワークフローの最初のステップ: `/error` で検索します",
      "次に `n` で検索結果を巡り、`gd` で定義に飛びます",
      "修正には `ciw` (change inner word) が便利です",
    ],
    acceptedAnswers: ["/error"],
    suggestedCommands: ["/error", "gd", "ciw", ":w"],
  },
];

/**
 * カテゴリと難易度でフィルタリングして取得
 */
export function getBuiltinChallenges(
  category: string,
  difficulty?: string,
): Challenge[] {
  let filtered = builtinChallenges.filter((c) => c.category === category);
  if (difficulty) {
    filtered = filtered.filter((c) => c.difficulty === difficulty);
  }
  return filtered;
}

/**
 * カテゴリからランダムにチャレンジを1つ取得
 */
export function getRandomBuiltinChallenge(
  category: string,
  difficulty?: string,
  excludeIds?: string[],
): Challenge | null {
  let candidates = getBuiltinChallenges(category, difficulty);
  if (excludeIds?.length) {
    candidates = candidates.filter((c) => !excludeIds.includes(c.id));
  }
  if (candidates.length === 0) {
    // 難易度を無視してフォールバック
    candidates = getBuiltinChallenges(category);
    if (excludeIds?.length) {
      candidates = candidates.filter((c) => !excludeIds.includes(c.id));
    }
  }
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}
