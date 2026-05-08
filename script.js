document.addEventListener('DOMContentLoaded', () => {
    /* === AOS Initialization === */
    AOS.init({
        duration: 800,
        offset: 100,
        once: true, // Whether animation should happen only once - while scrolling down
        easing: 'ease-in-out'
    });

    /* === Typed.js Initialization === */
    const typedTextElement = document.getElementById('typed-text');
    if (typedTextElement) {
        new Typed('#typed-text', {
            strings: ['AI & Data Science Student.', 'Cloud Enthusiast.', 'DevOps Practitioner.', 'SAP Enthusiast'],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true,
            cursorChar: '|'
        });
    }

    /* === Mobile Menu Logic === */
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const navItems = document.querySelectorAll('.nav-item');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu on link click
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = hamburger.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }

    /* === Sticky Navbar & Active Link Update on Scroll === */
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('.section, .hero-section');

    window.addEventListener('scroll', () => {
        // Sticky Navbar
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active Link Update
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').includes(current)) {
                item.classList.add('active');
            }
        });
    });

    /* === Custom Glow Cursor Logic === */
    const cursor = document.getElementById('cursor-glow');
    
    // Only apply custom cursor on desktop
    if (window.innerWidth > 768 && cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Add glow effect when hovering over interactive elements
        const interactives = document.querySelectorAll('a, button, .project-card, .cert-card, .skill-category');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursor.style.background = 'radial-gradient(circle, rgba(0, 210, 255, 0.5) 0%, rgba(0,0,0,0) 70%)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.background = 'radial-gradient(circle, rgba(188,19,254,0.4) 0%, rgba(0,0,0,0) 70%)';
            });
        });
    } else if (cursor) {
        // Hide cursor glow on mobile
        cursor.style.display = 'none';
    }

    /* === Custom HTML5 Canvas Particle System === */
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray;

        // Set Canvas Dimensions
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        });

        // Particle Class
        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }

            // Draw particle
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            // Update particle position
            update() {
                // Check if particle is still within canvas
                if (this.x > canvas.width || this.x < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y > canvas.height || this.y < 0) {
                    this.directionY = -this.directionY;
                }

                // Move particle
                this.x += this.directionX;
                this.y += this.directionY;

                this.draw();
            }
        }

        // Initialize particle array
        function initParticles() {
            particlesArray = [];
            // Number of particles depends on screen size to prevent lag
            let numberOfParticles = (canvas.height * canvas.width) / 15000;
            // Cap the particles on smaller screens
            if (numberOfParticles > 100) numberOfParticles = 100;

            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1; // Size between 1 and 3
                let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
                let directionX = (Math.random() * 1) - 0.5; // Slow movement
                let directionY = (Math.random() * 1) - 0.5;
                
                // Color array mixing violet and blue glow
                let colors = ['rgba(188, 19, 254, 0.7)', 'rgba(0, 210, 255, 0.6)'];
                let color = colors[Math.floor(Math.random() * colors.length)];

                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        // Connect particles with lines if close enough
        function connectParticles() {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + 
                                   ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                    
                    if (distance < (canvas.width / 10) * (canvas.height / 10)) {
                        opacityValue = 1 - (distance / 20000);
                        ctx.strokeStyle = `rgba(188, 19, 254, ${opacityValue * 0.2})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        // Animation Loop
        function animateParticles() {
            requestAnimationFrame(animateParticles);
            ctx.clearRect(0, 0, innerWidth, innerHeight);

            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connectParticles();
        }

        initParticles();
        animateParticles();
    }
});
