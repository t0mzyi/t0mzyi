document.addEventListener('DOMContentLoaded', () => {

    // --- Element Selections (for the whole page) ---
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const counters = document.querySelectorAll('.counter');

    // --- Page Animations and Effects ---
    const handleNavbarScroll = () => {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    };

    const updateActiveNavLink = () => {
        let currentSection = '';
        sections.forEach(section => {
            if (pageYOffset >= section.offsetTop - 150) {
                currentSection = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href')?.substring(1) === currentSection) {
                link.classList.add('active');
            }
        });
    };

    const toggleMobileMenu = () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    };

    const initTypingAnimation = () => {
        const typingElement = document.querySelector('.typing-text');
        if (!typingElement) return;
        const words = typingElement.getAttribute('data-words').split(',');
        let wordIndex = 0, charIndex = 0, isDeleting = false;

        function type() {
            const currentWord = words[wordIndex].trim();
            const cursorHTML = '<span class="typing-cursor">|</span>';
            let currentText = isDeleting ? currentWord.substring(0, charIndex - 1) : currentWord.substring(0, charIndex + 1);
            typingElement.innerHTML = currentText + cursorHTML;
            charIndex = isDeleting ? charIndex - 1 : charIndex + 1;

            if (!isDeleting && charIndex === currentWord.length + 1) {
                setTimeout(() => isDeleting = true, 2000);
                setTimeout(type, 2000);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                setTimeout(type, 500);
            } else {
                setTimeout(type, isDeleting ? 50 : 100);
            }
        }
        setTimeout(type, 1000);
    };

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
    
    const filterProjects = (category) => {
        projectCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            card.style.display = (category === 'all' || cardCategory === category) ? 'block' : 'none';
        });
    };

    // --- Event Listeners for Page Effects ---
    window.addEventListener('scroll', () => {
        handleNavbarScroll();
        updateActiveNavLink();
    });

    if (hamburger) hamburger.addEventListener('click', toggleMobileMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetElement = document.querySelector(link.getAttribute('href'));
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - (navbar.offsetHeight || 70),
                    behavior: 'smooth'
                });
            }
            if (navMenu.classList.contains('active')) toggleMobileMenu();
        });
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            filterProjects(button.getAttribute('data-filter'));
        });
    });
    
    // --- Initializations for Page Effects ---
    handleNavbarScroll();
    updateActiveNavLink();
    initTypingAnimation();
    if (counters.length > 0) animateCounters();

  










































    



    const contactForm = document.getElementById('contact-form');
  
    if (contactForm) {
        const nameInp = document.getElementById('name');
        const emailInp = document.getElementById('email');
        const subjectInp = document.getElementById('subject');
        const messageInp = document.getElementById('message');

        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();
            let isFormValid = true;

            
            const nameValue = nameInp.value.trim();
            const nameErrorDiv = nameInp.parentElement.querySelector('.error-message');
            if (nameValue === '') {
                isFormValid = false;
                nameErrorDiv.innerHTML = "Please enter your name";
                nameInp.style.border = "2px solid red";
            } else if (/\d/.test(nameValue)) {
                isFormValid = false;
                nameErrorDiv.innerHTML = "Please don't enter numbers in the name field";
                nameInp.style.border = "2px solid red";
            } else {
                nameErrorDiv.innerHTML = "";
                nameInp.style.border = "";
            }

         
            const emailValue = emailInp.value.trim();
            const emailErrorDiv = emailInp.parentElement.querySelector('.error-message');
            if (emailValue === '') {
                isFormValid = false;
                emailErrorDiv.innerHTML = "Please don't leave this field blank";
                emailInp.style.border = "2px solid red";
            } else if (!emailValue.includes('@') || !emailValue.includes('.')) {
                isFormValid = false;
                emailErrorDiv.innerHTML = "Please enter a valid email address";
                emailInp.style.border = "2px solid red";
            } else {
                emailErrorDiv.innerHTML = '';
                emailInp.style.border = '';
            }

          
            const subjValue = subjectInp.value.trim();
            const subjErrorDiv = subjectInp.parentElement.querySelector('.error-message');
            if (subjValue === '') {
                isFormValid = false;
                subjErrorDiv.innerHTML = "Please enter a subject";
                subjectInp.style.border = "2px solid red";
            } else {
                subjErrorDiv.innerHTML = "";
                subjectInp.style.border = "";
            }

            //mes
            const messageValue = messageInp.value.trim();
            const messageErrorDiv = messageInp.parentElement.querySelector('.error-message');
            if (messageValue === '') {
                isFormValid = false;
                messageErrorDiv.innerHTML = "Please enter a message";
                messageInp.style.border = "2px solid red";
            } else {
                messageErrorDiv.innerHTML = "";
                messageInp.style.border = "";
            }

        
            if (isFormValid) {
                console.log('Validation successful! Submitting...');
                contactForm.submit();
            } else {
                console.log('Validation failed. Form not submitted.');
            }
        });
    }
});