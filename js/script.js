// Full Portfolio JavaScript - Enhanced Features (Contact Form Removed & Typing Cursor Fixed)

document.addEventListener('DOMContentLoaded', () => {

    // --- Element Selections ---
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const counters = document.querySelectorAll('.counter');

    // --- Navbar Scroll Effect ---
    const handleNavbarScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    // --- Active Nav Link on Scroll ---
    const updateActiveNavLink = () => {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 150) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === currentSection) {
                link.classList.add('active');
            }
        });
    };

    // --- Mobile Menu Toggle ---
    const toggleMobileMenu = () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    };

    // --- Smooth Scroll to Section ---
    const smoothScrollTo = (targetId) => {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - navbar.offsetHeight;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    };

    // --- Typing Animation ---
    const initTypingAnimation = () => {
        const typingElement = document.querySelector('.typing-text');
        if (!typingElement) return;
        
        const words = typingElement.getAttribute('data-words').split(',');
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typeSpeed = 100;
        const deleteSpeed = 50;
        const delayBetweenWords = 2000;

        function type() {
            const currentWord = words[wordIndex].trim();
            const cursorHTML = '<span class="typing-cursor">|</span>';

            let currentText = isDeleting ?
                currentWord.substring(0, charIndex - 1) :
                currentWord.substring(0, charIndex + 1);

            // Use innerHTML to place the cursor at the end of the text.
            typingElement.innerHTML = currentText + cursorHTML;
            
            charIndex = isDeleting ? charIndex - 1 : charIndex + 1;

            if (!isDeleting && charIndex === currentWord.length + 1) {
                isDeleting = true;
                setTimeout(type, delayBetweenWords);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                setTimeout(type, 500);
            } else {
                setTimeout(type, isDeleting ? deleteSpeed : typeSpeed);
            }
        }
        setTimeout(type, 1000);
    };

    // --- Counter Animation ---
    const animateCounters = () => {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = +counter.getAttribute('data-target');
                    counter.innerText = '0';

                    const updateCounter = () => {
                        const current = +counter.innerText;
                        const increment = Math.max(1, Math.ceil(target / 100));

                        if (current < target) {
                            counter.innerText = `${Math.min(target, current + increment)}`;
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target.toLocaleString();
                        }
                    };
                    requestAnimationFrame(updateCounter);
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.8 });

        counters.forEach(counter => observer.observe(counter));
    };

    // --- Reveal on Scroll Animations ---
    const initScrollAnimations = () => {
        const elementsToAnimate = [
            { selector: '.about-text', animation: 'slide-in-left' },
            { selector: '.about-image', animation: 'slide-in-right' },
            { selector: '.skill-category', animation: 'fade-in' },
            { selector: '.project-card', animation: 'fade-in' },
            { selector: '.timeline-item', animation: 'slide-in-left' },
            { selector: '.contact-info', animation: 'slide-in-left' },
            { selector: '.contact-form', animation: 'slide-in-right' }
        ];

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const delay = (index % 5) * 100;
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.classList.add(entry.target.dataset.animation);
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        elementsToAnimate.forEach(config => {
            document.querySelectorAll(config.selector).forEach(element => {
                element.dataset.animation = config.animation;
                element.style.opacity = '0';
                observer.observe(element);
            });
        });
    };
    
    // --- Project Filtering ---
    const filterProjects = (category) => {
        projectCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            if (category === 'all' || cardCategory === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    };

    // --- Event Listeners ---
    window.addEventListener('scroll', () => {
        handleNavbarScroll();
        updateActiveNavLink();
    });

    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            smoothScrollTo(targetId);
            
            if (navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const category = button.getAttribute('data-filter');
            filterButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            filterProjects(category);
        });
    });
    
    // --- Initializations ---
    handleNavbarScroll();
    updateActiveNavLink();
    initTypingAnimation();
    if (counters.length > 0) {
        animateCounters();
    }
    initScrollAnimations();
    
    console.log('heheheheheh');
});