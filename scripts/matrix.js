/**
 * Matrix Rain Animation
 * Classic falling characters effect for cyberpunk aesthetic
 */

class MatrixRain {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?/~`';
        this.fontSize = 14;
        this.columns = 0;
        this.drops = [];
        this.animationId = null;
        this.isVisible = true;
        this.lastFrameTime = 0;
        this.frameDelay = 80; // Milliseconds between frames (80ms = slower animation)

        this.init();
        this.setupVisibilityListener();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.draw();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        // Calculate number of columns based on screen width
        this.columns = Math.floor(this.canvas.width / this.fontSize);

        // Reduce density on mobile
        if (window.innerWidth < 768) {
            this.columns = Math.floor(this.columns * 0.5);
        }

        // Initialize drops array
        this.drops = [];
        for (let i = 0; i < this.columns; i++) {
            this.drops[i] = Math.floor(Math.random() * this.canvas.height / this.fontSize);
        }
    }

    draw(currentTime = 0) {
        // Throttle animation to frameDelay
        const elapsed = currentTime - this.lastFrameTime;

        if (elapsed < this.frameDelay) {
            // Continue animation loop but skip drawing
            if (this.isVisible) {
                this.animationId = requestAnimationFrame((time) => this.draw(time));
            }
            return;
        }

        this.lastFrameTime = currentTime;

        // Semi-transparent black rectangle for fade effect
        this.ctx.fillStyle = 'rgba(5, 8, 22, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Set text properties
        this.ctx.fillStyle = '#00ff9f'; // Neon cyan
        this.ctx.font = `${this.fontSize}px monospace`;

        // Draw characters
        for (let i = 0; i < this.drops.length; i++) {
            const char = this.characters[Math.floor(Math.random() * this.characters.length)];
            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;

            this.ctx.fillText(char, x, y);

            // Reset drop randomly
            if (y > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }

            this.drops[i]++;
        }

        // Continue animation
        if (this.isVisible) {
            this.animationId = requestAnimationFrame((time) => this.draw(time));
        }
    }

    setupVisibilityListener() {
        // Pause animation when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.isVisible = false;
                if (this.animationId) {
                    cancelAnimationFrame(this.animationId);
                }
            } else {
                this.isVisible = true;
                this.draw();
            }
        });
    }

    stop() {
        this.isVisible = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    start() {
        if (!this.isVisible) {
            this.isVisible = true;
            this.draw();
        }
    }
}

// Initialize matrix rain
function initMatrix() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) {
        console.warn('Matrix canvas not found');
        return;
    }

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        canvas.style.display = 'none';
        return;
    }

    const matrixRain = new MatrixRain(canvas);

    // Expose globally for debugging
    window.matrixRain = matrixRain;
}
