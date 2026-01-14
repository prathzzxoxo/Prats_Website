/**
 * Glitch Effects
 * Random glitch animations for cyberpunk aesthetic
 */

class GlitchEffect {
    constructor(selector = '.glitch') {
        this.elements = document.querySelectorAll(selector);
        this.isActive = false;
        this.init();
    }

    init() {
        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            return;
        }

        // Add hover listeners
        this.elements.forEach(el => {
            el.addEventListener('mouseenter', () => this.trigger(el));
        });

        // Schedule random glitches
        this.scheduleRandomGlitch();
    }

    trigger(element) {
        if (!element) return;

        // Add glitch-active class
        element.classList.add('glitch-active');

        // Remove after animation completes
        setTimeout(() => {
            element.classList.remove('glitch-active');
        }, 300);
    }

    scheduleRandomGlitch() {
        // Random delay between 10-30 seconds
        const delay = 10000 + Math.random() * 20000;

        setTimeout(() => {
            // Pick a random element
            if (this.elements.length > 0) {
                const randomIndex = Math.floor(Math.random() * this.elements.length);
                const randomEl = this.elements[randomIndex];
                this.trigger(randomEl);
            }

            // Schedule next glitch
            this.scheduleRandomGlitch();
        }, delay);
    }

    triggerAll() {
        this.elements.forEach(el => this.trigger(el));
    }

    stop() {
        this.isActive = false;
    }

    start() {
        this.isActive = true;
        this.scheduleRandomGlitch();
    }
}

/**
 * Glitch a specific element temporarily
 */
function glitchElement(element, duration = 300) {
    if (!element) return;

    element.classList.add('glitch-active');
    setTimeout(() => {
        element.classList.remove('glitch-active');
    }, duration);
}

/**
 * Add corrupted text effect
 */
function corruptText(element, duration = 500) {
    if (!element) return;

    element.classList.add('corrupted', 'glitch-active');
    setTimeout(() => {
        element.classList.remove('glitch-active');
    }, duration);
}

/**
 * Initialize glitch effects
 */
function initGlitchEffects() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        return;
    }

    // Initialize glitch effect for all .glitch elements
    const glitchEffect = new GlitchEffect('.glitch');

    // Add glitch to headings
    const headings = document.querySelectorAll('h1, h2, h3');
    headings.forEach(heading => {
        if (!heading.classList.contains('glitch')) {
            heading.classList.add('glitch');
            if (heading.textContent) {
                heading.setAttribute('data-text', heading.textContent.trim());
            }
        }
    });

    // Expose globally
    window.glitchEffect = glitchEffect;
    window.glitchElement = glitchElement;
}
