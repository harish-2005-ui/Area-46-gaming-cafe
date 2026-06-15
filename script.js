/**
 * AREA 46 GAMING CAFE - CUSTOM INTERACTIVE SCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. CANVAS PARTICLE BACKGROUND SYSTEM
       ========================================================================== */
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');

    let particles = [];
    const particleCount = 55;
    const connectionDistance = 120;
    const colors = ['#bc13fe', '#00f0ff']; // Neon Purple, Electric Blue

    // Resize canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle Class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.35; // slow drift
            this.vy = (Math.random() - 0.5) * 0.35;
            this.radius = Math.random() * 4 + 2; // size for shapes
            this.shape = ['triangle', 'circle', 'square', 'cross', 'dot'][Math.floor(Math.random() * 5)];
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.angle = Math.random() * Math.PI * 2;
            this.spin = (Math.random() - 0.5) * 0.008; // slow spin rotation
            this.opacity = Math.random() * 0.4 + 0.25;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.angle += this.spin;

            // Bounce off edges with padding
            if (this.x < -15 || this.x > canvas.width + 15) this.vx = -this.vx;
            if (this.y < -15 || this.y > canvas.height + 15) this.vy = -this.vy;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.globalAlpha = this.opacity;
            ctx.strokeStyle = this.color;
            ctx.fillStyle = this.color;
            ctx.lineWidth = 1.5;

            // Neon shadow for particles
            ctx.shadowBlur = 8;
            ctx.shadowColor = this.color;

            const size = this.radius * 2;

            switch (this.shape) {
                case 'triangle':
                    ctx.beginPath();
                    ctx.moveTo(0, -size);
                    ctx.lineTo(size, size);
                    ctx.lineTo(-size, size);
                    ctx.closePath();
                    ctx.stroke();
                    break;
                case 'square':
                    ctx.beginPath();
                    ctx.rect(-size / 2, -size / 2, size, size);
                    ctx.stroke();
                    break;
                case 'cross':
                    ctx.beginPath();
                    ctx.moveTo(-size / 2, -size / 2);
                    ctx.lineTo(size / 2, size / 2);
                    ctx.moveTo(size / 2, -size / 2);
                    ctx.lineTo(-size / 2, size / 2);
                    ctx.stroke();
                    break;
                case 'circle':
                    ctx.beginPath();
                    ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
                    ctx.stroke();
                    break;
                case 'dot':
                default:
                    ctx.beginPath();
                    ctx.arc(0, 0, this.radius / 1.5, 0, Math.PI * 2);
                    ctx.fill();
                    break;
            }
            ctx.restore();
            ctx.shadowBlur = 0; // reset for performance
        }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Connection lines
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    const alpha = (1 - dist / connectionDistance) * 0.12;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);

                    const gradient = ctx.createLinearGradient(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                    gradient.addColorStop(0, particles[i].color);
                    gradient.addColorStop(1, particles[j].color);

                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 0.6;
                    ctx.globalAlpha = alpha;
                    ctx.stroke();
                    ctx.globalAlpha = 1.0;
                }
            }
        }
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        drawConnections();
        requestAnimationFrame(animate);
    }
    animate();


    /* ==========================================================================
       2. SCROLL HEADER & NAVIGATION CLASS TOGGLE
       ========================================================================== */
    const header = document.getElementById('main-header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });


    /* ==========================================================================
       3. INTERSECTION OBSERVER FOR SCROLL REVEALS
       ========================================================================== */
    const revealElements = document.querySelectorAll('.section-reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // Stagger cards, features, and stat blocks inside the revealed section
                const staggerItems = entry.target.querySelectorAll('.experience-card, .testimonial-card, .gallery-card, .stat-card, .feature-item, .instagram-grid-mockup, .instagram-cta-text');
                staggerItems.forEach((item, index) => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(30px)';
                    item.style.transition = 'opacity 0.8s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)';

                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * 120);
                });

                observer.unobserve(entry.target); // only animate once
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px -80px 0px' // trigger slightly before entering viewport fully
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });


    /* ==========================================================================
       4. MOBILE MENU & NAVIGATION LOGIC
       ========================================================================== */
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNavPanel = document.querySelector('.mobile-nav-panel');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay hidden';
    document.body.appendChild(overlay);

    function toggleMenu() {
        mobileMenuBtn.classList.toggle('active');
        mobileNavPanel.classList.toggle('open');
        overlay.classList.toggle('hidden');

        // Prevent body scrolling when menu is open
        if (mobileNavPanel.classList.contains('open')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    mobileMenuBtn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNavPanel.classList.contains('open')) {
                toggleMenu();
            }
        });
    });


    /* ==========================================================================
       5. ACTIVE SCROLL LINK HIGHLIGHTING
       ========================================================================== */
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120; // accounting for sticky nav
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });


    /* ==========================================================================
       6. FUTURISTIC CONTACT FORM Reservational Logic
       ========================================================================== */
    const bookingForm = document.getElementById('booking-form');
    const formSuccessMsg = document.getElementById('form-success-msg');
    const resetFormBtn = document.getElementById('reset-form-btn');

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Extract form inputs
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const experienceSelect = document.getElementById('experience');
            const experienceText = experienceSelect.options[experienceSelect.selectedIndex].text;
            const message = document.getElementById('message').value;

            // Formulate WhatsApp API link
            const whatsappNumber = '917598946467';
            const textContent = `Hello Area 46! I'd like to book a gaming session:\n\n` +
                `*Name:* ${name}\n` +
                `*Phone:* ${phone}\n` +
                `*Setup:* ${experienceText}\n` +
                `*Notes:* ${message}`;

            const encodedText = encodeURIComponent(textContent);
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedText}`;

            // Simple micro-animation on submit
            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            submitBtn.style.pointerEvents = 'none';
            submitBtn.innerHTML = '<span>CONNECTING SECURE BEACON...</span> <i class="fa-solid fa-spinner fa-spin"></i>';

            // Simulate server lag, show success pane, and open WhatsApp in a new tab
            setTimeout(() => {
                // Reset submit button state
                submitBtn.style.pointerEvents = '';
                submitBtn.innerHTML = '<span>SEND SIGNAL</span> <i class="fa-solid fa-paper-plane"></i>';

                // Toggle visible panes
                bookingForm.classList.add('hidden');
                formSuccessMsg.classList.remove('hidden');

                // Open WhatsApp Link
                window.open(whatsappUrl, '_blank');
            }, 1200);
        });
    }

    if (resetFormBtn) {
        resetFormBtn.addEventListener('click', () => {
            bookingForm.reset();
            formSuccessMsg.classList.add('hidden');
            bookingForm.classList.remove('hidden');
        });
    }

    /* ==========================================================================
       7. DYNAMIC BACKGROUND NEON DRIFT BLOBS
       ========================================================================== */
    const purpleBlob = document.createElement('div');
    purpleBlob.className = 'neon-glow-blob blob-purple';
    const blueBlob = document.createElement('div');
    blueBlob.className = 'neon-glow-blob blob-blue';
    document.body.appendChild(purpleBlob);
    document.body.appendChild(blueBlob);

    /* ==========================================================================
       8. SCROLL PROGRESS INDICATOR
       ========================================================================== */
    const scrollProgressBar = document.getElementById('scrollProgressBar');
    if (scrollProgressBar) {
        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (window.scrollY / windowHeight) * 100;
            scrollProgressBar.style.width = `${scrollPercent}%`;
        });
    }

    /* ==========================================================================
       9. LOADING SCREEN SYSTEM RESOLUTION
       ========================================================================== */
    const loader = document.getElementById('loadingScreen');
    const loadingBar = document.querySelector('.loading-bar');
    if (loader) {
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 12 + 2;
            if (progress >= 95) {
                progress = 95;
                clearInterval(progressInterval);
            }
            if (loadingBar) loadingBar.style.width = `${progress}%`;
        }, 100);

        const fadeOutLoader = () => {
            clearInterval(progressInterval);
            if (loadingBar) loadingBar.style.width = '100%';
            setTimeout(() => {
                loader.classList.add('fade-out');
                // Allow scrolling after loader resolves
                document.body.style.overflow = '';
            }, 400);
        };

        // Resolve loader when page is fully loaded
        window.addEventListener('load', fadeOutLoader);

        // Fallback: Force resolve loader after 2.5 seconds to prevent freezing
        setTimeout(fadeOutLoader, 2500);
    }

    /* ==========================================================================
       10. MOUSE-FOLLOW GLOW AURA WITH SMOOTH EASING
       ========================================================================== */
    const mouseGlow = document.getElementById('mouseGlow');
    if (mouseGlow) {
        let mouseX = 0, mouseY = 0;
        let glowX = 0, glowY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!mouseGlow.classList.contains('active')) {
                mouseGlow.classList.add('active');
            }
        });

        function updateGlowPosition() {
            const dx = mouseX - glowX;
            const dy = mouseY - glowY;

            // Smooth delay tracking
            glowX += dx * 0.08;
            glowY += dy * 0.08;

            mouseGlow.style.left = `${glowX}px`;
            mouseGlow.style.top = `${glowY}px`;

            requestAnimationFrame(updateGlowPosition);
        }
        updateGlowPosition();

        // Mouse hover interaction scaling
        const interactiveSelectors = 'a, button, .experience-card, .gallery-card, .testimonial-card, input, select, textarea, .interactive-location';
        const interactives = document.querySelectorAll(interactiveSelectors);
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => {
                mouseGlow.classList.add('hover-interactive');
            });
            el.addEventListener('mouseleave', () => {
                mouseGlow.classList.remove('hover-interactive');
            });
        });
    }
});
