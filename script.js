document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('track');
    // Get all sections to know how many slides we have
    const sections = Array.from(document.querySelectorAll('.panel'));
    const progressEl = document.getElementById('progress');
    const totalSections = sections.length;

    // STATE MANAGEMENT
    let currentIndex = 0;   // The current active slide (0 to N)
    let currentX = 0;       // Current pixel position (for wrapping/lerp)
    let isLocked = false;   // Lock flag
    const scrollCooldown = 600; // Time in ms to lock scrolling after a trigger

    // NAVIGATE
    const goNext = () => {
        if (currentIndex < totalSections - 1) {
            currentIndex++;
            lock();
            startAnimation();
        }
    };

    const goPrev = () => {
        if (currentIndex > 0) {
            currentIndex--;
            lock();
            startAnimation();
        }
    };

    const goToIndex = (index) => {
        if (index >= 0 && index < totalSections) {
            currentIndex = index;
            startAnimation();
        }
    };

    // LOCK MECHANISM
    const lock = () => {
        isLocked = true;
        setTimeout(() => {
            isLocked = false;
        }, scrollCooldown);
    };

    // UI UPDATES
    const updateProgress = () => {
        if (progressEl) {
            // Visual index is 1-based
            progressEl.textContent = (currentIndex + 1).toString().padStart(2, '0');
        }
    };

    // TRANSFORM ANIMATION
    let hasNameAnimated = false; // Run once flag

    const startAnimation = () => {
        // Capture Rect BEFORE slide if we are about to trigger animation
        let heroRect = null;
        if (currentIndex === 1 && !hasNameAnimated) {
            const el = document.getElementById('hero-name');
            if (el) heroRect = el.getBoundingClientRect();
        }

        // Slide horizontally based on index (100vw width per panel)
        track.style.transform = `translateX(-${currentIndex * 100}vw)`;
        updateProgress();

        // Trigger Name Animation when entering Page 2
        if (currentIndex === 1 && !hasNameAnimated && heroRect) {
            hasNameAnimated = true;
            // Pass the captured rect
            setTimeout(() => runNameAnimation(heroRect), 50); // Almost immediate start
        }
    };

    // NAME SWIRL ANIMATION (P1 -> P2)
    const runNameAnimation = (startRect) => {
        const targetName = document.getElementById('about-name');
        const p2 = document.getElementById('p2');
        if (!startRect || !targetName || !p2) return;

        // Hide target initially
        targetName.style.opacity = '0';

        // Calculate FINAL position relative to the Panel
        // Since Panel 2 will end up at x=0, y=0 (relative to viewport)
        // The Final Client Rect of target will be its offset inside P2
        const p2Rect = p2.getBoundingClientRect();
        const r2 = targetName.getBoundingClientRect();
        
        const finalX = r2.left - p2Rect.left;
        const finalY = r2.top - p2Rect.top + (p2.style.paddingTop ? 0 : 0); // Padding handled by rect diff

        // Create Ghost
        const ghost = document.createElement('span');
        // Use exact text
        ghost.textContent = "JAIDEEP"; 
        ghost.style.position = 'fixed';
        ghost.style.left = '0';
        ghost.style.top = '0';
        ghost.style.zIndex = '9999';
        ghost.style.fontFamily = 'var(--font-dot)';
        ghost.style.fontWeight = 'bold';
        ghost.style.fontSize = '4rem'; 
        ghost.style.lineHeight = '0.9';
        ghost.style.color = '#D71920'; 
        ghost.style.pointerEvents = 'none';
        
        // Initial State (From Captured Rect)
        ghost.style.transform = `translate(${startRect.left}px, ${startRect.top}px)`;
        ghost.style.width = `${startRect.width}px`;
        
        document.body.appendChild(ghost);

        // Animate
        // Curve: Go out horizontally first, then swoop in
        const midX = (startRect.left + finalX) / 2 + 200; 
        const midY = (startRect.top + finalY) / 2 - 100;

        const animation = ghost.animate([
            { transform: `translate(${startRect.left}px, ${startRect.top}px) scale(1)`, opacity: 1 },
            { transform: `translate(${midX}px, ${midY}px) scale(0.6) rotate(10deg)`, offset: 0.5 },
            { transform: `translate(${finalX}px, ${finalY}px) scale(0.4) rotate(0deg)`, opacity: 1 } 
        ], {
            duration: 2500, // Matches Page Scroll
            easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)', // Matches CSS Bezier
            fill: 'forwards'
        });

        animation.onfinish = () => {
            targetName.style.transition = 'opacity 0.5s';
            targetName.style.opacity = '1';
            ghost.remove();
        };
    };

    // HANDLE RESIZE
    window.addEventListener('resize', () => {
        startAnimation();
    });

    // --- HYBRID SCROLL LOGIC ---
    
    // --- HYBRID SCROLL LOGIC ---
    
    // SATELLITE WAVE ANIMATION (Radial Dock)
    const folderGroups = document.querySelectorAll('.folder-group');
    
    folderGroups.forEach(group => {
        const cards = group.querySelectorAll('.file-card');
        
        group.addEventListener('mousemove', (e) => {
            const mx = e.clientX;
            const my = e.clientY;
            
            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                
                // Euclidean distance
                const dist = Math.sqrt(Math.pow(mx - cx, 2) + Math.pow(my - cy, 2));
                
                // Dock Effect Parameters
                const triggerDist = 120; // Pixel radius
                const baseScale = 1.0;
                const maxScale = 1.15;
                
                let scale = baseScale;
                
                if (dist < triggerDist) {
                    // Normalize distance (0 to 1)
                    const factor = 1 - (dist / triggerDist);
                    // Add scale based on proximity
                    scale = baseScale + ((maxScale - baseScale) * factor);
                }
                
                card.style.setProperty('--s', scale);
            });
        });

        // Reset on leave
        group.addEventListener('mouseleave', () => {
            cards.forEach(card => {
                card.style.setProperty('--s', 1);
            });
        });

        // MOBILE TAP LOGIC
        group.addEventListener('click', (e) => {
            // If clicking a file link, let it navigate/open, don't toggle folder
            if (e.target.closest('.file-card')) return;

            e.stopPropagation(); // Prevent document click from closing it immediately
            
            // Close other groups
            folderGroups.forEach(g => {
                if (g !== group) g.classList.remove('active');
            });
            
            // Toggle this group
            group.classList.toggle('active');
        });
    });

    // Close folders when clicking outside
    document.addEventListener('click', () => {
        folderGroups.forEach(group => {
            group.classList.remove('active');
        });
    });

    // Helper: Is the current panel scrollable?
    const isScrollable = (el) => {
        // FAILSAFE: Hero Section (p1) should NEVER scroll internally. Always navigate.
        if (el.id === 'p1') return false;

        // Critical Fix: If overflow is hidden, it's NOT scrollable for our purposes
        const style = window.getComputedStyle(el);
        if (style.overflowY === 'hidden') return false;

        // Use a small buffer (1px) for float inconsistencies
        return el.scrollHeight > el.clientHeight + 1;
    };

    // Helper: Are we at the bottom?
    const isAtBottom = (el) => {
        return Math.abs(el.scrollHeight - el.clientHeight - el.scrollTop) < 2;
    };

    // Helper: Are we at the top?
    const isAtTop = (el) => {
        return el.scrollTop === 0;
    };

    // EVENT LISTENER: WHEEL (Desktop Hybrid)
    window.addEventListener('wheel', (e) => {
        if (isLocked) return;
        
        const currentPanel = sections[currentIndex];
        const delta = e.deltaY;

        // Ignore horizontal trackpad noise
        if (Math.abs(delta) < 10 && Math.abs(e.deltaX) < 10) return;

        // If panel is vertically scrollable, check boundary conditions
        if (isScrollable(currentPanel)) {
            if (delta > 0) {
                // Scrolling DOWN
                if (isAtBottom(currentPanel)) {
                    e.preventDefault();
                    goNext();
                }
                // Else: Let native scroll happen
            } else {
                // Scrolling UP
                if (isAtTop(currentPanel)) {
                    e.preventDefault();
                    goPrev();
                }
                // Else: Let native scroll happen
            }
        } else {
            // Not scrollable -> Standard Slide Logic
            e.preventDefault();
            if (delta > 20) goNext(); // Lower threshold for responsiveness
            else if (delta < -20) goPrev();
        }
    }, { passive: false });

    // EVENT LISTENER: TOUCH (Mobile Hybrid)
    let touchStartX = 0;
    let touchStartY = 0;
    
    window.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
        // Optional: prevent default here if you want to block browser swipe-nav
    }, { passive: false });

    window.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;
        const currentPanel = sections[currentIndex];

        // Detect Dominant Axis
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Horizontal Swipe (Explicit Navigation)
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) goNext(); 
                else goPrev();
            }
        } else {
            // Vertical Swipe (Scroll or Nav)
            if (isScrollable(currentPanel)) {
                if (diffY > 50) { 
                    // Swiping Up (Scrolling Down Content)
                    if (isAtBottom(currentPanel)) goNext();
                } else if (diffY < -50) {
                    // Swiping Down (Scrolling Up Content)
                    if (isAtTop(currentPanel)) goPrev();
                }
            } else {
                // Not scrollable, vertical swipe = nav
                if (diffY > 50) goNext();
                else if (diffY < -50) goPrev();
            }
        }
    }, { passive: false });

    // EXTERNAL API
    window.scrollToPanel = (id) => {
        const panel = document.getElementById(id);
        if (panel) {
            const index = sections.indexOf(panel);
            if (index !== -1) goToIndex(index);
        }
    };

    window.openWindow = (id) => {
        const win = document.getElementById(id);
        if(win) win.classList.add('active');
    };
    
    window.closeWindow = (id) => {
        const win = document.getElementById(id);
        if(win) win.classList.remove('active');
    };

    // REVEAL ANIMATIONS (IntersectionObserver)
    const observerOptions = {
        root: null,
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetEntry = entry.target;
                const reveals = targetEntry.querySelectorAll('.reveal');
                reveals.forEach(el => {
                    el.classList.add('active');
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // TYPEWRITER EFFECT
    const roles = ["DEVELOPER", "DESIGNER", "VIDEO EDITOR", "CINEMATOGRAPHER"];
    const roleElement = document.getElementById("role-text");
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    const typeRole = () => {
        if (!roleElement) return;

        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            roleElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50; // Deleting speed
        } else {
            roleElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 150; // Typing speed
        }

        if (!isDeleting && charIndex === currentRole.length) {
            // Finished typing
            isDeleting = true;
            typeSpeed = 2000; // Pause before deleting
        } else if (isDeleting && charIndex === 0) {
            // Finished deleting
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500; // Pause before typing next
        }

        setTimeout(typeRole, typeSpeed);
    };

    // Start Typewriter
    setTimeout(typeRole, 1000);

    // TRIGGER INITIAL STATE (Force reveal for P1)
    setTimeout(() => {
        const p1 = document.getElementById('p1');
        if(p1) {
            const reveals = p1.querySelectorAll('.reveal');
            reveals.forEach((el, i) => {
                setTimeout(() => {
                    el.classList.add('active');
                }, i * 150);
            });
        }
    }, 100);

    // THEME MANAGER
    const themeBtn = document.getElementById('theme-btn');
    
    window.toggleTheme = () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        // Update UI
        if(themeBtn) themeBtn.textContent = isDark ? '[ DARK_MODE ]' : '[ LIGHT_MODE ]';
        // Save
        localStorage.setItem('nothing_os_theme', isDark ? 'dark' : 'light');
    };

    // Initialize Theme
    const savedTheme = localStorage.getItem('nothing_os_theme');
    if(savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if(themeBtn) themeBtn.textContent = '[ DARK_MODE ]';
    }

    console.log('NOTHING_OS: SYSTEM_READY');
});
