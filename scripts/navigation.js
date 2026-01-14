/**
 * Navigation System
 * Smooth scrolling and active section highlighting
 */

class Navigation {
    constructor() {
        this.sections = document.querySelectorAll('section[id]');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.init();
    }

    init() {
        this.setupSmoothScroll();
        this.setupActiveSection();
        this.setupMobileMenu();
    }

    setupSmoothScroll() {
        // Add click listeners to all nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').slice(1);
                const target = document.getElementById(targetId);

                if (target) {
                    // Close mobile menu if open
                    if (this.mobileMenu && !this.mobileMenu.classList.contains('hidden')) {
                        this.mobileMenu.classList.add('hidden');
                    }

                    // Scroll to target
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupActiveSection() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.setActiveLink(entry.target.id);
                    }
                });
            },
            {
                threshold: 0.3,
                rootMargin: '-100px 0px -50% 0px'
            }
        );

        this.sections.forEach(section => observer.observe(section));
    }

    setActiveLink(sectionId) {
        // Remove active class from all links
        this.navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to matching link
        this.navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }

    setupMobileMenu() {
        if (!this.mobileMenuBtn || !this.mobileMenu) return;

        this.mobileMenuBtn.addEventListener('click', () => {
            this.mobileMenu.classList.toggle('hidden');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.mobileMenuBtn.contains(e.target) && !this.mobileMenu.contains(e.target)) {
                this.mobileMenu.classList.add('hidden');
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.mobileMenu.classList.contains('hidden')) {
                this.mobileMenu.classList.add('hidden');
            }
        });
    }
}

/**
 * Initialize navigation
 */
function initNavigation() {
    const navigation = new Navigation();
    window.navigation = navigation;
}
