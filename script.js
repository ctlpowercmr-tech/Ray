// Configuration Three.js
let scene, camera, renderer, particles;
let mouseX = 0, mouseY = 0;

// Initialisation Three.js
function initThreeJS() {
    // Scene
    scene = new THREE.Scene();
    
    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        particlesContainer.appendChild(renderer.domElement);
        
        // Particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 1000;
        const posArray = new Float32Array(particlesCount * 3);
        
        for(let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 10;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        
        // Particles material
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.005,
            color: 0x0066ff,
            transparent: true,
            opacity: 0.8
        });
        
        particles = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particles);
    }
    
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    
    if (particles) {
        particles.rotation.x += 0.001;
        particles.rotation.y += 0.002;
        
        // Mouse interaction
        particles.rotation.x += mouseY * 0.0001;
        particles.rotation.y += mouseX * 0.0001;
    }
    
    renderer.render(scene, camera);
}

// Mouse tracking
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Resize handler
window.addEventListener('resize', () => {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
});

// GSAP Animations
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Three.js
    initThreeJS();
    
    // GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Hero title animation
    gsap.from('.hero-title-3d .title-line', {
        duration: 1.5,
        y: 100,
        opacity: 0,
        stagger: 0.2,
        ease: "power4.out"
    });
    
    // Hero stats animation
    gsap.from('.hero-stats .stat-item', {
        duration: 1,
        y: 50,
        opacity: 0,
        stagger: 0.1,
        delay: 0.5,
        ease: "power2.out"
    });
    
    // Bento grid animation
    gsap.from('.bento-item', {
        duration: 1,
        scale: 0,
        opacity: 0,
        stagger: 0.1,
        scrollTrigger: {
            trigger: '.services-3d',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        }
    });
    
    // Counter animation
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        gsap.to(counter, {
            duration: 2,
            innerHTML: target,
            snap: { innerHTML: 1 },
            ease: "power2.inOut",
            delay: 1
        });
    });
});

// Navigation 3D effects
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        gsap.to(item.querySelector('.nav-cube'), {
            duration: 0.3,
            scale: 1.1,
            ease: "power2.out"
        });
    });
    
    item.addEventListener('mouseleave', () => {
        gsap.to(item.querySelector('.nav-cube'), {
            duration: 0.3,
            scale: 1,
            ease: "power2.out"
        });
    });
});

// Smooth scrolling
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        gsap.to(window, {
            duration: 1.5,
            scrollTo: section,
            ease: "power2.inOut"
        });
    }
}

// Hologram effects
document.querySelectorAll('.hologram-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        gsap.to(item, {
            duration: 0.3,
            y: -10,
            ease: "power2.out"
        });
    });
    
    item.addEventListener('mouseleave', () => {
        gsap.to(item, {
            duration: 0.3,
            y: 0,
            ease: "power2.out"
        });
    });
});

// Showcase navigation
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const slide = btn.getAttribute('data-slide');
        
        // Remove active class from all buttons
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Animate showcase items
        gsap.to('.showcase-item', {
            duration: 0.5,
            opacity: 0,
            scale: 0.8,
            onComplete: () => {
                // Here you would switch to the actual slide content
                gsap.to('.showcase-item', {
                    duration: 0.5,
                    opacity: 1,
                    scale: 1
                });
            }
        });
    });
});

// Contact form
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const button = e.target.querySelector('.btn-submit-3d');
    const originalText = button.innerHTML;
    
    // Loading animation
    button.innerHTML = '<div class="btn-loader"></div>';
    button.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        button.innerHTML = '<i class="fas fa-check"></i> Message envoyé!';
        button.style.background = 'var(--success-color)';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
            button.style.background = '';
            e.target.reset();
        }, 2000);
    }, 1500);
});

// Maintenance banner check
function checkMaintenanceStatus() {
    const maintenanceBanner = document.getElementById('maintenance-banner');
    const maintenanceMessage = document.getElementById('maintenance-message');
    
    // Simulate checking maintenance status from database
    const isMaintenance = localStorage.getItem('maintenanceMode') === 'true';
    const customMessage = localStorage.getItem('maintenanceMessage');
    
    if (isMaintenance) {
        maintenanceBanner.classList.add('active');
        if (customMessage) {
            maintenanceMessage.textContent = customMessage;
        }
    }
}

// Initialize
checkMaintenanceStatus();

// Add smooth reveal for elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            gsap.to(entry.target, {
                duration: 1,
                y: 0,
                opacity: 1,
                ease: "power2.out"
            });
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.section-header-3d, .bento-item, .blog-card-3d').forEach(el => {
    gsap.set(el, { y: 50, opacity: 0 });
    observer.observe(el);
});
