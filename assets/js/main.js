/* ============================================================
 * main.js — App Controller
 * ============================================================
 * Verantwortlich für:
 * - Mode Toggle (Mensch / Coder)
 * - Scroll Observer (Fade-In Animationen)
 * - Mobile Navigation
 * 
 * MVVM-Rolle: MODEL + VIEWMODEL
 * Verwaltet den App-Zustand und bindet ihn an die View.
 * ============================================================ */

(function () {
    'use strict';

    /* -------------------------------------------------------
     * MODEL — App State
     * ------------------------------------------------------- */
    const State = {
        mode: localStorage.getItem('pelczer-mode') || 'human',
        mobileNavOpen: false,
    };

    /* -------------------------------------------------------
     * VIEWMODEL — DOM Bindings
     * ------------------------------------------------------- */

    /**
     * Initialisiert den Mode Toggle.
     * Liest gespeicherte Präferenz, setzt data-mode auf <body>,
     * und registriert Click-Handler.
     */
    function initModeToggle() {
        const toggle = document.getElementById('modeToggle');
        const label = document.getElementById('modeLabel');
        if (!toggle || !label) return;

        // Initialen Zustand setzen
        applyMode(State.mode);

        toggle.addEventListener('click', function () {
            State.mode = State.mode === 'human' ? 'coder' : 'human';
            applyMode(State.mode);
            localStorage.setItem('pelczer-mode', State.mode);
        });
    }

    /**
     * Wendet den aktuellen Mode auf die View an.
     * @param {string} mode - 'human' oder 'coder'
     */
    function applyMode(mode) {
        document.body.setAttribute('data-mode', mode);
        const label = document.getElementById('modeLabel');
        if (label) {
            label.textContent = mode === 'coder' ? '< /dev >' : 'Mensch';
        }
    }

    /**
     * Initialisiert den Intersection Observer für Fade-In-Animationen.
     * Elemente mit .fade-in werden sichtbar, sobald sie im Viewport sind.
     */
    function initScrollObserver() {
        if (!('IntersectionObserver' in window)) {
            // Fallback: Alles sofort sichtbar
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
        }, { threshold: 0.1 });

        document.querySelectorAll('.fade-in').forEach(function (el) {
            observer.observe(el);
        });
    }

    /**
     * Mobile Navigation Toggle.
     */
    function initMobileNav() {
        const btn = document.getElementById('navMenuBtn');
        const links = document.getElementById('navLinks');
        if (!btn || !links) return;

        btn.addEventListener('click', function () {
            State.mobileNavOpen = !State.mobileNavOpen;
            links.classList.toggle('open', State.mobileNavOpen);
        });

        // Schließen bei Link-Klick
        links.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () {
                State.mobileNavOpen = false;
                links.classList.remove('open');
            });
        });
    }

    /**
     * iMOPS Sentinel Logo Scroll Behavior.
     * Rotiert das Logo subtil beim Scrollen und aktiviert es,
     * wenn die Apps-Sektion sichtbar wird.
     */
    function initSentinel() {
        const sentinel = document.getElementById('sentinel');
        const sentinelLogo = sentinel ? sentinel.querySelector('.sentinel__logo') : null;
        const appsSection = document.getElementById('apps');

        if (!sentinel || !sentinelLogo) return;

        // Scroll-linked subtle rotation
        window.addEventListener('scroll', function () {
            const scrollProgress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
            const rotation = scrollProgress * 8; // 0° to 8° over full page
            sentinelLogo.style.transform = 'rotate(' + rotation + 'deg)';
        }, { passive: true });

        // Activate when apps section is in view
        if (appsSection && 'IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    sentinel.classList.toggle('sentinel--active', entry.isIntersecting);
                });
            }, { threshold: 0.3 });

            observer.observe(appsSection);
        }
    }

    /* -------------------------------------------------------
     * INIT — Alles starten wenn DOM bereit
     * ------------------------------------------------------- */
    document.addEventListener('DOMContentLoaded', function () {
        initModeToggle();
        initScrollObserver();
        initMobileNav();
        initSentinel();
    });

})();
