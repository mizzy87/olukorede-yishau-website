document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Functionality
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;

    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (themeIcon) {
                themeIcon.className = 'fas fa-sun';
            }
            if (themeToggleBtn) {
                themeToggleBtn.setAttribute('aria-label', 'Switch to light theme');
                themeToggleBtn.setAttribute('title', 'Switch to light theme');
            }
        } else {
            document.documentElement.removeAttribute('data-theme');
            if (themeIcon) {
                themeIcon.className = 'fas fa-moon';
            }
            if (themeToggleBtn) {
                themeToggleBtn.setAttribute('aria-label', 'Switch to dark theme');
                themeToggleBtn.setAttribute('title', 'Switch to dark theme');
            }
        }
    }

    // Initialize theme based on stored setting or system preference
    const storedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
    applyTheme(initialTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const newTheme = isDark ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        });
    }

    // Respond to system preference change if user hasn't explicitly set preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if(hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if(window.innerWidth <= 768) {
                navLinks.classList.remove('active');
            }
        });
    });

    // Scroll-triggered reveal animations using Intersection Observer
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!('IntersectionObserver' in window) || prefersReducedMotion) {
        // If IntersectionObserver is unsupported or user prefers reduced motion, show immediately
        document.querySelectorAll('section, .portfolio-card').forEach(el => {
            el.classList.add('is-revealed');
        });
    } else {
        // Section reveal observer
        const sectionObserverOptions = {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        };

        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, sectionObserverOptions);

        document.querySelectorAll('section').forEach(section => {
            section.classList.add('reveal-section');
            sectionObserver.observe(section);
        });

        // Portfolio cards reveal observer with staggered entry
        const cardObserverOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -30px 0px'
        };

        const cardObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    card.classList.add('is-revealed');
                    observer.unobserve(card);

                    // Reset transition delay after entrance finishes so hover animations remain responsive
                    setTimeout(() => {
                        card.style.transitionDelay = '0s';
                    }, 800);
                }
            });
        }, cardObserverOptions);

        document.querySelectorAll('.portfolio-card').forEach((card, index) => {
            card.classList.add('reveal-card');
            card.style.transitionDelay = `${index * 120}ms`;
            cardObserver.observe(card);
        });
    }

    // Subtle Parallax Scrolling Effect on Hero Image
    const heroImage = document.querySelector('.hero-image img');
    const heroSection = document.querySelector('.hero');

    if (heroImage && heroSection && !prefersReducedMotion) {
        let isTicking = false;

        const updateHeroParallax = () => {
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;
            const heroHeight = heroSection.offsetHeight;

            // Only calculate while hero is within view or near top
            if (scrollY <= heroHeight + 150) {
                // Subtle factor creates optical depth without distortion or layout displacement
                const speed = window.innerWidth <= 768 ? 0.12 : 0.18;
                const translateY = Math.round(scrollY * speed);
                heroImage.style.transform = `translate3d(0, ${translateY}px, 0)`;
            }
            isTicking = false;
        };

        window.addEventListener('scroll', () => {
            if (!isTicking) {
                window.requestAnimationFrame(updateHeroParallax);
                isTicking = true;
            }
        }, { passive: true });

        // Initialize position
        updateHeroParallax();
    }
});
