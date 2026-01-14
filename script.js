// --- 1. CANVAS (PARTICLES & COMETS) ---
const canvas = document.getElementById('molecular-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let comets = [];

function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() * 0.5) - 0.25; this.speedY = (Math.random() * 0.5) - 0.25;
        this.color = `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`;
    }
    update() {
        this.x += this.speedX; this.y += this.speedY;
        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
    }
    draw() { ctx.fillStyle = this.color; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill(); }
}

class Comet {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() < 0.5 ? -50 : canvas.width + 50;
        this.y = Math.random() * canvas.height;
        this.vx = (this.x < 0 ? 1 : -1) * (Math.random() * 3 + 2); 
        this.vy = (Math.random() - 0.5) * 2;
        this.size = Math.random() * 2 + 1;
        this.tail = []; this.life = 200; 
    }
    update() {
        this.tail.push({x: this.x, y: this.y});
        if(this.tail.length > 20) this.tail.shift();
        this.x += this.vx; this.y += this.vy;
        this.life--;
        if(this.life <= 0 || this.x < -100 || this.x > canvas.width + 100) this.reset();
    }
    draw() {
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI*2); ctx.fill();
        ctx.beginPath();
        for(let i=0; i<this.tail.length; i++) {
            const t = this.tail[i]; const alpha = i / this.tail.length;
            ctx.lineTo(t.x, t.y); ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.5})`;
        }
        ctx.stroke();
    }
}

function initParticles() {
    particles = []; const count = (canvas.width * canvas.height) / 12000;
    for (let i = 0; i < count; i++) particles.push(new Particle());
    for (let i = 0; i < 3; i++) comets.push(new Comet());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update(); particles[i].draw();
        for (let j = i; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x; const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 120) {
                ctx.beginPath(); ctx.strokeStyle = `rgba(255, 75, 43, ${0.15 - dist/1000})`;
                ctx.lineWidth = 0.5; ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke();
            }
        }
    }
    comets.forEach(c => { c.update(); c.draw(); });
    requestAnimationFrame(animate);
}
initParticles(); animate();

// --- 2. TYPEWRITER ---
const textElement = document.getElementById('typing-text');
const phrases = ["Architecting Matter.", "Synthesizing Solutions.", "Engineering Digital Systems.", "Davy Blaser: M1 Molecular Chemistry"];
let phraseIndex = 0, charIndex = 0, isDeleting = false;
function typeEffect() {
    const current = phrases[phraseIndex];
    if (isDeleting) { textElement.textContent = current.substring(0, charIndex - 1); charIndex--; }
    else { textElement.textContent = current.substring(0, charIndex + 1); charIndex++; }
    let speed = isDeleting ? 30 : 60;
    if (!isDeleting && charIndex === current.length) { speed = 2000; isDeleting = true; }
    else if (isDeleting && charIndex === 0) { isDeleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; speed = 500; }
    setTimeout(typeEffect, speed);
}
document.addEventListener('DOMContentLoaded', typeEffect);

// --- 3. CAROUSEL DRAG ---
const slider = document.querySelector('.carousel-container');
let isDown = false;
let startX;
let scrollLeft;
slider.addEventListener('mousedown', (e) => {
  isDown = true; slider.classList.add('active');
  startX = e.pageX - slider.offsetLeft; scrollLeft = slider.scrollLeft;
});
slider.addEventListener('mouseleave', () => { isDown = false; slider.classList.remove('active'); });
slider.addEventListener('mouseup', () => { isDown = false; slider.classList.remove('active'); });
slider.addEventListener('mousemove', (e) => {
  if(!isDown) return;
  e.preventDefault();
  const x = e.pageX - slider.offsetLeft;
  const walk = (x - startX) * 2; slider.scrollLeft = scrollLeft - walk;
});

// --- 4. TIMELINE LOGIC ---
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.2 });
document.querySelectorAll('.scroll-trigger').forEach(el => scrollObserver.observe(el));

window.addEventListener('scroll', () => {
    const timeline = document.querySelector('.timeline');
    const scrollLine = document.querySelector('.timeline-scroll-line');
    if(timeline && scrollLine) {
        const rect = timeline.getBoundingClientRect();
        const start = window.innerHeight * 0.8; 
        const end = window.innerHeight * 0.2;
        let percentage = (start - rect.top) / (rect.height + start - end);
        percentage = Math.max(0, Math.min(1, percentage));
        scrollLine.style.height = `${percentage * 100}%`;
    }
});

// --- 5. LABO INTERACTIF ---
const erlenmeyer = document.getElementById('erlenmeyer');
const bunsenBurner = document.getElementById('bunsen-burner');
const bunsenTrigger = document.getElementById('bunsen-trigger');
const candle = document.getElementById('candle');
const heatTimerDisplay = document.getElementById('heatTimer');
const timerValueSpan = document.getElementById('timerValue');
const resetBtn = document.getElementById('reset-flask-btn');
const flashOverlay = document.getElementById('flash-overlay');
const bubbleElements = document.querySelectorAll('.bubble');
const flaskLiquid = document.getElementById('flask-liquid');

const EXPLOSION_TIME = 5000;
let heatInterval;
let remainingTime = EXPLOSION_TIME;
let isHeating = false;
let isExploded = false;

const skillData = {
    "synthesis": { title: "Organic Synthesis", desc: "Maîtrise des protocoles de synthèse multi-étapes et purification.", proof: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=600&auto=format&fit=crop" },
    "analysis": { title: "Analytical Chem", desc: "Expertise en RMN, IR, UV-Vis et méthodes chromatographiques.", proof: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=600&auto=format&fit=crop" },
    "polymers": { title: "Polymers", desc: "Étude des macromolécules, gélification ionique et encapsulation.", proof: "https://images.unsplash.com/photo-1628595351029-c2bf17511435?q=80&w=600&auto=format&fit=crop" },
    "materials": { title: "Materials Science", desc: "Synthèse inorganique et caractérisation des solides.", proof: "https://images.unsplash.com/photo-1516981879613-9f5da904015f?q=80&w=600&auto=format&fit=crop" },
    "hardware": { title: "PC Hardware", desc: "Assemblage et optimisation de systèmes performants.", proof: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=600&auto=format&fit=crop" },
    "network": { title: "Network & NAS", desc: "Gestion de réseaux, stockage RAID et sécurité.", proof: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop" },
    "softwares": { title: "Scientific Software", desc: "ChemDraw, MestReNova, Python pour la chimie.", proof: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=600&auto=format&fit=crop" },
    "english": { title: "Scientific English", desc: "Communication et rédaction scientifique en anglais.", proof: "https://images.unsplash.com/photo-1543286386-713df548e9cc?q=80&w=600&auto=format&fit=crop" }
};

let bubblesPhysics = [];
let physicsAnimationFrame = null;

function initBubblePhysics() {
    bubblesPhysics = [];
    if (physicsAnimationFrame) cancelAnimationFrame(physicsAnimationFrame);
    physicsAnimationFrame = null;
    const liquidRect = flaskLiquid.getBoundingClientRect();
    const width = liquidRect.width;
    const height = liquidRect.height;
    
    bubbleElements.forEach((el) => {
        let x = Math.random() * (width - 50);
        let y = Math.random() * (height - 50);
        let vx = (Math.random() - 0.5) * 0.1; 
        let vy = (Math.random() - 0.5) * 0.1;
        bubblesPhysics.push({ el: el, x: x, y: y, vx: vx, vy: vy, radius: 20 });
        el.style.transform = `translate(${x}px, ${y}px)`;
    });
    physicsLoop();
}

function physicsLoop() {
    if (isExploded) { physicsAnimationFrame = null; return; }
    const bounds = { width: 260, height: 110 }; 
    const padding = 5;

    bubblesPhysics.forEach(b => {
        if (isHeating) {
            b.vx += (Math.random() - 0.5) * 0.5; b.vy += (Math.random() - 0.5) * 0.5;
            b.vx = Math.max(-4, Math.min(4, b.vx)); b.vy = Math.max(-4, Math.min(4, b.vy));
        } else {
            b.vx *= 0.98; b.vy *= 0.98;
            b.vx += (Math.random() - 0.5) * 0.02; b.vy += (Math.random() - 0.5) * 0.02;
        }
        b.x += b.vx; b.y += b.vy;
        if (b.x < padding) { b.x = padding; b.vx *= -1; }
        if (b.x > bounds.width - b.radius*2 - padding) { b.x = bounds.width - b.radius*2 - padding; b.vx *= -1; }
        if (b.y < padding) { b.y = padding; b.vy *= -1; }
        if (b.y > bounds.height - b.radius*2 - padding) { b.y = bounds.height - b.radius*2 - padding; b.vy *= -1; }
    });

    for (let i = 0; i < bubblesPhysics.length; i++) {
        for (let j = i + 1; j < bubblesPhysics.length; j++) {
            const b1 = bubblesPhysics[i]; const b2 = bubblesPhysics[j];
            const dx = b2.x - b1.x; const dy = b2.y - b1.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const minDist = b1.radius + b2.radius;
            if (dist < minDist) {
                const angle = Math.atan2(dy, dx);
                const tx = Math.cos(angle) * minDist; const ty = Math.sin(angle) * minDist;
                const ax = (tx - dx) * 0.5; const ay = (ty - dy) * 0.5;
                b1.x -= ax; b1.y -= ay; b2.x += ax; b2.y += ay;
                const nx = dx / dist; const ny = dy / dist;
                const dvx = b2.vx - b1.vx; const dvy = b2.vy - b1.vy;
                const dot = dvx * nx + dvy * ny;
                if (dot < 0) { b1.vx += dot * nx; b1.vy += dot * ny; b2.vx -= dot * nx; b2.vy -= dot * ny; }
            }
        }
    }

    bubblesPhysics.forEach(b => { b.el.style.transform = `translate(${b.x}px, ${b.y}px)`; b.el.style.left = '0'; b.el.style.top = '0'; });
    physicsAnimationFrame = requestAnimationFrame(physicsLoop);
}

window.addEventListener('load', initBubblePhysics);

bubbleElements.forEach(b => {
    b.addEventListener('click', (e) => {
        if(isExploded) return;
        e.stopPropagation();
        const k = b.getAttribute('data-key');
        if(skillData[k] || k) {
            document.getElementById('skill-modal-title').textContent = skillData[k]?.title || k;
            document.getElementById('skill-modal-desc').textContent = skillData[k]?.desc || "Détails indisponibles.";
            const proofImg = document.getElementById('skill-proof-img');
            if(skillData[k]?.proof) { proofImg.src = skillData[k].proof; proofImg.style.display = 'block'; }
            else { proofImg.style.display = 'none'; }
            document.getElementById('modal-skill').classList.add('active');
        }
    });
});

let isDragging = false;
let offset = { x: 0, y: 0 };
candle.addEventListener('mousedown', startDrag);
candle.addEventListener('touchstart', startDrag, {passive: false});

function startDrag(e) {
    if (isExploded || isHeating) return;
    isDragging = true;
    candle.classList.add('dragging');
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    const rect = candle.getBoundingClientRect();
    offset.x = clientX - rect.left;
    offset.y = clientY - rect.top;
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, {passive: false});
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchend', stopDrag);
}

function drag(e) {
    if (!isDragging) return;
    e.preventDefault();
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    const labRect = document.getElementById('lab-bench').getBoundingClientRect();
    let newX = clientX - offset.x - labRect.left;
    let newY = clientY - offset.y - labRect.top;
    candle.style.left = `${newX}px`;
    candle.style.top = `${newY}px`;
    candle.style.bottom = 'auto';
}

function stopDrag() {
    if (!isDragging) return;
    isDragging = false;
    candle.classList.remove('dragging');
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('touchmove', drag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchend', stopDrag);
    checkIgnition();
}

function checkIgnition() {
    const candleRect = candle.getBoundingClientRect();
    const triggerRect = bunsenTrigger.getBoundingClientRect();
    if (candleRect.left < triggerRect.right && candleRect.right > triggerRect.left &&
        candleRect.top < triggerRect.bottom && candleRect.bottom > triggerRect.top) {
        startHeating();
        candle.style.left = '250px';
        candle.style.bottom = '50px';
        candle.style.top = 'auto';
    }
}

function startHeating() {
    if(isHeating) return;
    isHeating = true;
    bunsenBurner.classList.add('active');
    erlenmeyer.classList.add('boiling');
    heatTimerDisplay.classList.add('visible');
    heatInterval = setInterval(() => {
        remainingTime -= 100;
        timerValueSpan.textContent = (remainingTime / 1000).toFixed(1);
        if (remainingTime <= 0) triggerImplosion();
    }, 100);
}

function triggerImplosion() {
    clearInterval(heatInterval);
    isHeating = false;
    isExploded = true;
    bunsenBurner.classList.remove('active');
    erlenmeyer.classList.remove('boiling');
    erlenmeyer.classList.add('imploding');
    heatTimerDisplay.classList.remove('visible');
    candle.style.display = 'none';
    setTimeout(() => {
        flashOverlay.classList.add('flash-active');
        erlenmeyer.classList.add('broken');
        setTimeout(() => {
            resetBtn.style.display = 'block';
            flashOverlay.classList.remove('flash-active');
        }, 1000);
    }, 500);
}

resetBtn.addEventListener('click', () => {
    isExploded = false; isHeating = false;
    remainingTime = EXPLOSION_TIME; timerValueSpan.textContent = "5.0";
    erlenmeyer.classList.remove('imploding');
    erlenmeyer.classList.remove('broken');
    resetBtn.style.display = 'none';
    candle.style.display = 'block';
    initBubblePhysics();
});

// --- 6. MODALES & MENU (CORRECTED) ---
const openBtns = document.querySelectorAll('.open-modal');
const closeBtns = document.querySelectorAll('.modal-close');
const overlays = document.querySelectorAll('.modal-overlay');

openBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault(); // Important pour les liens
    const targetId = btn.getAttribute('data-target');
    const modal = document.getElementById(targetId);
    if(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}));

closeBtns.forEach(btn => btn.addEventListener('click', () => {
    btn.closest('.modal-overlay').classList.remove('active');
    document.body.style.overflow = 'auto';
}));

overlays.forEach(ov => ov.addEventListener('click', (e) => {
    if(e.target === ov) {
        ov.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}));

document.querySelector('.burger').addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('nav-active');
});