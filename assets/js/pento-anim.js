/* root2.in — pentomino lab animations (no dependencies).
   1) Recursion demo: replays a recorded backtracking trace (place / take back / try).
   2) Prompt → code: types a prompt as if into Copilot, then reveals generated code.
   Both start when scrolled into view and respect prefers-reduced-motion. */
(function () {
  "use strict";

  var reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function onVisible(el, cb, opts) {
    if (!("IntersectionObserver" in window)) {
      cb(true);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        cb(e.isIntersecting);
      });
    }, opts || { threshold: 0.35 });
    io.observe(el);
  }

  /* ---------------- 1) recursion demo ---------------- */
  (function recursion() {
    var root = document.getElementById("pento-recursion");
    if (!root || !window.PENTO_REC) return;

    var data = window.PENTO_REC;
    var board = root.querySelector(".rec-board");
    var note = root.querySelector(".rec-note");
    if (!board) return;

    board.style.setProperty("--cols", data.cols);
    var cells = [];
    var total = data.cols * data.rows;
    for (var i = 0; i < total; i++) {
      var span = document.createElement("span");
      span.className = "rec-cell";
      board.appendChild(span);
      cells.push(span);
    }

    var prev = null;
    function paint(frame) {
      var g = frame.grid;
      for (var r = 0; r < data.rows; r++) {
        for (var c = 0; c < data.cols; c++) {
          var ch = g[r].charAt(c);
          var cell = cells[r * data.cols + c];
          if (ch === ".") {
            cell.style.background = "";
            cell.className = "rec-cell";
          } else {
            cell.style.background = data.colors[ch] || "#c9c9d0";
            cell.className = "rec-cell on";
          }
        }
      }
      if (note) {
        note.textContent = frame.note;
        note.className =
          "rec-note" +
          (frame.note.indexOf("No fit") === 0 ? " back" : "");
      }
      prev = frame;
    }

    var idx = 0;
    paint(data.frames[0]);

    if (reduce) return; // static first frame is enough

    var timer = null;
    function step() {
      idx = (idx + 1) % data.frames.length;
      paint(data.frames[idx]);
    }
    onVisible(root, function (visible) {
      if (visible && !timer) {
        timer = setInterval(step, 1000);
      } else if (!visible && timer) {
        clearInterval(timer);
        timer = null;
      }
    });
  })();

  /* ---------------- 2) prompt → code ---------------- */
  (function promptToCode() {
    var root = document.getElementById("pento-prompt");
    if (!root) return;

    var promptEl = root.querySelector(".pa-prompt");
    var codeEl = root.querySelector(".pa-code");
    var fileEl = root.querySelector(".pa-file");
    if (!promptEl || !codeEl) return;

    var PROMPT =
      "Build a small, dependency-free web app that solves pentomino " +
      "puzzles. Represent each of the twelve pieces as a grid of 1s and " +
      "0s, generate every rotation and mirror, then use backtracking to " +
      "fill a 6\u00d710 board \u2014 always filling the first empty cell.";

    var CODE =
      "function solve(board) {\n" +
      "  const cell = firstEmpty(board);\n" +
      "  if (!cell) return record(board);\n" +
      "\n" +
      "  for (const piece of unused)\n" +
      "    for (const look of orientations[piece])\n" +
      "      for (const at of ways(look, cell))\n" +
      "        if (fits(board, at)) {\n" +
      "          place(board, at);\n" +
      "          solve(board);\n" +
      "          remove(board, at);   // backtrack\n" +
      "        }\n" +
      "}";

    if (reduce) {
      promptEl.textContent = PROMPT;
      codeEl.textContent = CODE;
      root.classList.add("show-both");
      return;
    }

    var running = false;
    var isVisible = false;

    function typePrompt() {
      var i = 0;
      var dur = 3400;
      var tick = 26;
      var stepN = Math.max(1, Math.round(PROMPT.length / (dur / tick)));
      promptEl.textContent = "";
      var t = setInterval(function () {
        i += stepN;
        promptEl.textContent =
          PROMPT.slice(0, i) + (i < PROMPT.length ? "\u258b" : "");
        if (i >= PROMPT.length) {
          clearInterval(t);
          setTimeout(toCode, 750);
        }
      }, tick);
    }

    function toCode() {
      root.classList.add("to-code");
      if (fileEl) fileEl.textContent = "solver.js";
      setTimeout(function () {
        root.classList.add("show-code");
        revealCode();
      }, 460);
    }

    function revealCode() {
      var lines = CODE.split("\n");
      codeEl.textContent = "";
      var i = 0;
      var t = setInterval(function () {
        codeEl.textContent += (i ? "\n" : "") + lines[i];
        i++;
        if (i >= lines.length) {
          clearInterval(t);
          setTimeout(resetLoop, 2800);
        }
      }, 130);
    }

    function resetLoop() {
      root.classList.remove("to-code", "show-code");
      if (fileEl) fileEl.textContent = "ask Copilot";
      promptEl.textContent = "";
      codeEl.textContent = "";
      running = false;
      if (isVisible) start();
    }

    function start() {
      if (running) return;
      running = true;
      typePrompt();
    }

    onVisible(
      root,
      function (visible) {
        isVisible = visible;
        if (visible) start();
      },
      { threshold: 0.4 }
    );
  })();
})();
