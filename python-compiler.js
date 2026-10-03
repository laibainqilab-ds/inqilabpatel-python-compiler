/*!
 * Python Compiler for inqilabpatel.com  (python-compiler.js, version 1)
 * ---------------------------------------------------------------------------------
 * Runs real Python 3.14 (Pyodide) entirely in the student's browser.
 * Nothing is sent to the WordPress server.
 *
 * How it is used: the Elementor HTML widget contains only
 *     <div class="python-compiler-workspace" data-pcw-mount>...</div>
 *     <script src=".../python-compiler.js" defer></script>
 * This file adds the compiler's styles, fills that placeholder with the compiler's
 * layout, and then starts the compiler.
 *
 * Plain browser JavaScript: no build step, npm, Node or React needed.
 */

/* ---------- Part 1: styles and layout (moved here from the Elementor widget, unchanged) ---------- */
(function () {
    "use strict";

    var PCW_STYLES = `
/* ===== Python Compiler Workspace (python-compiler-v1) — every rule is scoped to .python-compiler-workspace ===== */
.python-compiler-workspace {
    --pcw-navy: #0f1b2d;
    --pcw-navy-2: #16263d;
    --pcw-blue: #3776ab;
    --pcw-blue-light: #5a9fd4;
    --pcw-yellow: #ffd43b;
    --pcw-editor-bg: #0d1117;
    --pcw-gutter-bg: #0a0e14;
    --pcw-terminal-bg: #0b1220;
    --pcw-border: #24344d;
    --pcw-text: #e6edf3;
    --pcw-muted: #8b9bb4;
    --pcw-error: #ff7b72;
    --pcw-success: #7ee787;
    --pcw-code-font: "JetBrains Mono", "Fira Code", "Cascadia Code", Consolas, "SFMono-Regular", Menlo, "Liberation Mono", monospace;
    --pcw-ui-font: "Segoe UI", system-ui, -apple-system, Roboto, Helvetica, Arial, sans-serif;
    --pcw-font-size: 15px;
    --pcw-line-height: 22px;
    box-sizing: border-box;
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;
    padding: 0;
    font-family: var(--pcw-ui-font);
    color: var(--pcw-text);
    text-align: left;
}
.python-compiler-workspace *,
.python-compiler-workspace *::before,
.python-compiler-workspace *::after { box-sizing: border-box; }

.python-compiler-workspace .pcw-shell {
    background: var(--pcw-navy);
    border: 1px solid var(--pcw-border);
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(15, 27, 45, 0.25);
}

/* ----- header ----- */
.python-compiler-workspace .pcw-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    padding: 16px 20px;
    background: linear-gradient(135deg, var(--pcw-navy-2) 0%, var(--pcw-navy) 100%);
    border-bottom: 3px solid var(--pcw-yellow);
}
.python-compiler-workspace .pcw-brand { display: flex; align-items: center; gap: 12px; min-width: 0; }
.python-compiler-workspace .pcw-logo {
    width: 40px; height: 40px; flex: 0 0 40px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, var(--pcw-blue) 0%, var(--pcw-blue) 50%, var(--pcw-yellow) 50%, var(--pcw-yellow) 100%);
    color: var(--pcw-navy);
    font: 700 15px/1 var(--pcw-code-font);
}
.python-compiler-workspace .pcw-title {
    margin: 0 !important;
    padding: 0 !important;
    font: 700 21px/1.2 var(--pcw-ui-font) !important;
    color: #ffffff !important;
    letter-spacing: 0.2px;
    text-transform: none !important;
}
.python-compiler-workspace .pcw-subtitle {
    margin: 2px 0 0 0 !important;
    padding: 0 !important;
    font: 400 13px/1.4 var(--pcw-ui-font) !important;
    color: var(--pcw-muted) !important;
}
.python-compiler-workspace .pcw-status {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 12px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid var(--pcw-border);
    font: 600 12.5px/1.2 var(--pcw-ui-font);
    color: var(--pcw-muted);
    white-space: nowrap;
}
.python-compiler-workspace .pcw-status-dot { width: 8px; height: 8px; border-radius: 50%; background: #5c6b82; flex: 0 0 8px; }
.python-compiler-workspace .pcw-status[data-state="loading"] .pcw-status-dot,
.python-compiler-workspace .pcw-status[data-state="running"] .pcw-status-dot { background: var(--pcw-yellow); animation: pcw-pulse 1s ease-in-out infinite; }
.python-compiler-workspace .pcw-status[data-state="waiting"] .pcw-status-dot { background: var(--pcw-blue-light); animation: pcw-pulse 1.4s ease-in-out infinite; }
.python-compiler-workspace .pcw-status[data-state="ready"] .pcw-status-dot { background: var(--pcw-success); }
.python-compiler-workspace .pcw-status[data-state="error"] .pcw-status-dot { background: var(--pcw-error); }
@keyframes pcw-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

/* ----- editor ----- */
.python-compiler-workspace .pcw-section-label {
    display: flex; align-items: center; justify-content: space-between; gap: 10px;
    padding: 10px 20px 8px;
    font: 700 11.5px/1.2 var(--pcw-ui-font);
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: var(--pcw-muted);
}
.python-compiler-workspace .pcw-section-label span:last-child { font-weight: 500; letter-spacing: 0.2px; text-transform: none; }
.python-compiler-workspace .pcw-editor {
    position: relative;
    display: flex;
    height: 400px;
    min-height: 180px;
    margin: 0 20px;
    border: 1px solid var(--pcw-border);
    border-radius: 10px;
    overflow: hidden;
    resize: vertical;
    background: var(--pcw-editor-bg);
}
.python-compiler-workspace .pcw-editor:focus-within { border-color: var(--pcw-blue-light); box-shadow: 0 0 0 3px rgba(90, 159, 212, 0.25); }
.python-compiler-workspace .pcw-gutter {
    position: relative;
    flex: 0 0 auto;
    min-width: 46px;
    overflow: hidden;
    background: var(--pcw-gutter-bg);
    border-right: 1px solid #1b2636;
    user-select: none;
}
.python-compiler-workspace .pcw-gutter-inner {
    padding: 14px 10px 14px 12px;
    font-family: var(--pcw-code-font);
    font-size: var(--pcw-font-size);
    line-height: var(--pcw-line-height);
    color: #4a5a72;
    text-align: right;
    will-change: transform;
}
.python-compiler-workspace .pcw-gutter-inner div { height: var(--pcw-line-height); }
.python-compiler-workspace .pcw-gutter-inner div.pcw-error-line { color: #ffffff; background: rgba(255, 123, 114, 0.35); border-radius: 4px; margin: 0 -6px; padding: 0 6px; }
.python-compiler-workspace .pcw-code { position: relative; flex: 1 1 auto; overflow: hidden; }
.python-compiler-workspace .pcw-highlight,
.python-compiler-workspace .pcw-textarea {
    margin: 0 !important;
    border: 0 !important;
    border-radius: 0 !important;
    padding: 14px 16px !important;
    font-family: var(--pcw-code-font) !important;
    font-size: var(--pcw-font-size) !important;
    font-weight: 400 !important;
    font-style: normal !important;
    line-height: var(--pcw-line-height) !important;
    letter-spacing: 0 !important;
    word-spacing: 0 !important;
    text-transform: none !important;
    text-indent: 0 !important;
    font-variant-ligatures: none !important;
    tab-size: 4 !important;
    -moz-tab-size: 4 !important;
    white-space: pre !important;
    word-wrap: normal !important;
    overflow-wrap: normal !important;
    box-shadow: none !important;
}
.python-compiler-workspace .pcw-highlight {
    position: absolute;
    top: 0; left: 0;
    min-width: 100%;
    min-height: 100%;
    background: transparent !important;
    color: var(--pcw-text) !important;
    pointer-events: none;
    will-change: transform;
}
.python-compiler-workspace .pcw-textarea {
    position: absolute;
    top: 0; left: 0;
    width: 100% !important;
    height: 100% !important;
    max-width: none !important;
    min-height: 0 !important;
    display: block !important;
    background: transparent !important;
    color: transparent !important;
    -webkit-text-fill-color: transparent !important;
    caret-color: var(--pcw-yellow) !important;
    outline: none !important;
    resize: none !important;
    overflow: auto !important;
}
.python-compiler-workspace .pcw-textarea::selection { background: rgba(90, 159, 212, 0.45); -webkit-text-fill-color: transparent; }
/* syntax colours */
.python-compiler-workspace .pcw-tok-kw { color: #c792ea; }
.python-compiler-workspace .pcw-tok-const { color: #ff9cac; }
.python-compiler-workspace .pcw-tok-builtin { color: #82aaff; }
.python-compiler-workspace .pcw-tok-str { color: #c3e88d; }
.python-compiler-workspace .pcw-tok-num { color: #f78c6c; }
.python-compiler-workspace .pcw-tok-com { color: #6a7f99; font-style: italic; }
.python-compiler-workspace .pcw-tok-def { color: #ffcb6b; }
.python-compiler-workspace .pcw-tok-self { color: #f07178; }

.python-compiler-workspace .pcw-hint {
    margin: 8px 20px 0 !important;
    padding: 0 !important;
    font: 400 12.5px/1.5 var(--pcw-ui-font) !important;
    color: var(--pcw-muted) !important;
}
.python-compiler-workspace .pcw-hint kbd {
    display: inline-block;
    padding: 0 5px;
    border: 1px solid var(--pcw-border);
    border-bottom-width: 2px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.05);
    font: 600 11.5px/1.5 var(--pcw-code-font);
    color: var(--pcw-text);
}

/* ----- buttons ----- */
.python-compiler-workspace .pcw-toolbar {
    display: flex; flex-wrap: wrap; align-items: center; gap: 10px;
    padding: 14px 20px 4px;
}
.python-compiler-workspace button.pcw-btn {
    all: unset;
    box-sizing: border-box !important;
    display: inline-flex !important;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 42px;
    padding: 0 18px !important;
    border-radius: 9px !important;
    border: 1px solid var(--pcw-border) !important;
    background: var(--pcw-navy-2) !important;
    color: var(--pcw-text) !important;
    font: 600 14.5px/1 var(--pcw-ui-font) !important;
    letter-spacing: 0.2px;
    text-transform: none !important;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.15s ease, border-color 0.15s ease, transform 0.05s ease;
}
.python-compiler-workspace button.pcw-btn:hover { background: #1e3352 !important; border-color: #33507a !important; }
.python-compiler-workspace button.pcw-btn:active { transform: translateY(1px); }
.python-compiler-workspace button.pcw-btn:focus-visible { outline: 3px solid var(--pcw-yellow) !important; outline-offset: 2px; }
.python-compiler-workspace button.pcw-btn[disabled] { opacity: 0.5; cursor: not-allowed; }
.python-compiler-workspace button.pcw-btn-run {
    background: var(--pcw-yellow) !important;
    border-color: var(--pcw-yellow) !important;
    color: var(--pcw-navy) !important;
    padding: 0 24px !important;
    font-weight: 700 !important;
}
.python-compiler-workspace button.pcw-btn-run:hover { background: #ffe066 !important; border-color: #ffe066 !important; }
.python-compiler-workspace button.pcw-btn-stop { background: #3a1d24 !important; border-color: #6e2f3a !important; color: #ffb3ad !important; }
.python-compiler-workspace button.pcw-btn-stop:hover { background: #4a222b !important; }
.python-compiler-workspace button.pcw-btn[hidden] { display: none !important; }
.python-compiler-workspace .pcw-note {
    flex: 1 1 200px;
    min-height: 18px;
    font: 500 13px/1.4 var(--pcw-ui-font);
    color: var(--pcw-muted);
}
.python-compiler-workspace .pcw-note:empty { flex-basis: 0; min-height: 0; }
.python-compiler-workspace .pcw-note[data-tone="error"] { color: var(--pcw-error); }
.python-compiler-workspace .pcw-note[data-tone="ok"] { color: var(--pcw-success); }

/* ----- output terminal ----- */
.python-compiler-workspace .pcw-terminal {
    margin: 0 20px;
    border: 1px solid var(--pcw-border);
    border-radius: 10px;
    background: var(--pcw-terminal-bg);
    overflow: hidden;
}
.python-compiler-workspace .pcw-output {
    display: block !important;
    margin: 0 !important;
    padding: 14px 16px !important;
    min-height: 140px;
    max-height: 340px;
    overflow: auto !important;
    background: transparent !important;
    border: 0 !important;
    border-radius: 0 !important;
    font-family: var(--pcw-code-font) !important;
    font-size: 14.5px !important;
    line-height: 21px !important;
    color: var(--pcw-text) !important;
    white-space: pre-wrap !important;
    word-break: break-word;
    tab-size: 4;
}
.python-compiler-workspace .pcw-out-stdin { color: var(--pcw-yellow); font-weight: 600; }
.python-compiler-workspace .pcw-out-stderr { color: var(--pcw-error); }
.python-compiler-workspace .pcw-out-system { color: var(--pcw-muted); font-style: italic; }
.python-compiler-workspace .pcw-out-system-error { color: var(--pcw-error); font-style: italic; }
.python-compiler-workspace .pcw-out-done { color: var(--pcw-success); font-style: italic; }
.python-compiler-workspace .pcw-out-placeholder { color: #4a5a72; }
.python-compiler-workspace .pcw-input-row {
    display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
    padding: 10px 12px;
    border-top: 1px dashed var(--pcw-border);
    background: rgba(255, 212, 59, 0.06);
}
.python-compiler-workspace .pcw-input-row[hidden] { display: none !important; }
.python-compiler-workspace .pcw-input-label { font: 600 13px/1.2 var(--pcw-ui-font); color: var(--pcw-yellow); white-space: nowrap; }
.python-compiler-workspace input.pcw-input-field {
    flex: 1 1 180px;
    min-width: 0;
    height: 38px !important;
    margin: 0 !important;
    padding: 0 12px !important;
    border: 1px solid #5a4b16 !important;
    border-radius: 8px !important;
    background: #0d1117 !important;
    color: var(--pcw-text) !important;
    font-family: var(--pcw-code-font) !important;
    font-size: 14.5px !important;
    line-height: 38px !important;
    box-shadow: none !important;
    outline: none !important;
}
.python-compiler-workspace input.pcw-input-field:focus { border-color: var(--pcw-yellow) !important; box-shadow: 0 0 0 3px rgba(255, 212, 59, 0.2) !important; }
.python-compiler-workspace button.pcw-btn-small { min-height: 38px; padding: 0 14px !important; font-size: 13.5px !important; }

/* ----- examples ----- */
.python-compiler-workspace .pcw-examples { display: flex; flex-wrap: wrap; gap: 8px; padding: 0 20px 20px; }
.python-compiler-workspace button.pcw-example {
    all: unset;
    box-sizing: border-box !important;
    display: inline-flex !important;
    align-items: center;
    min-height: 34px;
    padding: 0 14px !important;
    border-radius: 999px !important;
    border: 1px solid var(--pcw-border) !important;
    background: rgba(55, 118, 171, 0.14) !important;
    color: #cfe3f5 !important;
    font: 600 13px/1 var(--pcw-ui-font) !important;
    cursor: pointer;
    transition: background-color 0.15s ease, border-color 0.15s ease;
}
.python-compiler-workspace button.pcw-example:hover { background: rgba(55, 118, 171, 0.32) !important; border-color: var(--pcw-blue-light) !important; }
.python-compiler-workspace button.pcw-example:focus-visible { outline: 3px solid var(--pcw-yellow) !important; outline-offset: 2px; }
.python-compiler-workspace .pcw-runner-frame { position: absolute !important; width: 0 !important; height: 0 !important; border: 0 !important; visibility: hidden !important; }

/* ----- small screens ----- */
@media (max-width: 640px) {
    .python-compiler-workspace { --pcw-font-size: 14px; --pcw-line-height: 21px; }
    .python-compiler-workspace .pcw-header { padding: 14px; }
    .python-compiler-workspace .pcw-section-label { padding: 10px 14px 8px; }
    .python-compiler-workspace .pcw-editor { height: 300px; margin: 0 12px; }
    .python-compiler-workspace .pcw-hint { margin: 8px 12px 0 !important; }
    .python-compiler-workspace .pcw-toolbar { padding: 12px 12px 4px; }
    .python-compiler-workspace button.pcw-btn { flex: 1 1 auto; }
    .python-compiler-workspace .pcw-terminal { margin: 0 12px; }
    .python-compiler-workspace .pcw-output { max-height: 280px; }
    .python-compiler-workspace .pcw-examples { padding: 0 12px 16px; }
    .python-compiler-workspace .pcw-gutter { min-width: 38px; }
}
@media (prefers-reduced-motion: reduce) {
    .python-compiler-workspace .pcw-status-dot { animation: none !important; }
}
`;

    var PCW_LAYOUT = `
    <div class="pcw-shell">
        <div class="pcw-header">
            <div class="pcw-brand">
                <div class="pcw-logo" aria-hidden="true">Py</div>
                <div>
                    <h2 class="pcw-title">Python Compiler</h2>
                    <div class="pcw-subtitle">Write Python 3 and run it right here in your browser.</div>
                </div>
            </div>
            <div class="pcw-status" data-pcw="status" data-state="idle" role="status" aria-live="polite">
                <span class="pcw-status-dot" aria-hidden="true"></span>
                <span data-pcw="status-text">Python loads when you press Run</span>
            </div>
        </div>

        <div class="pcw-section-label"><span>Code</span><span>main.py</span></div>
        <div class="pcw-editor" data-pcw="editor">
            <div class="pcw-gutter" aria-hidden="true"><div class="pcw-gutter-inner" data-pcw="gutter"></div></div>
            <div class="pcw-code">
                <pre class="pcw-highlight" data-pcw="highlight" aria-hidden="true"></pre>
                <textarea class="pcw-textarea" data-pcw="textarea" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off" wrap="off" aria-label="Python code editor. Press Control and Enter to run. Press Escape, then Tab, to leave the editor."></textarea>
            </div>
        </div>
        <div class="pcw-hint"><kbd>Ctrl</kbd> + <kbd>Enter</kbd> runs your code &middot; <kbd>Tab</kbd> indents &middot; <kbd>Esc</kbd> then <kbd>Tab</kbd> leaves the editor</div>

        <div class="pcw-toolbar">
            <button type="button" class="pcw-btn pcw-btn-run" data-pcw="run">&#9654; Run Python</button>
            <button type="button" class="pcw-btn pcw-btn-stop" data-pcw="stop" hidden>&#9632; Stop</button>
            <button type="button" class="pcw-btn" data-pcw="clear" title="Clear the output">Clear</button>
            <button type="button" class="pcw-btn" data-pcw="format" title="Tidy indentation to 4 spaces and remove extra spaces and blank lines">Format</button>
            <div class="pcw-note" data-pcw="note" aria-live="polite"></div>
        </div>

        <div class="pcw-section-label"><span>Output</span><span></span></div>
        <div class="pcw-terminal">
            <pre class="pcw-output" data-pcw="output" aria-live="polite" aria-label="Program output"></pre>
            <div class="pcw-input-row" data-pcw="input-row" hidden>
                <span class="pcw-input-label">&#9000; Your input:</span>
                <input type="text" class="pcw-input-field" data-pcw="input-field" autocomplete="off" spellcheck="false" aria-label="Type the input for your program, then press Enter">
                <button type="button" class="pcw-btn pcw-btn-small" data-pcw="input-submit">Enter</button>
            </div>
        </div>

        <div class="pcw-section-label"><span>Examples</span><span>Click to load into the editor</span></div>
        <div class="pcw-examples" data-pcw="examples"></div>
    </div>
`;

    if (!document.querySelector("style[data-pcw-styles]")) {
        var style = document.createElement("style");
        style.setAttribute("data-pcw-styles", "1");
        style.textContent = PCW_STYLES;
        document.head.appendChild(style);
    }
    var placeholders = document.querySelectorAll(".python-compiler-workspace[data-pcw-mount]");
    for (var i = 0; i < placeholders.length; i++) {
        placeholders[i].innerHTML = PCW_LAYOUT;
        placeholders[i].removeAttribute("data-pcw-mount");
    }
})();

/* ---------- Part 2: the compiler (identical to python-compiler-v1) ---------- */
(function () {
    "use strict";

    /* ---------- settings ---------- */
    var PYODIDE_INDEX_URL = "https://cdn.jsdelivr.net/pyodide/v314.0.7/full/";
    var RUN_TIME_LIMIT_MS = 10000;      /* a single run longer than this is treated as an infinite loop */
    var LOAD_TIME_LIMIT_MS = 120000;    /* give slow connections plenty of time to download Python */
    var OUTPUT_LIMIT_CHARS = 100000;    /* stops programs that print forever */

    var root = document.querySelector(".python-compiler-workspace:not([data-pcw-ready])");
    if (!root) { return; }
    root.setAttribute("data-pcw-ready", "1");

    function part(name) { return root.querySelector('[data-pcw="' + name + '"]'); }
    var textarea = part("textarea");
    var highlightLayer = part("highlight");
    var gutter = part("gutter");
    var runButton = part("run");
    var stopButton = part("stop");
    var clearButton = part("clear");
    var formatButton = part("format");
    var note = part("note");
    var output = part("output");
    var inputRow = part("input-row");
    var inputField = part("input-field");
    var inputSubmit = part("input-submit");
    var statusBox = part("status");
    var statusText = part("status-text");
    var examplesBox = part("examples");

    /* ---------- example programs ---------- */
    var EXAMPLES = [
        { name: "Input", code: 'name = input("What is your name? ")\nprint("Hello,", name)' },
        { name: "Hello World", code: 'print("Hello World")\nprint("Welcome to Python!")' },
        { name: "Variables", code: '# Variables store values\nname = "Ayesha"\nage = 16\nheight = 1.62\n\nprint("Name:", name)\nprint("Age next year:", age + 1)\nprint("Height in cm:", height * 100)\n\n# Arithmetic\na = 17\nb = 5\nprint(a + b, a - b, a * b, a / b)\nprint("17 // 5 =", a // b, " and 17 % 5 =", a % b)' },
        { name: "If / Else", code: 'marks = int(input("Enter your marks: "))\n\nif marks >= 90:\n    print("Grade: A*")\nelif marks >= 80:\n    print("Grade: A")\nelif marks >= 50:\n    print("Grade: Pass")\nelse:\n    print("Keep practising!")' },
        { name: "For Loop", code: '# Times table using a for loop\nnumber = 7\n\nfor i in range(1, 11):\n    print(number, "x", i, "=", number * i)\n\n# Loop over a string\nfor letter in "Python":\n    print(letter)' },
        { name: "While Loop", code: 'total = 0\ncount = 0\n\nwhile count < 3:\n    value = int(input("Enter a number: "))\n    total = total + value\n    count = count + 1\n\nprint("Total:", total)\nprint("Average:", total / count)' },
        { name: "Function", code: 'def square(n):\n    return n * n\n\ndef greet(name, times):\n    for i in range(times):\n        print("Hello,", name)\n\nprint("Square of 5 is", square(5))\nprint("3 squared + 4 squared =", square(3) + square(4))\ngreet("Bilal", 2)' },
        { name: "Lists", code: 'marks = [72, 85, 64, 91, 58]\n\nprint("All marks:", marks)\nprint("First mark:", marks[0])\nprint("Highest:", max(marks))\nprint("Average:", sum(marks) / len(marks))\n\nmarks.append(77)\nmarks.sort()\nprint("Sorted:", marks)\n\nfor position, mark in enumerate(marks, start=1):\n    print(position, mark)' }
    ];

    /* ---------- Python side of the runner (sent to the isolated worker) ---------- */
    var RUNNER_PYTHON = String.raw`
import sys, builtins, random, traceback, linecache, time

_PCW_FILE = "main.py"
_PCW_TOOL = 5
_pcw_builtins_snapshot = dict(builtins.__dict__)
_pcw_default_recursion_limit = sys.getrecursionlimit()
_pcw_saved_streams = (sys.stdout, sys.stderr, sys.stdin)


class _PcwStop(BaseException):
    """Internal signal that stops the student's program."""


class _PcwSession:
    def __init__(self, inputs, emit, output_limit):
        self.inputs = [str(value) for value in inputs]
        self.emit = emit
        self.output_limit = output_limit
        self.total = 0
        self.pending = []
        self.pending_size = 0
        self.stop_reason = None
        self.prompt = ""
        self.last_flush = 0.0

    def write(self, kind, text):
        if self.stop_reason is not None:
            raise _PcwStop()
        if not text:
            return
        if self.total + len(text) > self.output_limit:
            room = self.output_limit - self.total
            if room > 0:
                self._queue(kind, text[:room])
            self.flush()
            self.stop("output")
            raise _PcwStop()
        self._queue(kind, text)
        if self.pending_size > 8192 or ("\n" in text and time.monotonic() - self.last_flush > 0.05):
            self.flush()

    def _queue(self, kind, text):
        self.total += len(text)
        self.pending_size += len(text)
        if self.pending and self.pending[-1][0] == kind:
            self.pending[-1][1].append(text)
        else:
            self.pending.append((kind, [text]))

    def flush(self):
        self.last_flush = time.monotonic()
        pending, self.pending, self.pending_size = self.pending, [], 0
        for kind, parts in pending:
            self.emit(kind, "".join(parts))

    def read_line(self, prompt=""):
        prompt = "" if prompt is None else str(prompt)
        if prompt:
            self.write("stdout", prompt)
        if self.inputs:
            value = self.inputs.pop(0)
            self.write("stdin", value + "\n")
            return value
        self.flush()
        self.prompt = prompt
        self.stop("input")
        raise _PcwStop()

    def stop(self, reason):
        if self.stop_reason is not None:
            return
        self.stop_reason = reason
        monitoring = sys.monitoring

        def on_line(code, line_number):
            if code.co_filename != _PCW_FILE:
                return monitoring.DISABLE
            raise _PcwStop()

        def on_jump(code, source, destination):
            if code.co_filename != _PCW_FILE:
                return monitoring.DISABLE
            raise _PcwStop()

        monitoring.register_callback(_PCW_TOOL, monitoring.events.LINE, on_line)
        monitoring.register_callback(_PCW_TOOL, monitoring.events.JUMP, on_jump)
        monitoring.set_events(_PCW_TOOL, monitoring.events.LINE | monitoring.events.JUMP)


class _PcwOut:
    def __init__(self, session, kind):
        self._session = session
        self._kind = kind
        self.encoding = "utf-8"
        self.errors = "strict"

    def write(self, text):
        if not isinstance(text, str):
            raise TypeError("write() argument must be str, not " + type(text).__name__)
        self._session.write(self._kind, text)
        return len(text)

    def writelines(self, lines):
        for line in lines:
            self.write(line)

    def flush(self):
        self._session.flush()

    def isatty(self):
        return False

    def writable(self):
        return True

    def readable(self):
        return False


class _PcwIn:
    def __init__(self, session):
        self._session = session
        self.encoding = "utf-8"

    def readline(self, size=-1):
        return self._session.read_line("") + "\n"

    def read(self, size=-1):
        return self.readline()

    def isatty(self):
        return False

    def readable(self):
        return True


def _pcw_reset_environment():
    for name in list(builtins.__dict__):
        if name not in _pcw_builtins_snapshot:
            del builtins.__dict__[name]
    builtins.__dict__.update(_pcw_builtins_snapshot)
    sys.setrecursionlimit(_pcw_default_recursion_limit)


def _pcw_student_line(tb):
    line = None
    while tb is not None:
        if tb.tb_frame.f_code.co_filename == _PCW_FILE:
            line = tb.tb_lineno
        tb = tb.tb_next
    return line


def _pcw_student_traceback(error):
    tb = error.__traceback__
    while tb is not None and tb.tb_frame.f_code.co_filename != _PCW_FILE:
        tb = tb.tb_next
    return "".join(traceback.format_exception(type(error), error, tb))


def _pcw_run(source, inputs, seed, emit, output_limit):
    session = _PcwSession(inputs, emit, output_limit)
    _pcw_reset_environment()
    linecache.cache[_PCW_FILE] = (len(source), None, source.splitlines(True), _PCW_FILE)
    sys.monitoring.use_tool_id(_PCW_TOOL, "python-compiler-workspace")
    sys.stdout, sys.stderr, sys.stdin = _PcwOut(session, "stdout"), _PcwOut(session, "stderr"), _PcwIn(session)
    builtins.input = session.read_line
    random.seed(seed)
    result = {"status": "done", "prompt": "", "line": None, "message": ""}
    try:
        try:
            code = compile(source, _PCW_FILE, "exec")
        except SyntaxError as error:
            session.write("stderr", "".join(traceback.format_exception_only(type(error), error)))
            result.update(status="error", line=error.lineno)
            return result
        namespace = {"__name__": "__main__", "__builtins__": builtins}
        try:
            exec(code, namespace)
        except _PcwStop:
            pass
        except SystemExit as error:
            if session.stop_reason is None:
                if isinstance(error.code, str):
                    session.write("stderr", error.code + "\n")
                elif error.code not in (None, 0):
                    result["message"] = "Program exited with code " + str(error.code)
        except BaseException as error:
            if session.stop_reason is None:
                session.write("stderr", _pcw_student_traceback(error))
                result.update(status="error", line=_pcw_student_line(error.__traceback__))
    except _PcwStop:
        pass
    finally:
        sys.monitoring.set_events(_PCW_TOOL, 0)
        sys.monitoring.register_callback(_PCW_TOOL, sys.monitoring.events.LINE, None)
        sys.monitoring.register_callback(_PCW_TOOL, sys.monitoring.events.JUMP, None)
        sys.monitoring.free_tool_id(_PCW_TOOL)
        try:
            session.flush()
        except _PcwStop:
            pass
        sys.stdout, sys.stderr, sys.stdin = _pcw_saved_streams
    if session.stop_reason == "input":
        result.update(status="input", prompt=session.prompt)
    elif session.stop_reason == "output":
        result.update(status="error", message="Output limit reached, so the program was stopped. Check for a loop that prints forever.")
    return result
`;

    /* ---------- code that runs inside the background worker (no page access) ---------- */
    function pcwWorkerMain() {
        var pyodide = null;
        var runProgram = null;
        function lockDown() {
            /* After Python has loaded, remove the worker's ability to make network requests or start other scripts. */
            ["fetch", "XMLHttpRequest", "WebSocket", "EventSource", "indexedDB", "caches",
             "BroadcastChannel", "WebTransport", "Worker", "SharedWorker"].forEach(function (name) {
                try { Object.defineProperty(self, name, { value: undefined, writable: false, configurable: false }); }
                catch (error) { try { self[name] = undefined; } catch (ignored) { /* nothing else to do */ } }
            });
        }
        self.onmessage = async function (event) {
            var data = event.data || {};
            if (data.type === "init") {
                try {
                    var pyodideModule = await import(data.indexURL + "pyodide.mjs");
                    pyodide = await pyodideModule.loadPyodide({ indexURL: data.indexURL, stdout: function () {}, stderr: function () {} });
                    pyodide.runPython(data.runnerSource);
                    runProgram = pyodide.globals.get("_pcw_run");
                    var pythonVersion = pyodide.runPython("import sys; sys.version.split()[0]");
                    lockDown();
                    self.postMessage({ type: "ready", python: pythonVersion, pyodide: pyodide.version });
                } catch (error) {
                    self.postMessage({ type: "fatal", message: String((error && error.message) || error) });
                }
                return;
            }
            if (data.type === "run" && runProgram) {
                var runId = data.runId;
                var emit = function (kind, text) { self.postMessage({ type: "output", runId: runId, kind: kind, text: text }); };
                var result;
                var pyInputs = pyodide.toPy(data.inputs);
                try {
                    var proxy = runProgram(data.code, pyInputs, data.seed, emit, data.outputLimit);
                    result = proxy.toJs({ dict_converter: Object.fromEntries });
                    proxy.destroy();
                } catch (error) {
                    result = { status: "error", prompt: "", line: null, message: "Internal error: " + String((error && error.message) || error) };
                } finally {
                    pyInputs.destroy();
                }
                self.postMessage({ type: "result", runId: runId, status: result.status, prompt: result.prompt, line: result.line, message: result.message });
            }
        };
    }

    /* ---------- code that runs inside the sandboxed hidden frame (separate, opaque origin) ---------- */
    function pcwFrameMain(channel, workerSource) {
        var worker = null;
        var initMessage = null;
        var workerHasSpoken = false;
        function send(message) { message.channel = channel; parent.postMessage(message, "*"); }
        /* Browsers differ in which worker address they allow inside a sandboxed frame, so try a data: URL first and a blob: URL second. */
        var workerUrls = [
            function () { return "data:text/javascript;charset=utf-8," + encodeURIComponent(workerSource); },
            function () { return URL.createObjectURL(new Blob([workerSource], { type: "text/javascript" })); }
        ];
        function startWorker(attempt) {
            if (attempt >= workerUrls.length) {
                send({ type: "fatal", message: "This browser blocked the Python runner. Please try an up-to-date Chrome, Edge, Firefox or Safari." });
                return;
            }
            try {
                worker = new Worker(workerUrls[attempt](), { type: "module" });
            } catch (error) {
                startWorker(attempt + 1);
                return;
            }
            worker.onmessage = function (e) { workerHasSpoken = true; send(e.data); };
            worker.onerror = function (e) {
                if (e.preventDefault) { e.preventDefault(); }
                if (!workerHasSpoken) { worker.terminate(); startWorker(attempt + 1); return; }
                send({ type: "fatal", message: e.message || "The Python runner stopped unexpectedly." });
            };
            worker.postMessage(initMessage);
        }
        window.addEventListener("message", function (event) {
            if (event.source !== parent) { return; }
            var data = event.data;
            if (!data || data.channel !== channel) { return; }
            if (data.type === "init" && !worker) {
                initMessage = { type: "init", indexURL: data.indexURL, runnerSource: data.runnerSource };
                startWorker(0);
            } else if (data.type === "run" && worker) {
                worker.postMessage(data);
            }
        });
        send({ type: "frame-ready" });
    }

    var SCRIPT_OPEN = "<scr" + "ipt>";
    var SCRIPT_CLOSE = "</scr" + "ipt>";
    function buildFrameDocument(channel) {
        var workerSource = "(" + pcwWorkerMain.toString() + ")();";
        var call = "(" + pcwFrameMain.toString() + ")(" + JSON.stringify(channel) + "," + JSON.stringify(workerSource) + ");";
        return '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>' +
            SCRIPT_OPEN + call.replace(/<\/(script)/gi, "<\\/$1") + SCRIPT_CLOSE + "</body></html>";
    }

    /* ---------- runtime management ---------- */
    var runnerFrame = null;
    var channel = null;
    var runtimeState = "none";          /* none | loading | ready */
    var loadTimer = null;
    var startWhenReady = false;
    var loadingNode = null;

    function destroyRuntime() {
        clearTimeout(loadTimer);
        if (runnerFrame && runnerFrame.parentNode) { runnerFrame.parentNode.removeChild(runnerFrame); }
        runnerFrame = null;
        channel = null;
        runtimeState = "none";
    }

    function createRuntime() {
        destroyRuntime();
        channel = "pcw-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
        runnerFrame = document.createElement("iframe");
        runnerFrame.setAttribute("sandbox", "allow-scripts");
        runnerFrame.setAttribute("title", "Python runner");
        runnerFrame.setAttribute("aria-hidden", "true");
        runnerFrame.setAttribute("tabindex", "-1");
        runnerFrame.className = "pcw-runner-frame";
        runnerFrame.srcdoc = buildFrameDocument(channel);
        runtimeState = "loading";
        setStatus("loading", "Loading Python…");
        loadTimer = setTimeout(function () {
            runtimeFailed("Python took too long to load. Check your internet connection and press Run to try again.");
        }, LOAD_TIME_LIMIT_MS);
        root.appendChild(runnerFrame);
    }

    function runtimeFailed(message) {
        destroyRuntime();
        removeLoadingNode();
        if (session) { session = null; }
        startWhenReady = false;
        clearTimeout(runTimer);
        hideInputRow();
        appendOutput("system-error", "Python could not start: " + message + "\n");
        setStatus("error", "Python could not load");
        setRunningUi(false);
    }

    function removeLoadingNode() {
        if (loadingNode && loadingNode.parentNode) { loadingNode.parentNode.removeChild(loadingNode); }
        loadingNode = null;
    }

    function postToRunner(message) {
        if (!runnerFrame || !runnerFrame.contentWindow) { return; }
        message.channel = channel;
        runnerFrame.contentWindow.postMessage(message, "*");
    }

    window.addEventListener("message", function (event) {
        if (!runnerFrame || event.source !== runnerFrame.contentWindow) { return; }
        var data = event.data;
        if (!data || data.channel !== channel) { return; }
        if (data.type === "frame-ready") {
            postToRunner({ type: "init", indexURL: PYODIDE_INDEX_URL, runnerSource: RUNNER_PYTHON });
        } else if (data.type === "ready") {
            clearTimeout(loadTimer);
            runtimeState = "ready";
            removeLoadingNode();
            setStatus("ready", "Python " + data.python + " ready");
            if (startWhenReady && session) { startWhenReady = false; runAttempt(); }
        } else if (data.type === "fatal") {
            runtimeFailed(data.message);
        } else if (data.type === "output") {
            if (session && data.runId === session.runId) { receiveOutput(data.kind, data.text); }
        } else if (data.type === "result") {
            if (session && data.runId === session.runId) { receiveResult(data); }
        }
    });

    /* ---------- running programs ----------
       Python's input() has to pause until the student answers, but browser code cannot pause.
       So when the program asks for input it stops; once the student answers, the program runs again
       from the start with the answers supplied (same random seed), and only new output is shown. */
    var session = null;
    var runCounter = 0;
    var runTimer = null;

    function startProgram() {
        hideInputRow();
        clearErrorLine();
        clearOutput();
        setNote("", "");
        session = {
            code: textarea.value,
            inputs: [],
            seed: Math.floor(Math.random() * 2147483647),
            shownLength: 0,
            receivedLength: 0,
            runId: 0
        };
        setRunningUi(true);
        if (runtimeState === "ready") {
            runAttempt();
        } else {
            startWhenReady = true;
            loadingNode = appendOutput("system", "Loading Python… the first run can take a little while.\n");
            if (runtimeState !== "loading") { createRuntime(); }
        }
    }

    function runAttempt() {
        session.runId = ++runCounter;
        session.receivedLength = 0;
        setStatus("running", "Running…");
        postToRunner({
            type: "run",
            runId: session.runId,
            code: session.code,
            inputs: session.inputs.slice(),
            seed: session.seed,
            outputLimit: OUTPUT_LIMIT_CHARS
        });
        clearTimeout(runTimer);
        runTimer = setTimeout(onTimeLimit, RUN_TIME_LIMIT_MS);
    }

    function receiveOutput(kind, text) {
        var before = session.receivedLength;
        session.receivedLength += text.length;
        if (session.receivedLength <= session.shownLength) { return; }
        var fresh = before >= session.shownLength ? text : text.slice(session.shownLength - before);
        session.shownLength = session.receivedLength;
        queueOutput(kind === "stderr" ? "stderr" : (kind === "stdin" ? "stdin" : "stdout"), fresh);
    }

    function receiveResult(data) {
        clearTimeout(runTimer);
        if (data.status === "input") {
            setStatus("waiting", "Waiting for your input");
            showInputRow();
            return;
        }
        ensureNewLine();
        if (data.status === "error") {
            if (data.message) { appendOutput("system-error", data.message + "\n"); }
            if (data.line) {
                markErrorLine(data.line);
                appendOutput("system-error", "✗ Program stopped with an error on line " + data.line + ".\n");
            } else if (!data.message) {
                appendOutput("system-error", "✗ Program stopped with an error.\n");
            }
            setStatus("ready", "Python ready");
        } else {
            if (data.message) { appendOutput("system", data.message + "\n"); }
            appendOutput("done", "✓ Program finished\n");
            setStatus("ready", "Python ready");
        }
        session = null;
        setRunningUi(false);
    }

    function onTimeLimit() {
        hideInputRow();
        ensureNewLine();
        appendOutput("system-error", "Program stopped: it ran for more than " + (RUN_TIME_LIMIT_MS / 1000) +
            " seconds. Check for an infinite loop, for example a while loop whose condition never becomes False.\n");
        session = null;
        setRunningUi(false);
        createRuntime();   /* the stuck worker is thrown away and a fresh Python starts loading in the background */
        setStatus("loading", "Restarting Python…");
    }

    function stopProgram() {
        if (!session) { return; }
        var wasRunning = statusBox.getAttribute("data-state") === "running";
        clearTimeout(runTimer);
        hideInputRow();
        ensureNewLine();
        appendOutput("system", "Program stopped.\n");
        session = null;
        startWhenReady = false;
        setRunningUi(false);
        if (wasRunning) {
            createRuntime();   /* the busy worker is thrown away and a fresh Python loads in the background */
        } else if (runtimeState === "ready") {
            setStatus("ready", "Python ready");
        }
    }

    function submitInput() {
        if (!session || inputRow.hidden) { return; }
        var value = inputField.value;
        hideInputRow();
        var echo = value + "\n";
        appendOutput("stdin", echo);
        session.shownLength += echo.length;
        session.inputs.push(value);
        runAttempt();
    }

    /* ---------- output panel ---------- */
    var outputIsEmpty = true;
    var outputQueue = [];
    var outputFlushScheduled = false;
    function queueOutput(kind, text) {
        outputQueue.push([kind, text]);
        if (!outputFlushScheduled) {
            outputFlushScheduled = true;
            requestAnimationFrame(flushOutputQueue);
        }
    }
    function flushOutputQueue() {
        outputFlushScheduled = false;
        if (!outputQueue.length) { return; }
        if (outputIsEmpty) { output.textContent = ""; outputIsEmpty = false; }
        var queue = outputQueue;
        outputQueue = [];
        for (var i = 0; i < queue.length; i++) {
            var kind = queue[i][0], text = queue[i][1];
            var last = output.lastChild;
            if (last && last.className === "pcw-out-" + kind && last.firstChild && last !== loadingNode) {
                last.firstChild.appendData(text);
            } else {
                var span = document.createElement("span");
                span.className = "pcw-out-" + kind;
                span.textContent = text;
                output.appendChild(span);
            }
        }
        output.scrollTop = output.scrollHeight;
    }
    function clearOutput() {
        outputQueue = [];
        output.textContent = "";
        outputIsEmpty = true;
        loadingNode = null;
    }
    function showPlaceholder() {
        clearOutput();
        var span = document.createElement("span");
        span.className = "pcw-out-placeholder";
        span.textContent = "Press ▶ Run Python to see your program's output here.";
        output.appendChild(span);
    }
    function appendOutput(kind, text) {
        flushOutputQueue();
        if (outputIsEmpty) { output.textContent = ""; outputIsEmpty = false; }
        var span = document.createElement("span");
        span.className = "pcw-out-" + kind;
        span.textContent = text;
        output.appendChild(span);
        output.scrollTop = output.scrollHeight;
        return span;
    }
    function ensureNewLine() {
        flushOutputQueue();
        var text = output.textContent;
        if (!outputIsEmpty && text.length && text.charAt(text.length - 1) !== "\n") { appendOutput("stdout", "\n"); }
    }
    function showInputRow() {
        inputField.value = "";
        inputRow.hidden = false;
        output.scrollTop = output.scrollHeight;
        inputField.focus();
    }
    function hideInputRow() { inputRow.hidden = true; }

    function setStatus(state, text) {
        statusBox.setAttribute("data-state", state);
        statusText.textContent = text;
    }
    function setRunningUi(isRunning) {
        stopButton.hidden = !isRunning;
        runButton.textContent = isRunning ? "↻ Restart" : "▶ Run Python";
    }
    var noteTimer = null;
    function setNote(text, tone) {
        clearTimeout(noteTimer);
        note.textContent = text;
        note.setAttribute("data-tone", tone || "");
        if (text) { noteTimer = setTimeout(function () { note.textContent = ""; }, 6000); }
    }

    /* ---------- Python syntax highlighting (lightweight, no external library) ---------- */
    var KEYWORDS = toSet("and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield match case");
    var CONSTANTS = toSet("True False None");
    var BUILTINS = toSet("abs all any bin bool bytes chr dict dir divmod enumerate eval exec filter float format frozenset getattr hasattr hash help hex id input int isinstance issubclass iter len list map max min next object oct open ord pow print range repr reversed round set setattr slice sorted str sum super tuple type vars zip Exception ValueError TypeError ZeroDivisionError IndexError KeyError NameError");
    function toSet(words) { var set = Object.create(null); words.split(" ").forEach(function (w) { set[w] = true; }); return set; }

    var TOKEN_PATTERN = /(#[^\n]*)|((?:[rRbBuUfF]{1,2})?(?:'''[\s\S]*?(?:'''|$)|"""[\s\S]*?(?:"""|$)|'(?:\\.|[^'\\\n])*(?:'|(?=\n)|$)|"(?:\\.|[^"\\\n])*(?:"|(?=\n)|$)))|(0[xX][0-9a-fA-F_]+|0[bB][01_]+|0[oO][0-7_]+|\d[\d_]*(?:\.[\d_]*)?(?:[eE][+-]?\d+)?[jJ]?|\.\d[\d_]*(?:[eE][+-]?\d+)?[jJ]?)|([A-Za-z_][A-Za-z0-9_]*)|(\n)|([ \t\r\f\v]+)|(.)/g;

    function tokenize(source) {
        var tokens = [];
        var match;
        TOKEN_PATTERN.lastIndex = 0;
        while ((match = TOKEN_PATTERN.exec(source)) !== null) {
            var type = match[1] !== undefined ? "comment" : match[2] !== undefined ? "string" : match[3] !== undefined ? "number" :
                match[4] !== undefined ? "name" : match[5] !== undefined ? "newline" : match[6] !== undefined ? "space" : "op";
            tokens.push({ type: type, text: match[0] });
            if (match[0].length === 0) { TOKEN_PATTERN.lastIndex++; }
        }
        return tokens;
    }

    function escapeHtml(text) { return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

    function highlightPython(source) {
        var html = "";
        var previousName = "";
        tokenize(source).forEach(function (token) {
            var text = escapeHtml(token.text);
            var cls = "";
            if (token.type === "comment") { cls = "com"; }
            else if (token.type === "string") { cls = "str"; }
            else if (token.type === "number") { cls = "num"; }
            else if (token.type === "name") {
                if (previousName === "def" || previousName === "class") { cls = "def"; }
                else if (CONSTANTS[token.text]) { cls = "const"; }
                else if (KEYWORDS[token.text]) { cls = "kw"; }
                else if (BUILTINS[token.text]) { cls = "builtin"; }
                else if (token.text === "self") { cls = "self"; }
                previousName = token.text;
            } else if (token.type !== "space") {
                previousName = "";
            }
            html += cls ? '<span class="pcw-tok-' + cls + '">' + text + "</span>" : text;
        });
        return html;
    }

    /* ---------- editor behaviour ---------- */
    var errorLine = null;
    var lastLineCount = -1;

    function refreshEditor() {
        highlightLayer.innerHTML = highlightPython(textarea.value) + "\n ";
        var lineCount = textarea.value.split("\n").length;
        if (lineCount !== lastLineCount) { renderGutter(lineCount); }
        syncScroll();
    }
    function renderGutter(lineCount) {
        lastLineCount = lineCount;
        var html = "";
        for (var i = 1; i <= lineCount; i++) {
            html += i === errorLine ? '<div class="pcw-error-line">' + i + "</div>" : "<div>" + i + "</div>";
        }
        gutter.innerHTML = html;
    }
    function syncScroll() {
        var x = textarea.scrollLeft;
        var y = textarea.scrollTop;
        highlightLayer.style.transform = "translate(" + (-x) + "px," + (-y) + "px)";
        gutter.style.transform = "translateY(" + (-y) + "px)";
    }
    function markErrorLine(line) { errorLine = line; renderGutter(textarea.value.split("\n").length); }
    function clearErrorLine() {
        if (errorLine !== null) { errorLine = null; renderGutter(textarea.value.split("\n").length); }
    }
    function setCode(code) {
        textarea.value = code;
        textarea.scrollTop = 0;
        textarea.scrollLeft = 0;
        clearErrorLine();
        refreshEditor();
    }

    function insertText(text) {
        textarea.focus();
        var inserted = false;
        try { inserted = document.execCommand("insertText", false, text); } catch (error) { inserted = false; }
        if (!inserted) {
            textarea.setRangeText(text, textarea.selectionStart, textarea.selectionEnd, "end");
            refreshEditor();
        }
    }

    function selectedLineRange() {
        var value = textarea.value;
        var start = value.lastIndexOf("\n", textarea.selectionStart - 1) + 1;
        var endSearch = textarea.selectionEnd > textarea.selectionStart && value.charAt(textarea.selectionEnd - 1) === "\n" ? textarea.selectionEnd - 1 : textarea.selectionEnd;
        var end = value.indexOf("\n", endSearch);
        if (end === -1) { end = value.length; }
        return { start: start, end: end };
    }

    function replaceLines(transform) {
        var range = selectedLineRange();
        var original = textarea.value.slice(range.start, range.end);
        var changed = original.split("\n").map(transform).join("\n");
        textarea.setSelectionRange(range.start, range.end);
        insertText(changed);
        textarea.setSelectionRange(range.start, range.start + changed.length);
    }

    var tabLeavesEditor = false;
    textarea.addEventListener("keydown", function (event) {
        if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
            event.preventDefault();
            startProgram();
            return;
        }
        if (event.key === "Escape") { tabLeavesEditor = true; return; }
        if (event.key === "Tab") {
            if (tabLeavesEditor) { tabLeavesEditor = false; return; }   /* let Tab move focus normally */
            event.preventDefault();
            var multiLine = textarea.value.slice(textarea.selectionStart, textarea.selectionEnd).indexOf("\n") !== -1;
            if (event.shiftKey) {
                replaceLines(function (line) { return line.replace(/^( {1,4}|\t)/, ""); });
            } else if (multiLine) {
                replaceLines(function (line) { return line.length ? "    " + line : line; });
            } else {
                insertText("    ");
            }
            return;
        }
        tabLeavesEditor = false;
        if (event.key === "Enter" && !event.shiftKey && !event.altKey) {
            event.preventDefault();
            var value = textarea.value;
            var lineStart = value.lastIndexOf("\n", textarea.selectionStart - 1) + 1;
            var currentLine = value.slice(lineStart, textarea.selectionStart);
            var indent = currentLine.match(/^[ \t]*/)[0];
            var codeOnly = currentLine.replace(/#.*$/, "").replace(/\s+$/, "");
            if (codeOnly.slice(-1) === ":") { indent += "    "; }
            else if (/^\s*(return|pass|break|continue|raise)\b/.test(codeOnly) && indent.length >= 4) { indent = indent.slice(4); }
            insertText("\n" + indent);
            return;
        }
        if (event.key === "Backspace" && textarea.selectionStart === textarea.selectionEnd) {
            var position = textarea.selectionStart;
            var lineBegin = textarea.value.lastIndexOf("\n", position - 1) + 1;
            var beforeCaret = textarea.value.slice(lineBegin, position);
            if (beforeCaret.length >= 2 && /^ +$/.test(beforeCaret)) {
                event.preventDefault();
                var remove = beforeCaret.length % 4 === 0 ? 4 : beforeCaret.length % 4;
                textarea.setSelectionRange(position - remove, position);
                insertText("");
            }
        }
    });
    textarea.addEventListener("input", function () { clearErrorLine(); refreshEditor(); });
    textarea.addEventListener("scroll", syncScroll);

    /* ---------- Format: safe tidy-up that never changes what the program does ---------- */
    function analyzeLines(source) {
        var lineCount = source.split("\n").length;
        var startsInString = new Array(lineCount).fill(false);
        var startsInBracket = new Array(lineCount).fill(false);
        var endsWithColon = new Array(lineCount).fill(false);
        var line = 0;
        var depth = 0;
        var lastSignificant = "";
        var continued = false;
        tokenize(source).forEach(function (token) {
            if (token.type === "newline") {
                endsWithColon[line] = depth === 0 && lastSignificant === ":";
                line++;
                if (line < lineCount) { startsInBracket[line] = depth > 0 || continued; }
                continued = false;
                lastSignificant = "";
                return;
            }
            if (token.type === "space" || token.type === "comment") { return; }
            if (token.type === "string") {
                var breaks = token.text.split("\n").length - 1;
                for (var i = 1; i <= breaks; i++) { if (line + i < lineCount) { startsInString[line + i] = true; } }
                line += breaks;
                lastSignificant = "string";
                continued = false;
                return;
            }
            if (token.text === "\\") { continued = true; return; }
            continued = false;
            if ("([{".indexOf(token.text) !== -1) { depth++; }
            if (")]}".indexOf(token.text) !== -1 && depth > 0) { depth--; }
            lastSignificant = token.text;
        });
        if (line < lineCount) { endsWithColon[line] = depth === 0 && lastSignificant === ":"; }
        return { startsInString: startsInString, startsInBracket: startsInBracket, endsWithColon: endsWithColon };
    }

    function formatPython(source) {
        var lines = source.replace(/\r\n?/g, "\n").split("\n");
        var info = analyzeLines(lines.join("\n"));
        var kinds = lines.map(function (text, i) {
            if (info.startsInString[i]) { return "string"; }
            if (info.startsInBracket[i]) { return "cont"; }
            var trimmed = text.trim();
            if (trimmed === "") { return "blank"; }
            if (trimmed.charAt(0) === "#") { return "comment"; }
            return "code";
        });
        function expandTabs(text) {
            var leading = text.match(/^[ \t]*/)[0];
            return leading.replace(/\t/g, "    ") + text.slice(leading.length);
        }
        function indentWidth(text) { return text.match(/^ */)[0].length; }

        var result = lines.slice();
        var stack = [0];
        var delta = 0;
        var previousEndsWithColon = false;
        for (var i = 0; i < lines.length; i++) {
            var kind = kinds[i];
            if (kind === "string" || kind === "blank" || kind === "comment") { continue; }
            var text = expandTabs(lines[i]);
            var width = indentWidth(text);
            if (kind === "cont") {
                result[i] = " ".repeat(Math.max(0, width + delta)) + text.trimStart();
                previousEndsWithColon = info.endsWithColon[i];
                continue;
            }
            if (width > stack[stack.length - 1]) {
                if (!previousEndsWithColon) {
                    return { error: "Line " + (i + 1) + " is indented, but the line before it doesn't end with a colon. Fix that indentation first." };
                }
                stack.push(width);
            } else if (width < stack[stack.length - 1]) {
                while (stack.length > 1 && width < stack[stack.length - 1]) { stack.pop(); }
                if (width !== stack[stack.length - 1]) {
                    return { error: "The indentation on line " + (i + 1) + " doesn't line up with any block above it. Fix that line first." };
                }
            } else if (previousEndsWithColon) {
                return { error: "Line " + (i + 1) + " should be indented, because the line before it ends with a colon." };
            }
            var newIndent = (stack.length - 1) * 4;
            delta = newIndent - width;
            result[i] = " ".repeat(newIndent) + text.trimStart();
            previousEndsWithColon = info.endsWithColon[i];
        }
        /* comment-only lines line up with the next line of code */
        var nextIndent = 0;
        for (var j = lines.length - 1; j >= 0; j--) {
            if (kinds[j] === "code") { nextIndent = indentWidth(result[j]); }
            else if (kinds[j] === "comment") { result[j] = " ".repeat(nextIndent) + lines[j].trim(); }
        }
        /* trailing spaces (never inside a multi-line string), blank-line tidy-up */
        var tidy = [];
        var blankRun = 0;
        for (var k = 0; k < result.length; k++) {
            var lineText = result[k];
            var endsInsideString = k + 1 < result.length && kinds[k + 1] === "string";
            if (!endsInsideString) { lineText = lineText.replace(/[ \t]+$/, ""); }
            if (kinds[k] === "blank") {
                blankRun++;
                if (blankRun > 2) { continue; }
                lineText = "";
            } else {
                blankRun = 0;
            }
            tidy.push(lineText);
        }
        while (tidy.length > 1 && tidy[0] === "") { tidy.shift(); }
        while (tidy.length > 1 && tidy[tidy.length - 1] === "") { tidy.pop(); }
        return { code: tidy.join("\n") };
    }

    /* ---------- buttons ---------- */
    runButton.addEventListener("click", function () { startProgram(); });
    stopButton.addEventListener("click", function () { stopProgram(); });
    clearButton.addEventListener("click", function () {
        if (session) { stopProgram(); }
        showPlaceholder();
        setNote("Output cleared.", "");
    });
    formatButton.addEventListener("click", function () {
        var formatted = formatPython(textarea.value);
        if (formatted.error) { setNote("Format left your code unchanged. " + formatted.error, "error"); return; }
        if (formatted.code === textarea.value) { setNote("Your code is already tidy.", "ok"); return; }
        textarea.focus();
        textarea.select();
        insertText(formatted.code);
        textarea.setSelectionRange(0, 0);
        textarea.scrollTop = 0;
        refreshEditor();
        setNote("Formatted: indentation is now 4 spaces, extra spaces and blank lines removed.", "ok");
    });
    inputSubmit.addEventListener("click", submitInput);
    inputField.addEventListener("keydown", function (event) {
        if (event.key === "Enter") { event.preventDefault(); submitInput(); }
    });

    EXAMPLES.forEach(function (example) {
        var button = document.createElement("button");
        button.type = "button";
        button.className = "pcw-example";
        button.textContent = example.name;
        button.addEventListener("click", function () {
            setCode(example.code);
            setNote("Loaded the \"" + example.name + "\" example. Press Run Python to try it.", "");
            textarea.focus();
            textarea.setSelectionRange(0, 0);
        });
        examplesBox.appendChild(button);
    });

    setCode(EXAMPLES[0].code);
    showPlaceholder();
})();
