/* ============================================================
 * easter-egg.js — Conway's Game of Life (MVVM Pattern)
 * ============================================================
 * Aktivierung: 3× auf "MEMENTO MORI" im Footer klicken.
 * Schließen: × Button oder ESC.
 *
 * Architecture:
 * - Model: Grid state, patterns, rules
 * - ViewModel: Business logic, state management
 * - View: DOM manipulation, rendering, events
 *
 * 4 Regeln. Keine Steuerung. Emergenz.
 * ============================================================ */

(function () {
    'use strict';

    /* ============================================================
     * MODEL — Grid State & Pattern Definitions
     * ============================================================ */
    const ConwayModel = {
        grid: [],
        cols: 0,
        rows: 0,
        generation: 0,

        patterns: {
            glider: [[0, 1], [1, 2], [2, 0], [2, 1], [2, 2]],
            blinker: [[0, 0], [0, 1], [0, 2]],
            pulsar: (() => {
                const p = [];
                const offsets = [
                    [-6, -4], [-6, -3], [-6, -2], [-6, 2], [-6, 3], [-6, 4],
                    [-4, -6], [-3, -6], [-2, -6], [-4, -1], [-3, -1], [-2, -1],
                    [-4, 1], [-3, 1], [-2, 1], [-4, 6], [-3, 6], [-2, 6],
                    [-1, -4], [-1, -3], [-1, -2], [-1, 2], [-1, 3], [-1, 4],
                ];
                offsets.forEach(([r, c]) => {
                    p.push([r, c], [-r, c], [r, -c], [-r, -c]);
                });
                const seen = new Set();
                return p.filter(([r, c]) => {
                    const key = `${r},${c}`;
                    if (seen.has(key)) return false;
                    seen.add(key);
                    return true;
                });
            })(),
            glidergun: [
                [0, 24], [1, 22], [1, 24], [2, 12], [2, 13], [2, 20], [2, 21], [2, 34], [2, 35],
                [3, 11], [3, 15], [3, 20], [3, 21], [3, 34], [3, 35], [4, 0], [4, 1], [4, 10],
                [4, 16], [4, 20], [4, 21], [5, 0], [5, 1], [5, 10], [5, 14], [5, 16], [5, 17],
                [5, 22], [5, 24], [6, 10], [6, 16], [6, 24], [7, 11], [7, 15], [8, 12], [8, 13]
            ],
            acorn: [[0, 1], [1, 3], [2, 0], [2, 1], [2, 4], [2, 5], [2, 6]],
            rpentomino: [[0, 1], [0, 2], [1, 0], [1, 1], [2, 1]],
        },

        initialize(cols, rows) {
            this.cols = cols;
            this.rows = rows;
            this.grid = this.createEmptyGrid();
            this.generation = 0;
        },

        createEmptyGrid() {
            return Array.from({ length: this.rows }, () => new Uint8Array(this.cols));
        },

        getCell(row, col) {
            if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) return 0;
            return this.grid[row][col];
        },

        setCell(row, col, value) {
            if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
                this.grid[row][col] = value;
            }
        },

        toggleCell(row, col) {
            if (row >= 0 && row < this.rows && col >= 0 && col >= 0 && col < this.cols) {
                this.grid[row][col] = this.grid[row][col] ? 0 : 1;
            }
        },

        clear() {
            this.grid = this.createEmptyGrid();
            this.generation = 0;
        },

        randomize(density = 0.25) {
            for (let r = 0; r < this.rows; r++) {
                for (let c = 0; c < this.cols; c++) {
                    this.grid[r][c] = Math.random() < density ? 1 : 0;
                }
            }
            this.generation = 0;
        },

        loadPattern(patternName) {
            this.clear();
            const pattern = this.patterns[patternName];
            if (!pattern) return;

            const offsetX = patternName === 'glidergun' ? 5 : Math.floor(this.cols / 2);
            const offsetY = patternName === 'glidergun' ? 5 : Math.floor(this.rows / 2);

            pattern.forEach(([r, c]) => {
                const row = offsetY + r;
                const col = offsetX + c;
                this.setCell(row, col, 1);
            });
        },

        getPopulation() {
            let count = 0;
            for (let r = 0; r < this.rows; r++) {
                for (let c = 0; c < this.cols; c++) {
                    count += this.grid[r][c];
                }
            }
            return count;
        },

        countNeighbors(row, col) {
            let count = 0;
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    const r = (row + dr + this.rows) % this.rows;
                    const c = (col + dc + this.cols) % this.cols;
                    count += this.grid[r][c];
                }
            }
            return count;
        }
    };

    /* ============================================================
     * VIEWMODEL — Business Logic & State Management
     * ============================================================ */
    const ConwayViewModel = {
        model: ConwayModel,
        running: false,
        interval: null,
        config: {
            cellSize: 8,
            tickMs: 100,
            clickThreshold: 3,
            clickTimeout: 800,
        },

        clickCount: 0,
        clickTimer: null,

        initialize(cols, rows) {
            this.model.initialize(cols, rows);
        },

        step() {
            const next = this.model.createEmptyGrid();

            for (let r = 0; r < this.model.rows; r++) {
                for (let c = 0; c < this.model.cols; c++) {
                    const neighbors = this.model.countNeighbors(r, c);
                    const alive = this.model.getCell(r, c);

                    if (alive) {
                        // Conway's Rules: Survival
                        next[r][c] = (neighbors === 2 || neighbors === 3) ? 1 : 0;
                    } else {
                        // Conway's Rules: Birth
                        next[r][c] = (neighbors === 3) ? 1 : 0;
                    }
                }
            }

            this.model.grid = next;
            this.model.generation++;
        },

        play() {
            if (this.running) return;
            this.running = true;
            this.interval = setInterval(() => {
                this.step();
                ConwayView.render();
            }, this.config.tickMs);
        },

        pause() {
            if (!this.running) return;
            this.running = false;
            clearInterval(this.interval);
        },

        togglePlayPause() {
            if (this.running) {
                this.pause();
            } else {
                this.play();
            }
        },

        clear() {
            this.pause();
            this.model.clear();
        },

        loadPattern(patternName) {
            this.pause();
            if (patternName === 'random') {
                this.model.randomize();
            } else {
                this.model.loadPattern(patternName);
            }
        },

        handleEggClick() {
            this.clickCount++;
            clearTimeout(this.clickTimer);
            this.clickTimer = setTimeout(() => {
                this.clickCount = 0;
            }, this.config.clickTimeout);

            if (this.clickCount >= this.config.clickThreshold) {
                this.clickCount = 0;
                ConwayView.open();
            }
        },

        getCellFromCoords(x, y) {
            const col = Math.floor(x / this.config.cellSize);
            const row = Math.floor(y / this.config.cellSize);
            if (row >= 0 && row < this.model.rows && col >= 0 && col < this.model.cols) {
                return { row, col };
            }
            return null;
        }
    };

    /* ============================================================
     * VIEW — DOM Manipulation, Rendering, Events
     * ============================================================ */
    const ConwayView = {
        viewModel: ConwayViewModel,
        elements: {},
        canvas: null,
        ctx: null,
        isDrawing: false,
        drawValue: 1,

        initialize() {
            // Cache DOM elements
            this.elements = {
                trigger: document.getElementById('easterEgg'),
                overlay: document.getElementById('golOverlay'),
                canvas: document.getElementById('golCanvas'),
                closeBtn: document.getElementById('golClose'),
                playPauseBtn: document.getElementById('golPlayPause'),
                stepBtn: document.getElementById('golStep'),
                clearBtn: document.getElementById('golClear'),
                patternBtns: document.querySelectorAll('.gol-patterns button'),
                generationSpan: document.getElementById('golGeneration'),
                populationSpan: document.getElementById('golPopulation'),
            };

            if (!this.elements.trigger || !this.elements.overlay || !this.elements.canvas) {
                console.warn('Easter Egg elements not found');
                return;
            }

            this.canvas = this.elements.canvas;
            this.ctx = this.canvas.getContext('2d');

            // Setup canvas size
            const maxWidth = Math.min(window.innerWidth - 40, 640);
            const cols = Math.floor(maxWidth / this.viewModel.config.cellSize);
            const rows = Math.floor((window.innerHeight * 0.5) / this.viewModel.config.cellSize);

            this.canvas.width = cols * this.viewModel.config.cellSize;
            this.canvas.height = rows * this.viewModel.config.cellSize;

            this.viewModel.initialize(cols, rows);

            this.bindEvents();
        },

        bindEvents() {
            // Trigger
            this.elements.trigger.addEventListener('click', () => {
                this.viewModel.handleEggClick();
            });

            // Close
            this.elements.closeBtn.addEventListener('click', () => {
                this.close();
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.elements.overlay.classList.contains('active')) {
                    this.close();
                }
            });

            // Controls
            this.elements.playPauseBtn.addEventListener('click', () => {
                this.viewModel.togglePlayPause();
                this.updatePlayPauseButton();
            });

            this.elements.stepBtn.addEventListener('click', () => {
                this.viewModel.step();
                this.render();
            });

            this.elements.clearBtn.addEventListener('click', () => {
                this.viewModel.clear();
                this.render();
            });

            // Patterns
            this.elements.patternBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const pattern = btn.dataset.pattern;
                    this.viewModel.loadPattern(pattern);
                    this.render();
                });
            });

            // Canvas drawing
            this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
            this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
            this.canvas.addEventListener('mouseup', () => this.isDrawing = false);
            this.canvas.addEventListener('mouseleave', () => this.isDrawing = false);

            // Touch support
            this.canvas.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                this.handleMouseDown(touch);
            }, { passive: false });

            this.canvas.addEventListener('touchmove', (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                this.handleMouseMove(touch);
            }, { passive: false });

            this.canvas.addEventListener('touchend', () => this.isDrawing = false);
        },

        handleMouseDown(e) {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cell = this.viewModel.getCellFromCoords(x, y);

            if (cell) {
                this.isDrawing = true;
                this.drawValue = this.viewModel.model.getCell(cell.row, cell.col) ? 0 : 1;
                this.viewModel.model.setCell(cell.row, cell.col, this.drawValue);
                this.render();
            }
        },

        handleMouseMove(e) {
            if (!this.isDrawing) return;

            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cell = this.viewModel.getCellFromCoords(x, y);

            if (cell) {
                this.viewModel.model.setCell(cell.row, cell.col, this.drawValue);
                this.render();
            }
        },

        open() {
            this.elements.overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            this.viewModel.loadPattern('glider');
            this.render();
        },

        close() {
            this.elements.overlay.classList.remove('active');
            document.body.style.overflow = '';
            this.viewModel.pause();
            this.updatePlayPauseButton();
        },

        updatePlayPauseButton() {
            if (this.viewModel.running) {
                this.elements.playPauseBtn.textContent = '⏸ Pause';
                this.elements.playPauseBtn.classList.add('active');
            } else {
                this.elements.playPauseBtn.textContent = '▶ Start';
                this.elements.playPauseBtn.classList.remove('active');
            }
        },

        render() {
            const model = this.viewModel.model;

            // Clear canvas
            this.ctx.fillStyle = '#0a0a0a';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // Draw subtle grid
            this.ctx.strokeStyle = '#151515';
            this.ctx.lineWidth = 0.5;
            for (let x = 0; x <= model.cols; x++) {
                this.ctx.beginPath();
                this.ctx.moveTo(x * this.viewModel.config.cellSize, 0);
                this.ctx.lineTo(x * this.viewModel.config.cellSize, model.rows * this.viewModel.config.cellSize);
                this.ctx.stroke();
            }
            for (let y = 0; y <= model.rows; y++) {
                this.ctx.beginPath();
                this.ctx.moveTo(0, y * this.viewModel.config.cellSize);
                this.ctx.lineTo(model.cols * this.viewModel.config.cellSize, y * this.viewModel.config.cellSize);
                this.ctx.stroke();
            }

            // Draw cells with color coding based on neighbors
            for (let r = 0; r < model.rows; r++) {
                for (let c = 0; c < model.cols; c++) {
                    if (model.getCell(r, c)) {
                        const neighbors = model.countNeighbors(r, c);

                        // Color coding: Red = will die, Green = birth, Orange = survival
                        if (neighbors < 2 || neighbors > 3) {
                            this.ctx.fillStyle = '#ff4444'; // Will die
                        } else {
                            this.ctx.fillStyle = '#E8863A'; // Will survive (accent color)
                        }

                        this.ctx.fillRect(
                            c * this.viewModel.config.cellSize + 1,
                            r * this.viewModel.config.cellSize + 1,
                            this.viewModel.config.cellSize - 2,
                            this.viewModel.config.cellSize - 2
                        );
                    } else {
                        // Check if dead cell will be born
                        const neighbors = model.countNeighbors(r, c);
                        if (neighbors === 3) {
                            this.ctx.fillStyle = '#44ff88'; // Will be born
                            this.ctx.fillRect(
                                c * this.viewModel.config.cellSize + 1,
                                r * this.viewModel.config.cellSize + 1,
                                this.viewModel.config.cellSize - 2,
                                this.viewModel.config.cellSize - 2
                            );
                        }
                    }
                }
            }

            // Update stats
            this.elements.generationSpan.textContent = model.generation;
            this.elements.populationSpan.textContent = model.getPopulation();
        }
    };

    /* ============================================================
     * INITIALIZATION
     * ============================================================ */
    document.addEventListener('DOMContentLoaded', () => {
        ConwayView.initialize();
    });

})();
