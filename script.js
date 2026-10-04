// --- High-Performance Canvas Stars Background ---
const canvas = document.getElementById('stars-canvas');

if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let stars = [];
    const starCount = 150;

    function initCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    function createStars() {
        stars = [];
        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 1.5 + 0.5,
                opacity: Math.random(),
                fadeSpeed: Math.random() * 0.02 + 0.005
            });
        }
    }

    function animateStars() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'white';
        
        stars.forEach(star => {
            // Twinkle effect
            star.opacity += star.fadeSpeed;
            if (star.opacity > 1 || star.opacity < 0.2) {
                star.fadeSpeed = -star.fadeSpeed;
            }
            
            ctx.globalAlpha = star.opacity;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        });
        
        requestAnimationFrame(animateStars);
    }

    window.addEventListener('resize', () => {
        initCanvas();
        createStars();
    });

    initCanvas();
    createStars();
    animateStars();
}

// --- Scroll Animation Observer ---
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            scrollObserver.unobserve(entry.target); 
        }
    });
}, observerOptions);

function initializeScrollAnimations() {
    document.querySelectorAll('.scroll-reveal').forEach(el => {
        scrollObserver.observe(el);
    });
}

// --- Fetch and Render Projects ---
const projectsContainer = document.getElementById('projects-container');

async function loadProjects() {
    try {
        const response = await fetch('project.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();

        data.projects.forEach((project, index) => {
            const tagsHTML = project.technologies.map(tech => `<span class="tag">${tech}</span>`).join('');
            
            const cardHTML = `
                <div class="project-card scroll-reveal" style="transition-delay: ${index * 0.1}s">
                    <h3 class="project-title">${project.name}</h3>
                    <p class="project-desc">${project.description}</p>
                    <div class="tech-tags">
                        ${tagsHTML}
                    </div>
                    <a href="${project.url}" target="_blank" class="project-link">Launch Project</a>
                </div>
            `;
            
            projectsContainer.innerHTML += cardHTML;
        });

        initializeScrollAnimations();

    } catch (error) {
        console.error("Error loading project data:", error);
        projectsContainer.innerHTML = '<p style="color: #ff4a4a; text-align: center;">Failed to load projects. Please try again later.</p>';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeScrollAnimations();
    if (projectsContainer) {
        loadProjects();
    }
});