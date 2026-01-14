/**
 * Animation Effects
 * Terminal typing and scroll-triggered animations
 */

/**
 * Terminal Typer Class
 * Creates character-by-character typing effect
 */
class TerminalTyper {
    constructor(element, lines, speed = 50) {
        this.element = element;
        this.lines = Array.isArray(lines) ? lines : [lines];
        this.speed = speed;
        this.currentLine = 0;
        this.currentChar = 0;
    }

    async typeMultiline() {
        this.element.innerHTML = '';

        for (let i = 0; i < this.lines.length; i++) {
            const lineElement = document.createElement('p');
            lineElement.className = 'mb-2 text-gray-300';
            this.element.appendChild(lineElement);

            await this.typeLine(lineElement, this.lines[i]);

            // Add delay between lines
            if (i < this.lines.length - 1) {
                await this.delay(300);
            }
        }
    }

    async typeLine(element, text) {
        // Add cursor
        const cursor = document.createElement('span');
        cursor.className = 'terminal-cursor';
        element.appendChild(cursor);

        for (let i = 0; i < text.length; i++) {
            const char = text.charAt(i);
            const textNode = document.createTextNode(char);
            element.insertBefore(textNode, cursor);

            await this.delay(this.speed);
        }

        // Remove cursor after typing completes
        setTimeout(() => {
            if (cursor.parentNode) {
                cursor.remove();
            }
        }, 500);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

/**
 * Scroll Animator Class
 * Triggers animations when elements enter viewport
 */
class ScrollAnimator {
    constructor() {
        this.observer = new IntersectionObserver(
            this.onIntersect.bind(this),
            {
                threshold: 0.1,
                rootMargin: '0px 0px -100px 0px'
            }
        );
    }

    observe(elements) {
        if (!elements) return;

        if (NodeList.prototype.isPrototypeOf(elements) || Array.isArray(elements)) {
            elements.forEach(el => this.observer.observe(el));
        } else {
            this.observer.observe(elements);
        }
    }

    onIntersect(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                // Don't unobserve to allow repeated animations if needed
                // this.observer.unobserve(entry.target);
            }
        });
    }

    disconnect() {
        this.observer.disconnect();
    }
}

/**
 * Initialize animations
 */
function initAnimations() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        // Show all content immediately without animations
        document.querySelectorAll('.fade-in, .slide-up, .slide-left, .slide-right').forEach(el => {
            el.classList.add('animate-in');
        });
        return;
    }

    // Setup scroll animator
    const scrollAnimator = new ScrollAnimator();

    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.fade-in, .slide-up, .slide-left, .slide-right');
    scrollAnimator.observe(animatedElements);

    // Expose globally
    window.scrollAnimator = scrollAnimator;
}

/**
 * Stagger animation helper
 * Adds staggered animation delays to child elements
 */
function staggerAnimation(container, delay = 100) {
    if (!container) return;

    const children = container.children;
    Array.from(children).forEach((child, index) => {
        child.style.transitionDelay = `${index * delay}ms`;
    });
}

/**
 * Add pulse animation to element
 */
function pulseElement(element, duration = 1000) {
    if (!element) return;

    element.classList.add('pulse');
    setTimeout(() => {
        element.classList.remove('pulse');
    }, duration);
}

/**
 * Add glow pulse to element
 */
function glowPulse(element, duration = 2000) {
    if (!element) return;

    element.classList.add('glow-pulse');
    setTimeout(() => {
        element.classList.remove('glow-pulse');
    }, duration);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TerminalTyper,
        ScrollAnimator,
        staggerAnimation,
        pulseElement,
        glowPulse
    };
}
