/* ============================================================
 * portfolio.js — Portfolio Landing Page Controller
 * ============================================================
 * - Mode Toggle (Mensch / Coder)
 * - Terminal Typing Effect
 * - Scroll Observer (Fade-In)
 * - Mobile Navigation
 * - Game of Life Easter Egg
 * ============================================================ */

(function () {
    'use strict';

    /* ---------------------------------------------------
     * STATE
     * --------------------------------------------------- */
    var State = {
        mode: localStorage.getItem('pelczer-mode') || 'human',
        mobileNavOpen: false,
        golActive: false,
        golInterval: null
    };

    /* ---------------------------------------------------
     * MODE TOGGLE
     * --------------------------------------------------- */
    function initModeToggle() {
        var toggle = document.getElementById('modeToggle');
        var label = document.getElementById('modeLabel');
        if (!toggle || !label) return;

        applyMode(State.mode);

        toggle.addEventListener('click', function () {
            State.mode = State.mode === 'human' ? 'coder' : 'human';
            applyMode(State.mode);
            localStorage.setItem('pelczer-mode', State.mode);
        });
    }

    function applyMode(mode) {
        document.body.setAttribute('data-mode', mode);
        var label = document.getElementById('modeLabel');
        if (label) {
            label.textContent = mode === 'coder' ? '</dev>' : 'Mensch';
        }
    }

    /* ---------------------------------------------------
     * TERMINAL TYPING EFFECT
     * --------------------------------------------------- */
    function initTerminal() {
        var textEl = document.getElementById('terminalText');
        if (!textEl) return;

        var text = 'cat ./identity.txt';
        var i = 0;

        function type() {
            if (i < text.length) {
                textEl.textContent += text.charAt(i);
                i++;
                setTimeout(type, 50 + Math.random() * 40);
            }
        }

        // Start after a short pause
        setTimeout(type, 600);
    }

    /* ---------------------------------------------------
     * SCROLL OBSERVER
     * --------------------------------------------------- */
    function initScrollObserver() {
        if (!('IntersectionObserver' in window)) {
            document.querySelectorAll('.fade-in').forEach(function (el) {
                el.classList.add('visible');
            });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.08 });

        document.querySelectorAll('.fade-in').forEach(function (el) {
            observer.observe(el);
        });
    }

    /* ---------------------------------------------------
     * MOBILE NAVIGATION
     * --------------------------------------------------- */
    function initMobileNav() {
        var btn = document.getElementById('navMenuBtn');
        var links = document.getElementById('navLinks');
        if (!btn || !links) return;

        btn.addEventListener('click', function () {
            State.mobileNavOpen = !State.mobileNavOpen;
            links.classList.toggle('open', State.mobileNavOpen);
        });

        links.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () {
                State.mobileNavOpen = false;
                links.classList.remove('open');
            });
        });
    }

    /* ---------------------------------------------------
     * GAME OF LIFE — Easter Egg
     * 4 Regeln. Emergenz. Keine Steuerung.
     * --------------------------------------------------- */
    function initGameOfLife() {
        var trigger = document.getElementById('mementoMori');
        var wrap = document.getElementById('golWrap');
        var canvas = document.getElementById('golCanvas');
        if (!trigger || !canvas || !wrap) return;

        var ctx = canvas.getContext('2d');
        var cellSize = 4;
        var cols, rows, grid;

        function resize() {
            var w = Math.min(400, window.innerWidth - 48);
            canvas.width = w;
            canvas.height = Math.floor(w * 0.6);
            cols = Math.floor(canvas.width / cellSize);
            rows = Math.floor(canvas.height / cellSize);
        }

        function randomGrid() {
            grid = [];
            for (var y = 0; y < rows; y++) {
                grid[y] = [];
                for (var x = 0; x < cols; x++) {
                    grid[y][x] = Math.random() > 0.7 ? 1 : 0;
                }
            }
        }

        function countNeighbors(g, x, y) {
            var sum = 0;
            for (var dy = -1; dy <= 1; dy++) {
                for (var dx = -1; dx <= 1; dx++) {
                    if (dx === 0 && dy === 0) continue;
                    var ny = (y + dy + rows) % rows;
                    var nx = (x + dx + cols) % cols;
                    sum += g[ny][nx];
                }
            }
            return sum;
        }

        function step() {
            var next = [];
            for (var y = 0; y < rows; y++) {
                next[y] = [];
                for (var x = 0; x < cols; x++) {
                    var n = countNeighbors(grid, x, y);
                    if (grid[y][x] === 1) {
                        next[y][x] = (n === 2 || n === 3) ? 1 : 0;
                    } else {
                        next[y][x] = (n === 3) ? 1 : 0;
                    }
                }
            }
            grid = next;
        }

        function draw() {
            var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
            var bg = getComputedStyle(document.documentElement).getPropertyValue('--bg-surface').trim();
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = accent;
            for (var y = 0; y < rows; y++) {
                for (var x = 0; x < cols; x++) {
                    if (grid[y][x] === 1) {
                        ctx.fillRect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1);
                    }
                }
            }
        }

        function tick() {
            step();
            draw();
        }

        trigger.addEventListener('click', function () {
            if (State.golActive) {
                State.golActive = false;
                clearInterval(State.golInterval);
                wrap.classList.remove('active');
                return;
            }

            State.golActive = true;
            wrap.classList.add('active');
            resize();
            randomGrid();
            draw();
            State.golInterval = setInterval(tick, 120);
        });
    }

    /* ---------------------------------------------------
     * INIT
     * --------------------------------------------------- */
    document.addEventListener('DOMContentLoaded', function () {
        initModeToggle();
        initTerminal();
        initScrollObserver();
        initMobileNav();
        initGameOfLife();
    });

})();
