/**
 * ===========================================
 * MAIN APPLICATION
 * Dead Rabbit Productions - Landing Page
 *
 * MVVM Architecture:
 * - Models: Daten & Zustand
 * - ViewModels: Logik & Bindungen
 * - Views: HTML (deklarativ)
 * ===========================================
 */

import { appState } from './models/AppState.js';
import { HeroViewModel } from './viewmodels/HeroViewModel.js';
import { CardsViewModel } from './viewmodels/CardsViewModel.js';
import { AmbientViewModel } from './viewmodels/AmbientViewModel.js';

class App {
  constructor() {
    this.viewModels = {};
    this.isReady = false;

    // Warten auf DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  /**
   * Initialisierung
   */
  init() {
    console.log('🐰 Dead Rabbit Productions - Initialisiere...');

    // Event Listeners für globalen State
    this.setupGlobalListeners();

    // ViewModels initialisieren
    this.viewModels.hero = new HeroViewModel();
    this.viewModels.cards = new CardsViewModel();
    this.viewModels.ambient = new AmbientViewModel();

    // Smooth Scroll für Anchor Links
    this.setupSmoothScroll();

    // Loading-State entfernen
    this.onReady();

    console.log('✅ App bereit');
  }

  /**
   * Globale Event Listeners
   */
  setupGlobalListeners() {
    // Scroll Tracking (mit Throttle)
    let scrollTicking = false;

    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        requestAnimationFrame(() => {
          appState.updateScroll(window.scrollY);
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    }, { passive: true });

    // Maus Tracking
    window.addEventListener('mousemove', (e) => {
      appState.updateMouse(e.clientX, e.clientY);
    }, { passive: true });

    // Resize Tracking (mit Debounce)
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        appState.updateViewport();
      }, 150);
    });

    // Initial viewport update
    appState.updateViewport();
  }

  /**
   * Smooth Scroll für interne Links
   */
  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));

        if (target) {
          const offset = 80; // Header-Höhe
          const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  /**
   * App ist bereit
   */
  onReady() {
    this.isReady = true;

    // Body-Klasse für CSS-Animationen
    document.body.classList.add('app-ready');

    // Initiales Scroll-Event für korrekte Darstellung
    appState.updateScroll(window.scrollY);
  }

  /**
   * Cleanup (für SPA-Navigation)
   */
  destroy() {
    Object.values(this.viewModels).forEach(vm => {
      if (vm.destroy) vm.destroy();
    });
  }
}

// App starten
const app = new App();

// Global verfügbar für Debugging
window.deadRabbitApp = app;
window.appState = appState;
