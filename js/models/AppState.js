/**
 * ===========================================
 * APP STATE MODEL
 * Zentraler Zustand der Anwendung
 * ===========================================
 */

export class AppState {
  constructor() {
    // Scroll State
    this.scrollY = 0;
    this.scrollProgress = 0;
    this.isScrolling = false;
    this.scrollDirection = 'down';
    this.lastScrollY = 0;

    // Viewport
    this.viewportHeight = window.innerHeight;
    this.viewportWidth = window.innerWidth;
    this.isMobile = window.innerWidth < 768;

    // Mouse State
    this.mouseX = 0;
    this.mouseY = 0;
    this.isMouseMoving = false;

    // UI State
    this.heroVisible = true;
    this.activeSection = null;

    // Observers
    this._observers = [];
  }

  /**
   * Observer Pattern für reaktive Updates
   */
  subscribe(callback) {
    this._observers.push(callback);
    return () => {
      this._observers = this._observers.filter(obs => obs !== callback);
    };
  }

  notify(property, value) {
    this._observers.forEach(callback => callback(property, value, this));
  }

  /**
   * Scroll-Position aktualisieren
   */
  updateScroll(scrollY) {
    this.scrollDirection = scrollY > this.lastScrollY ? 'down' : 'up';
    this.lastScrollY = this.scrollY;
    this.scrollY = scrollY;

    // Scroll-Fortschritt berechnen (0-1)
    const documentHeight = document.documentElement.scrollHeight - this.viewportHeight;
    this.scrollProgress = Math.min(scrollY / documentHeight, 1);

    // Hero-Sichtbarkeit
    this.heroVisible = scrollY < this.viewportHeight * 0.8;

    this.notify('scroll', { scrollY, scrollProgress: this.scrollProgress });
  }

  /**
   * Maus-Position aktualisieren
   */
  updateMouse(x, y) {
    this.mouseX = x;
    this.mouseY = y;
    this.isMouseMoving = true;

    this.notify('mouse', { x, y });
  }

  /**
   * Viewport aktualisieren
   */
  updateViewport() {
    this.viewportHeight = window.innerHeight;
    this.viewportWidth = window.innerWidth;
    this.isMobile = window.innerWidth < 768;

    this.notify('viewport', {
      width: this.viewportWidth,
      height: this.viewportHeight,
      isMobile: this.isMobile
    });
  }
}

// Singleton Export
export const appState = new AppState();
