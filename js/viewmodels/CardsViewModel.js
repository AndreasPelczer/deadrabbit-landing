/**
 * ===========================================
 * CARDS VIEW MODEL
 * Maus-Following Glow & Reveal Animationen
 * ===========================================
 */

import { appState } from '../models/AppState.js';

export class CardsViewModel {
  constructor() {
    this.cards = [];
    this.observer = null;

    this.init();
  }

  init() {
    this.cards = document.querySelectorAll('.card');

    if (!this.cards.length) return;

    // Maus-Tracking für jeden Card
    this.cards.forEach(card => {
      this.setupCardMouseTracking(card);
    });

    // Intersection Observer für Reveal
    this.setupRevealObserver();
  }

  /**
   * Maus-Position in Card tracken für Glow-Effekt
   */
  setupCardMouseTracking(card) {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();

      // Position relativ zur Card
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Als Prozent für CSS
      const percentX = (x / rect.width) * 100;
      const percentY = (y / rect.height) * 100;

      // CSS Custom Properties setzen
      card.style.setProperty('--mx', `${percentX}%`);
      card.style.setProperty('--my', `${percentY}%`);
    });

    // Reset bei Mouse Leave
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--mx', '50%');
      card.style.setProperty('--my', '50%');
    });
  }

  /**
   * Intersection Observer für Scroll-Reveal
   */
  setupRevealObserver() {
    const options = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('card--visible');
          // Optional: Observer entfernen nach Reveal
          // this.observer.unobserve(entry.target);
        }
      });
    }, options);

    this.cards.forEach(card => {
      this.observer.observe(card);
    });
  }

  /**
   * Cleanup
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
