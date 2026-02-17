/* ============================================================
 * easter-egg.js — Conway's Game of Life
 * ============================================================
 * Aktivierung: 3× auf "MEMENTO MORI" im Footer klicken.
 * Schließen: × Button oder ESC.
 * 
 * 4 Regeln. Keine Steuerung. Emergenz.
 * ============================================================ */

(function () {
    'use strict';

    /* ---- Konfiguration ---- */
    var CELL_SIZE = 8;
    var TICK_MS = 120;
    var CLICK_THRESHOLD = 3;
    var CLICK_TIMEOUT_MS = 800;
    var RANDOM_DENSITY = 0.7;  // Wahrscheinlichkeit einer toten Zelle

    /* ---- State ---- */
    var clickCount = 0;
    var clickTimer = null;
    var running = false;
    var interval = null;
    var grid = [];
    var cols, rows;

    /* ---- DOM Refs ---- */
    var overlay, canvas, ctx;

    /**
     * Initialisiert das Easter Egg.
     * Sucht den Trigger-Button und bindet Events.
     */
    function init() {
        var egg = document.getElementById('easterEgg');
        overlay = document.getElementById('golOverlay');
        canvas = document.getElementById('golCanvas');
        var closeBtn = document.getElementById('golClose');

        if (!egg || !overlay || !canvas) return;

        ctx = canvas.getContext('2d');
        cols = Math.floor(canvas.width / CELL_SIZE);
        rows = Math.floor(canvas.height / CELL_SIZE);

        // Trigger: 3× Klick auf MEMENTO MORI
        egg.addEventListener('click', handleEggClick);

        // Schließen
        if (closeBtn) closeBtn.addEventListener('click', stop);
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') stop();
        });

        // Zellen togglen per Klick
        canvas.addEventListener('click', handleCanvasClick);
    }

    /**
     * Zählt Klicks auf den Trigger. Bei 3 Klicks → Start.
     */
    function handleEggClick() {
        clickCount++;
        clearTimeout(clickTimer);
        clickTimer = setTimeout(function () { clickCount = 0; }, CLICK_TIMEOUT_MS);

        if (clickCount >= CLICK_THRESHOLD) {
            clickCount = 0;
            start();
        }
    }

    /**
     * Startet das Game of Life.
     * Erzeugt ein zufälliges Grid und beginnt die Simulation.
     */
    function start() {
        overlay.classList.add('active');

        // Grid mit Zufallswerten füllen
        grid = [];
        for (var y = 0; y < rows; y++) {
            var row = [];
            for (var x = 0; x < cols; x++) {
                row.push(Math.random() > RANDOM_DENSITY ? 1 : 0);
            }
            grid.push(row);
        }

        running = true;
        interval = setInterval(step, TICK_MS);
    }

    /**
     * Stoppt die Simulation und schließt das Overlay.
     */
    function stop() {
        overlay.classList.remove('active');
        running = false;
        clearInterval(interval);
    }

    /**
     * Ein Simulationsschritt: Wendet die 4 Regeln an.
     * - Einsamkeit: < 2 Nachbarn → Tod
     * - Überleben: 2-3 Nachbarn → lebt
     * - Überbevölkerung: > 3 Nachbarn → Tod
     * - Geburt: genau 3 Nachbarn → lebt
     */
    function step() {
        var next = grid.map(function (r) { return r.slice(); });

        for (var y = 0; y < rows; y++) {
            for (var x = 0; x < cols; x++) {
                var neighbors = countNeighbors(x, y);

                if (grid[y][x]) {
                    // Lebende Zelle
                    next[y][x] = (neighbors === 2 || neighbors === 3) ? 1 : 0;
                } else {
                    // Tote Zelle
                    next[y][x] = (neighbors === 3) ? 1 : 0;
                }
            }
        }

        grid = next;
        draw();
    }

    /**
     * Zählt die lebenden Nachbarn einer Zelle.
     * Toroidale Topologie (Ränder verbunden).
     * @param {number} cx - X-Position
     * @param {number} cy - Y-Position
     * @returns {number} Anzahl lebender Nachbarn
     */
    function countNeighbors(cx, cy) {
        var count = 0;
        for (var dy = -1; dy <= 1; dy++) {
            for (var dx = -1; dx <= 1; dx++) {
                if (dy === 0 && dx === 0) continue;
                var ny = (cy + dy + rows) % rows;
                var nx = (cx + dx + cols) % cols;
                count += grid[ny][nx];
            }
        }
        return count;
    }

    /**
     * Zeichnet das aktuelle Grid auf den Canvas.
     */
    function draw() {
        ctx.fillStyle = '#0D0D0D';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#E8863A';  // Accent-Farbe
        for (var y = 0; y < rows; y++) {
            for (var x = 0; x < cols; x++) {
                if (grid[y][x]) {
                    ctx.fillRect(
                        x * CELL_SIZE,
                        y * CELL_SIZE,
                        CELL_SIZE - 1,
                        CELL_SIZE - 1
                    );
                }
            }
        }
    }

    /**
     * Toggle einzelner Zellen per Klick auf den Canvas.
     */
    function handleCanvasClick(e) {
        var rect = canvas.getBoundingClientRect();
        var x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
        var y = Math.floor((e.clientY - rect.top) / CELL_SIZE);

        if (x >= 0 && x < cols && y >= 0 && y < rows) {
            grid[y][x] = grid[y][x] ? 0 : 1;
            draw();
        }
    }

    /* ---- Init on DOM Ready ---- */
    document.addEventListener('DOMContentLoaded', init);

})();
