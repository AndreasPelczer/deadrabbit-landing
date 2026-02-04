/**
 * ===========================================
 * HERO VIEW MODEL
 * Sanfter Parallax & Scroll-Effekte
 * ===========================================
 */

import { appState } from '../models/AppState.js';

export class HeroViewModel {
  constructor() {
    this.hero = null;
    this.visual = null;
    this.image = null;
    this.gradient = null;
    this.floatingTexts = [];
    this.scrollHint = null;

    // Parallax-Einstellungen
    this.parallaxSpeed = 0.4;
    this.fadeStart = 0;
    this.fadeEnd = 0.7; // Viewport-Höhe

    // Animation Frame
    this.rafId = null;
    this.lastUpdate = 0;

    this.init();
  }

  init() {
    // DOM Elemente holen
    this.hero = document.querySelector('.hero');
    this.visual = document.querySelector('.hero__visual');
    this.image = document.querySelector('.hero__image');
    this.gradient = document.querySelector('.hero__gradient');
    this.floatingTexts = document.querySelectorAll('.hero__floating-text');
    this.scrollHint = document.querySelector('.hero__scroll-hint');

    if (!this.hero) return;

    // State abonnieren
    appState.subscribe((property, value) => {
      if (property === 'scroll') {
        this.onScroll(value);
      }
    });

    // Initial Update
    this.update();

    // Floating Texts mit Verzögerung einblenden
    this.revealFloatingTexts();
  }

  /**
   * Scroll-Handler mit Parallax
   */
  onScroll({ scrollY, scrollProgress }) {
    // RAF für smooth updates
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }

    this.rafId = requestAnimationFrame(() => {
      this.update();
    });
  }

  /**
   * Visuelles Update
   */
  update() {
    if (!this.visual) return;

    const scrollY = appState.scrollY;
    const vh = appState.viewportHeight;

    // Parallax-Bewegung (langsamer als Scroll)
    const parallaxY = scrollY * this.parallaxSpeed;

    // Sanfte Skalierung beim Scrollen
    const scaleProgress = Math.min(scrollY / vh, 1);
    const scale = 1.1 - (scaleProgress * 0.1); // 1.1 -> 1.0

    // Bild transformieren
    if (this.image) {
      this.image.style.transform = `
        translateY(${parallaxY}px)
        scale(${scale})
      `;
    }

    // Gradient-Intensität basierend auf Scroll
    if (this.gradient) {
      const gradientOpacity = Math.min(scrollY / (vh * 0.5), 1);
      this.gradient.style.setProperty('--gradient-intensity', gradientOpacity);
    }

    // Hero-Klasse für Scroll-State
    if (scrollY > vh * 0.2) {
      this.hero.classList.add('hero--scrolled');
    } else {
      this.hero.classList.remove('hero--scrolled');
    }

    // Scroll-Hint ausblenden
    if (this.scrollHint) {
      const hintOpacity = 1 - Math.min(scrollY / (vh * 0.3), 1);
      this.scrollHint.style.opacity = hintOpacity;
    }

    // Visual ausblenden wenn weit gescrollt
    const visualOpacity = 1 - Math.min(scrollY / (vh * this.fadeEnd), 1);
    this.visual.style.opacity = Math.max(visualOpacity, 0);
  }

  /**
   * Floating Texts animiert einblenden
   */
  revealFloatingTexts() {
    this.floatingTexts.forEach((text, index) => {
      setTimeout(() => {
        text.classList.add('hero__floating-text--visible');
      }, 1500 + (index * 500)); // Verzögert nach Page Load
    });
  }

  /**
   * Cleanup
   */
  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }
}
