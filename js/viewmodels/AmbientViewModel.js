/**
 * ===========================================
 * AMBIENT VIEW MODEL
 * Atmosphärische Effekte - Das gewisse Extra
 * ===========================================
 */

import { appState } from '../models/AppState.js';

export class AmbientViewModel {
  constructor() {
    this.cursorGlow = null;
    this.scrollProgress = null;
    this.dividers = [];
    this.sections = [];

    // Throttle-Timer
    this.mouseThrottle = null;
    this.scrollThrottle = null;

    this.init();
  }

  init() {
    this.createCursorGlow();
    this.createScrollProgress();
    this.setupDividers();
    this.setupSectionObserver();

    // State abonnieren
    appState.subscribe((property, value) => {
      if (property === 'mouse') {
        this.onMouseMove(value);
      }
      if (property === 'scroll') {
        this.onScroll(value);
      }
    });
  }

  /**
   * Cursor Glow Element erstellen
   */
  createCursorGlow() {
    // Nur auf Desktop
    if (appState.isMobile) return;

    this.cursorGlow = document.createElement('div');
    this.cursorGlow.className = 'cursor-glow';
    document.body.appendChild(this.cursorGlow);

    // Nach kurzer Verzögerung aktivieren
    setTimeout(() => {
      this.cursorGlow.classList.add('cursor-glow--active');
    }, 1000);
  }

  /**
   * Scroll Progress Bar erstellen
   */
  createScrollProgress() {
    this.scrollProgress = document.createElement('div');
    this.scrollProgress.className = 'scroll-progress';
    document.body.appendChild(this.scrollProgress);
  }

  /**
   * Divider-Animationen einrichten
   */
  setupDividers() {
    this.dividers = document.querySelectorAll('.divider');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('divider--visible');
        }
      });
    }, {
      threshold: 0.5
    });

    this.dividers.forEach(divider => observer.observe(divider));
  }

  /**
   * Section-Observer für aktive Sektion
   */
  setupSectionObserver() {
    this.sections = document.querySelectorAll('.section');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          appState.activeSection = entry.target.id;
        }
      });
    }, {
      rootMargin: '-50% 0px -50% 0px'
    });

    this.sections.forEach(section => observer.observe(section));
  }

  /**
   * Maus-Bewegung Handler
   */
  onMouseMove({ x, y }) {
    if (!this.cursorGlow || appState.isMobile) return;

    // Throttle für Performance
    if (this.mouseThrottle) return;

    this.mouseThrottle = requestAnimationFrame(() => {
      this.cursorGlow.style.left = `${x}px`;
      this.cursorGlow.style.top = `${y}px`;
      this.mouseThrottle = null;
    });
  }

  /**
   * Scroll Handler
   */
  onScroll({ scrollProgress }) {
    if (!this.scrollProgress) return;

    // Progress Bar aktualisieren
    this.scrollProgress.style.transform = `scaleX(${scrollProgress})`;
  }

  /**
   * Cleanup
   */
  destroy() {
    if (this.cursorGlow) {
      this.cursorGlow.remove();
    }
    if (this.scrollProgress) {
      this.scrollProgress.remove();
    }
  }
}
