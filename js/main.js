// Particles background
function initParticles() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const mouse = { x: 0, y: 0 };
    let isMouseInside = false;

    // Track mouse
    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        isMouseInside = true;
    });

    document.addEventListener('mouseleave', () => {
        isMouseInside = false;
    });

    // Create particles
    for (let i = 0; i < 100; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 1.5 + 0.5,
            glow: Math.random() * 0.4 + 0.2,
            targetX: 0,
            targetY: 0,
            isAttracted: Math.random() > 0.7, // Only some particles react
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            // Default drift
            p.x += p.vx;
            p.y += p.vy;

            // Bounce off edges
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            // Cursor attraction (only some particles)
            if (isMouseInside && p.isAttracted) {
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 200) {
                    const force = (200 - dist) / 200;
                    p.vx += dx * 0.0003 * force;
                    p.vy += dy * 0.0003 * force;
                }
            }

            // Draw particle
            ctx.save();
            ctx.globalAlpha = p.glow;
            ctx.fillStyle = '#C49808';
            ctx.shadowColor = '#C49808';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        requestAnimationFrame(animate);
    }

    animate();

    // Resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}


// Load realms from JSON
async function loadRealms() {
    try {
        const response = await fetch('data/realms.json');
        const realms = await response.json();
        const grid = document.getElementById('realms-grid');
        grid.innerHTML = realms.map(realm => `
            <div class="realm-card">
                <span class="realm-tag ${realm.status.toLowerCase()}">${realm.status}</span>
                <h3>${realm.name}</h3>
                <p>${realm.description}</p>
                <ul>${realm.features.map(f => `<li>${f}</li>`).join('')}</ul>
                <a href="${realm.discordLink}" class="cta-button primary">Enter ${realm.name}</a>
            </div>
        `).join('');
    } catch (e) {
        console.error('Realms load failed:', e);
    }
}

// Theme switcher
function initThemeSwitcher() {
    const toggle = document.getElementById('theme-toggle');
    const seasons = ['spring', 'summer', 'autumn', 'winter'];
    let current = 0;

    toggle.addEventListener('click', () => {
        current = (current + 1) % seasons.length;
        document.body.className = `theme-${seasons[current]}`;
        toggle.textContent = ['🌸','☀️','🍂','❄️'][current];
    });
}

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Init
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    loadRealms();
    initThemeSwitcher();
});
