// --- 0. PRELOADER ---
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if(preloader) {
        setTimeout(() => {
            preloader.classList.add('loaded');
            typeEffect(); 
        }, 800);
    }
});

// --- EASTER EGG ---
const secretCode = ['h', '2', 'o'];
let secretIndex = 0;
document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === secretCode[secretIndex]) {
        secretIndex++;
        if (secretIndex === secretCode.length) {
            document.body.classList.toggle('acid-mode');
            secretIndex = 0;
        }
    } else {
        secretIndex = 0;
    }
});

// --- 1. CANVAS BACKGROUND ---
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

// --- 2. TYPEWRITER (ENGLISH) ---
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

// --- 3. CAROUSEL ---
const slider = document.querySelector('.carousel-container');
const prevBtn = document.getElementById('proj-prev');
const nextBtn = document.getElementById('proj-next');

// Drag Logic
let isDown = false; let startX; let scrollLeft;
slider.addEventListener('mousedown', (e) => { isDown = true; slider.classList.add('active'); startX = e.pageX - slider.offsetLeft; scrollLeft = slider.scrollLeft; });
slider.addEventListener('mouseleave', () => { isDown = false; slider.classList.remove('active'); });
slider.addEventListener('mouseup', () => { isDown = false; slider.classList.remove('active'); });
slider.addEventListener('mousemove', (e) => { if(!isDown) return; e.preventDefault(); const x = e.pageX - slider.offsetLeft; const walk = (x - startX) * 2; slider.scrollLeft = scrollLeft - walk; });

// Arrow Logic
if(prevBtn && nextBtn && slider) {
    const scrollAmount = 350;
    prevBtn.addEventListener('click', () => { slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' }); });
    nextBtn.addEventListener('click', () => { slider.scrollBy({ left: scrollAmount, behavior: 'smooth' }); });
}

// --- 4. SCROLL SPY ---
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.scroll-trigger, .fade-up').forEach(el => scrollObserver.observe(el));

const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    const timeline = document.querySelector('.timeline');
    const scrollLine = document.querySelector('.timeline-scroll-line');
    if(timeline && scrollLine) {
        const rect = timeline.getBoundingClientRect();
        const start = window.innerHeight * 0.8; const end = window.innerHeight * 0.2;
        let percentage = (start - rect.top) / (rect.height + start - end);
        percentage = Math.max(0, Math.min(1, percentage));
        scrollLine.style.height = `${percentage * 100}%`;
    }
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop; const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) { current = section.getAttribute('id'); }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) { link.classList.add('active'); }
    });
});

// --- 5. SKILL DATA (ENGLISH) ---
const skillData = {
    "synthesis": {
        title: "Organic Synthesis",
        desc: "Architecture & Complex Synthesis.",
        targetModal: "modal-A", color: 0xff4b2b
    },
    "polymers": {
        title: "Polymers",
        desc: "Soft Materials & Encapsulation.",
        targetModal: "modal-B", color: 0x4b89ff
    },
     "analysis": {
        title: "Analytical Chem",
        desc: "Spectroscopy & Identification.",
        targetModal: "modal-C", color: 0xa855f7
    },
    "hardware": {
        title: "Hardware & IT",
        desc: "Server Architecture & Optimization.",
        targetModal: "modal-D", color: 0x00e676
    },
    "sustainability": {
        title: "Green Chemistry",
        desc: "CO2 Valorization & Sustainable Cycles.",
        targetModal: "modal-E", color: 0x00d2d3
    },
     "modeling": {
        title: "Modeling",
        desc: "In-silico Simulation & Docking.",
        targetModal: "modal-F", color: 0xff9f43
    }
};

// --- 6. MODALS & BURGER ---
const openBtns = document.querySelectorAll('.open-modal');
const closeBtns = document.querySelectorAll('.modal-close');
const overlays = document.querySelectorAll('.modal-overlay');

openBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = btn.getAttribute('data-target');
    const modal = document.getElementById(targetId);
    if(modal) { modal.classList.add('active'); document.body.style.overflow = 'hidden'; }
}));

closeBtns.forEach(btn => btn.addEventListener('click', () => {
    btn.closest('.modal-overlay').classList.remove('active');
    document.body.style.overflow = 'auto';
}));

overlays.forEach(ov => ov.addEventListener('click', (e) => {
    if(e.target === ov) { ov.classList.remove('active'); document.body.style.overflow = 'auto'; }
}));

const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links li');
if(burger) {
    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active'); burger.classList.toggle('toggle');
        navLinksItems.forEach((link, index) => {
            if (link.style.animation) link.style.animation = '';
            else link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        });
    });
}
navLinksItems.forEach(item => {
    item.addEventListener('click', () => {
        nav.classList.remove('nav-active'); burger.classList.remove('toggle');
        navLinksItems.forEach(link => link.style.animation = '');
    });
});

// --- 7. MINI CAROUSEL ---
function initMiniCarousel() {
    const container = document.getElementById('mini-carousel-container');
    if(!container) return;
    const images = container.querySelectorAll('.carousel-img');
    let currentIndex = 0;
    setInterval(() => {
        images[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].classList.add('active');
    }, 3000);
}
initMiniCarousel();

// --- 8. GALLERY LOGIC (ENGLISH TITLES) ---
const galleryData = [
    // RANDO -> HIKING
    { src: "img/rando/IMG-20240613-WA0006.jpg", category: "rando", title: "Hiking 01" },
    { src: "img/rando/IMG-20240613-WA0026.jpg", category: "rando", title: "Hiking 02" },
    { src: "img/rando/PXL_20240404_133717020.MP.jpg", category: "rando", title: "Nature" },
    { src: "img/rando/PXL_20240509_115021536.jpg", category: "rando", title: "Landscape" },
    { src: "img/rando/PXL_20240509_154649039.jpg", category: "rando", title: "Panorama" },
    { src: "img/rando/PXL_20240510_115728184.MP.jpg", category: "rando", title: "Mountain" },
    { src: "img/rando/PXL_20240610_151204175.MP.jpg", category: "rando", title: "View" },
    { src: "img/rando/PXL_20240611_101228498.MP.jpg", category: "rando", title: "Summit" },
    { src: "img/rando/PXL_20240611_102142405.TS~2.mp4", category: "rando", title: "Video Hiking", type: "video" },
    { src: "img/rando/PXL_20240612_125657899.jpg", category: "rando", title: "Path" },
    { src: "img/rando/PXL_20250417_144541505.jpg", category: "rando", title: "Escape" },
    { src: "img/rando/PXL_20250417_145349337.jpg", category: "rando", title: "Forest" },
    { src: "img/rando/PXL_20250418_080731353.jpg", category: "rando", title: "Horizon" },

    // FOOT -> FOOTBALL
    { src: "img/foot/_DSC0743.JPG", category: "football", title: "Action" },
    { src: "img/foot/_DSC0787.JPG", category: "football", title: "Focus" },
    { src: "img/foot/_DSC1058.JPG", category: "football", title: "Field" },
    { src: "img/foot/_DSC1112.JPG", category: "football", title: "Game" },
    { src: "img/foot/_DSC1123.JPG", category: "football", title: "Team" },
    { src: "img/foot/_DSC1139.JPG", category: "football", title: "Momentum" },
    { src: "img/foot/_DSC4017.JPG", category: "football", title: "Portrait" },
    { src: "img/foot/_DSC4145.jpg", category: "football", title: "Detail" },
    { src: "img/foot/_DSC4238.jpg", category: "football", title: "Intensity" },
    { src: "img/foot/Snapchat-1369129726.jpg", category: "football", title: "Locker Room" },
    { src: "img/foot/Snapchat-1810924875.jpg", category: "football", title: "Victory" },
    { src: "img/foot/Snapchat-2143698932.jpg", category: "football", title: "Squad" },

    // CHEMISTRY
    { src: "img/chemistry/PXL_20250207_103257388.MP.jpg", category: "chemistry", title: "Lab Bench" },
    { src: "img/chemistry/PXL_20250311_105322430.MP.jpg", category: "chemistry", title: "Experiment" },
    { src: "img/chemistry/PXL_20250204_112614333.TS (1).mp4", category: "chemistry", title: "Reaction Live", type: "video" },

    // DIVERS -> MISC
    { src: "img/divers/IMG-20241104-WA0056.jpg", category: "divers", title: "Misc 01" },
    { src: "img/divers/PXL_20240404_143449854.MP.jpg", category: "divers", title: "Misc 02" },
    { src: "img/divers/PXL_20240430_115150490.MP.jpg", category: "divers", title: "Misc 03" },
    { src: "img/divers/PXL_20240430_141022123.jpg", category: "divers", title: "Misc 04" },
    { src: "img/divers/PXL_20240430_152853454.MP.jpg", category: "divers", title: "Misc 05" },
    { src: "img/divers/PXL_20240501_110535232.MP~2.jpg", category: "divers", title: "Misc 06" },
    { src: "img/divers/PXL_20240501_141048283.MP.jpg", category: "divers", title: "Misc 07" },
    { src: "img/divers/PXL_20240501_161931526.MP.jpg", category: "divers", title: "Misc 08" },
    { src: "img/divers/PXL_20240502_103342142.MP.jpg", category: "divers", title: "Misc 09" },
    { src: "img/divers/PXL_20240502_122422088.jpg", category: "divers", title: "Misc 10" },
    { src: "img/divers/PXL_20240503_072452746.MP.jpg", category: "divers", title: "Misc 11" },
    { src: "img/divers/PXL_20240610_145115800.jpg", category: "divers", title: "Misc 12" },
    { src: "img/divers/PXL_20241028_171733890.MP.jpg", category: "divers", title: "Misc 13" },
    { src: "img/divers/PXL_20241029_144935063.MP.jpg", category: "divers", title: "Misc 14" },
    { src: "img/divers/PXL_20241029_155820667.MP.jpg", category: "divers", title: "Misc 15" },
    { src: "img/divers/PXL_20241029_161336828.MP.jpg", category: "divers", title: "Misc 16" },
    { src: "img/divers/PXL_20241030_120609962.MP.jpg", category: "divers", title: "Misc 17" },
    { src: "img/divers/PXL_20241030_125011597.MP.jpg", category: "divers", title: "Misc 18" },
    { src: "img/divers/PXL_20250222_121716921.jpg", category: "divers", title: "Misc 19" },
    { src: "img/divers/PXL_20250222_182327467.MP.jpg", category: "divers", title: "Misc 20" },
    { src: "img/divers/PXL_20251207_111614361.jpg", category: "divers", title: "Misc 21" },
    { src: "img/divers/PXL_20251207_124624140.jpg", category: "divers", title: "Misc 22" },
    { src: "img/divers/PXL_20251207_125027441.jpg", category: "divers", title: "Misc 23" },
    { src: "img/divers/PXL_20251207_150549051.jpg", category: "divers", title: "Misc 24" },
    { src: "img/divers/PXL_20251208_103809877.MP.jpg", category: "divers", title: "Misc 25" },
    { src: "img/divers/PXL_20251208_115309536.MP.jpg", category: "divers", title: "Misc 26" },
    { src: "img/divers/PXL_20251208_124930571.jpg", category: "divers", title: "Misc 27" },
    { src: "img/divers/PXL_20251208_125539137.jpg", category: "divers", title: "Misc 28" },
    { src: "img/divers/PXL_20251210_103910668.MP~2.jpg", category: "divers", title: "Misc 29" },
    { src: "img/divers/PXL_20251210_124353964.jpg", category: "divers", title: "Misc 30" },
    { src: "img/divers/PXL_20251210_151035439.jpg", category: "divers", title: "Misc 31" },
    { src: "img/divers/PXL_20251211_102510652.MP.jpg", category: "divers", title: "Misc 32" },
    { src: "img/divers/PXL_20251211_103717038.jpg", category: "divers", title: "Misc 33" },
    { src: "img/divers/PXL_20251211_132621768.jpg", category: "divers", title: "Misc 34" },
    { src: "img/divers/PXL_20251212_114004787.jpg", category: "divers", title: "Misc 35" },
    { src: "img/divers/PXL_20251212_115545105.jpg", category: "divers", title: "Misc 36" },
    { src: "img/divers/PXL_20251212_115847409.jpg", category: "divers", title: "Misc 37" },
    { src: "img/divers/PXL_20251212_122215181.jpg", category: "divers", title: "Misc 38" },
    { src: "img/divers/PXL_20251212_143828838.jpg", category: "divers", title: "Misc 39" },
    { src: "img/divers/PXL_20251212_145230634.jpg", category: "divers", title: "Misc 40" },
    { src: "img/divers/PXL_20251212_145826858.jpg", category: "divers", title: "Misc 41" },
    { src: "img/divers/PXL_20251212_154027793.jpg", category: "divers", title: "Misc 42" },
    { src: "img/divers/PXL_20251212_154906082.MP.jpg", category: "divers", title: "Misc 43" },
    { src: "img/divers/PXL_20251213_125847602.jpg", category: "divers", title: "Misc 44" },
    { src: "img/divers/Snapchat-1382514375.jpg", category: "divers", title: "Misc 45" }
];

const gridContainer = document.getElementById('full-gallery-grid');
const filterBtns = document.querySelectorAll('.cat-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');

// Navigation Lightbox Variables
let currentLightboxList = [];
let currentLightboxIndex = 0;
const lbPrev = document.getElementById('lb-prev');
const lbNext = document.getElementById('lb-next');

// Fonction pour ouvrir la Lightbox avec une liste donnée et un index
function openLightbox(list, index) {
    currentLightboxList = list;
    currentLightboxIndex = index;
    updateLightboxContent();
    lightbox.classList.add('active');
}

function updateLightboxContent() {
    const item = currentLightboxList[currentLightboxIndex];
    if(!item) return;

    // 1. Récupérer le conteneur (wrapper)
    const wrapper = document.getElementById('lightbox-content-wrapper');

    // 2. Nettoyage : Supprimer UNIQUEMENT si c'est une vidéo créée dynamiquement
    const existingVideo = wrapper.querySelector('video');
    if(existingVideo) {
        existingVideo.remove();
    }

    // 3. Vérifier le type de média
    const isVideo = item.src.toLowerCase().endsWith('.mp4') || item.type === 'video';

    if (isVideo) {
        lightboxImg.style.display = 'none';
        const vid = document.createElement('video');
        vid.src = item.src;
        vid.controls = true;
        vid.autoplay = true;
        vid.style.maxWidth = "100%";
        vid.style.maxHeight = "85vh";
        vid.style.boxShadow = "0 0 50px rgba(255,255,255,0.1)";
        vid.id = "lightbox-video-dynamic"; 
        wrapper.appendChild(vid);
    } else {
        lightboxImg.style.display = 'block';
        lightboxImg.src = item.src;
    }
    
    // 4. Mettre à jour la légende
    if(lightboxCaption) {
        lightboxCaption.textContent = item.title;
        lightboxCaption.style.display = 'block';
    }
}

// Navigation Events Lightbox
if(lbPrev) {
    lbPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        if(currentLightboxIndex > 0) {
            currentLightboxIndex--;
        } else {
            currentLightboxIndex = currentLightboxList.length - 1; // Loop to end
        }
        updateLightboxContent();
    });
}

if(lbNext) {
    lbNext.addEventListener('click', (e) => {
        e.stopPropagation();
        if(currentLightboxIndex < currentLightboxList.length - 1) {
            currentLightboxIndex++;
        } else {
            currentLightboxIndex = 0; // Loop to start
        }
        updateLightboxContent();
    });
}

// Initialisation de la grille principale (SANS TITRES SUR LES OVERLAYS)
function initGallery() {
    if(!gridContainer) return;
    gridContainer.innerHTML = '';
    currentLightboxList = galleryData;

    galleryData.forEach((item, index) => {
        const div = document.createElement('div');
        div.classList.add('gallery-item');
        div.setAttribute('data-category', item.category);
        
        let mediaElement;
        const isVideo = item.src.toLowerCase().endsWith('.mp4') || item.type === 'video';

        if (isVideo) {
            div.classList.add('is-video');
            mediaElement = document.createElement('video');
            mediaElement.src = item.src;
            mediaElement.muted = true;
            mediaElement.style.objectFit = "cover";
            const playIcon = document.createElement('div');
            playIcon.innerHTML = '<i class="fas fa-play-circle"></i>';
            playIcon.style.position = 'absolute';
            playIcon.style.top = '50%'; playIcon.style.left = '50%';
            playIcon.style.transform = 'translate(-50%, -50%)';
            playIcon.style.fontSize = '3rem'; playIcon.style.color = 'rgba(255,255,255,0.8)';
            playIcon.style.zIndex = '5';
            div.appendChild(playIcon);
        } else {
            mediaElement = document.createElement('img');
            mediaElement.src = item.src;
            mediaElement.alt = ""; 
            mediaElement.loading = "lazy";
        }
        
        const overlay = document.createElement('div');
        overlay.classList.add('gallery-overlay');
        // IMPORTANT: OVERLAY VIDE POUR NE PAS AFFICHER LE TITRE DANS LA GRILLE
        overlay.innerHTML = `<div class="overlay-content"></div>`;
        
        div.appendChild(mediaElement);
        div.appendChild(overlay);
        gridContainer.appendChild(div);

        div.addEventListener('click', () => {
            const visibleItems = Array.from(document.querySelectorAll('#full-gallery-grid .gallery-item'))
                                      .filter(el => el.style.display !== 'none');
            const clickedIndex = visibleItems.indexOf(div);
            
            const currentDataList = visibleItems.map(el => {
                const src = el.querySelector('img, video').getAttribute('src');
                return galleryData.find(d => d.src === src);
            }).filter(Boolean);

            openLightbox(currentDataList, clickedIndex);
        });
    });
}

// Filtres
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        const items = document.querySelectorAll('#full-gallery-grid .gallery-item');
        
        items.forEach(item => {
            if(filter === 'all' || item.getAttribute('data-category') === filter) {
                item.style.display = 'block';
                item.animate([{ transform: 'scale(0.8)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], { duration: 300, easing: 'ease-out' });
            } else {
                item.style.display = 'none';
            }
        });
    });
});

if(lightboxClose) {
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        const vid = lightbox.querySelector('video');
        if(vid) vid.pause();
    };
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if(e.target === lightbox) closeLightbox();
    });
}

// Clic sur les images de la page d'accueil (Life Samples)
const homePagePreviews = document.querySelectorAll('.gallery-preview-grid .gallery-item');
homePagePreviews.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        let src;
        
        if(item.id === 'mini-carousel-container') {
            const activeImg = item.querySelector('.carousel-img.active');
            if(activeImg) {
                src = activeImg.getAttribute('src');
            } else {
                const firstImg = item.querySelector('.carousel-img');
                if(firstImg) src = firstImg.getAttribute('src');
            }
        } else {
            src = item.getAttribute('data-preview-target');
            if(!src) {
                const img = item.querySelector('img');
                if(img) src = img.getAttribute('src');
            }
        }

        if(src) {
            console.log("Tentative ouverture Lightbox avec : ", src);
            const foundIndex = galleryData.findIndex(d => d.src === src);
            if(foundIndex !== -1) {
                openLightbox(galleryData, foundIndex);
            } else {
                const tempObj = { src: src, title: "Preview", type: src.toLowerCase().endsWith('.mp4') ? 'video' : 'image' };
                openLightbox([tempObj], 0);
            }
        } else {
            console.error("Aucune source trouvée pour cet élément");
        }
    });
});

// --- 8. 3D ATOMIC ARSENAL (SIMPLE & COMPACT) ---
function init3DArsenal() {
    const container = document.getElementById('arsenal-3d-container');
    if (!container) return;

    // 1. Scène & Caméra
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050810, 0.003);

    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    // Caméra rapprochée sur un atome plus petit pour garder de la marge en haut
    camera.position.z = 13; 

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // 2. Éclairage
    scene.add(new THREE.AmbientLight(0x111122, 1.5));
    const mainLight = new THREE.PointLight(0xffffff, 1.5, 50);
    mainLight.position.set(5, 5, 5);
    scene.add(mainLight);
    const rimLight = new THREE.PointLight(0xa855f7, 2, 60);
    rimLight.position.set(0, 15, -20);
    scene.add(rimLight);

    // 3. Groupes
    const coreGroup = new THREE.Group();
    const electronGroup = new THREE.Group();
    scene.add(coreGroup);
    scene.add(electronGroup);

    // --- NOYAU (Taille réduite) ---
    const coreGeo = new THREE.IcosahedronGeometry(1.8, 1);
    const coreMat = new THREE.MeshStandardMaterial({ 
        color: 0xff4b2b, roughness: 0.3, metalness: 0.8,
        emissive: 0xff4b2b, emissiveIntensity: 0.2, wireframe: true 
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.userData = { isCore: true };
    coreGroup.add(coreMesh);

    const innerCore = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.3, 4),
        new THREE.MeshBasicMaterial({ color: 0xff7b5b, transparent: true, opacity: 0.8 })
    );
    innerCore.userData = { isCore: true };
    coreGroup.add(innerCore);

    // --- ÉLECTRONS (Rayon très compact) ---
    const skillKeys = Object.keys(skillData);
    const orbitMeshes = [];
    
    // Rayon réduit à 5.0 pour laisser de la place au titre en haut
    const radius = 5.0; 

    skillKeys.forEach((key, index) => {
        const data = skillData[key];
        const phi = Math.acos(1 - 2 * (index + 0.5) / skillKeys.length);
        const theta = Math.PI * (1 + Math.sqrt(5)) * (index + 0.5);
        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(phi);

        const electronMat = new THREE.MeshPhysicalMaterial({
            color: data.color, roughness: 0.2, metalness: 0.1, transmission: 0.6, thickness: 2,
            emissive: data.color, emissiveIntensity: 0.2, transparent: true, opacity: 0.9
        });

        const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.75, 32, 32), electronMat);
        
        sphere.userData = { 
            key: key, basePos: new THREE.Vector3(x, y, z), currentPos: new THREE.Vector3(x, y, z),
            velocity: new THREE.Vector3(0, 0, 0), hoverIntensity: 0, isElectron: true, color: data.color 
        };
        
        sphere.position.set(x, y, z);
        electronGroup.add(sphere);
        orbitMeshes.push(sphere);

        // Anneaux
        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(radius + Math.random()*0.5, 0.015, 16, 100),
            new THREE.MeshBasicMaterial({ color: data.color, transparent: true, opacity: 0.15 })
        );
        ring.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
        electronGroup.add(ring);
    });

    // 4. Interaction (Souris & Tooltip)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const targetRotation = { x: 0, y: 0 };
    const tooltip = document.getElementById('arsenal-tooltip');
    let zeroGravity = false;

    function onMouseMove(event) {
        const rect = renderer.domElement.getBoundingClientRect();
        
        // Coordonnées 3D
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        // Parallaxe
        targetRotation.x = mouse.y * 0.5; 
        targetRotation.y = mouse.x * 0.5;

        // --- POSITION DU TITRE SIMPLIFIÉE ---
        // 1. Position horizontale : Au niveau de la souris
        tooltip.style.left = event.clientX + 'px';
        
        // 2. Position verticale : 20px au-dessus de la souris
        // Le CSS fait déjà translate(-50%, -100%), donc on se met juste 20px plus haut
        tooltip.style.top = (event.clientY - 20) + 'px';
    }

    function onClick(event) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects([...orbitMeshes, coreMesh, innerCore]);

        if (intersects.length > 0) {
            const object = intersects[0].object;
            if (object.userData.isElectron && !zeroGravity) {
                const data = skillData[object.userData.key];
                if (data && data.targetModal) {
                    const modal = document.getElementById(data.targetModal);
                    if(modal) {
                        modal.classList.add('active');
                        document.body.style.overflow = 'hidden';
                    }
                }
            } else if (object.userData.isCore) {
                zeroGravity = !zeroGravity;
                if(zeroGravity) {
                    coreMat.emissive.setHex(0xffffff);
                    container.style.cursor = 'wait';
                    orbitMeshes.forEach(mesh => {
                        mesh.userData.velocity.set((Math.random()-0.5)*0.5, (Math.random()-0.5)*0.5, (Math.random()-0.5)*0.5);
                    });
                } else {
                    coreMat.emissive.setHex(0xff4b2b);
                    container.style.cursor = 'default';
                }
            }
        }
    }

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('click', onClick);

    function animate() {
        requestAnimationFrame(animate);
        const time = Date.now() * 0.001;

        // Rotation Noyau
        coreGroup.rotation.x += 0.05 * (targetRotation.x - coreGroup.rotation.x);
        coreGroup.rotation.y += 0.05 * (targetRotation.y - coreGroup.rotation.y);
        
        const pulse = 1 + Math.sin(time * 2) * 0.05;
        coreMesh.scale.setScalar(pulse);
        innerCore.rotation.y -= 0.02;

        // Rotation Électrons
        if(!zeroGravity) {
            electronGroup.rotation.y += 0.003; 
            electronGroup.rotation.z = Math.sin(time * 0.2) * 0.1;
            orbitMeshes.forEach(mesh => mesh.position.lerp(mesh.userData.basePos, 0.05));
        } else {
            orbitMeshes.forEach(mesh => {
                mesh.position.add(mesh.userData.velocity);
                mesh.rotation.x += 0.05;
            });
            electronGroup.rotation.y += 0.001;
        }

        // Raycasting
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(orbitMeshes);
        
        if (intersects.length === 0) {
            tooltip.style.opacity = '0';
            container.style.cursor = zeroGravity ? 'wait' : 'grab';
        }

        orbitMeshes.forEach(mesh => {
            const isHovered = (intersects.length > 0 && intersects[0].object === mesh);
            
            if (isHovered && !zeroGravity) {
                container.style.cursor = 'pointer';
                const key = mesh.userData.key;
                const colorHex = skillData[key].color.toString(16).padStart(6, '0');
                
                tooltip.innerHTML = `
                    <strong style="color:#${colorHex}">${skillData[key].title}</strong><br>
                    <span style="font-size:0.8em; font-weight:400; color:#ccc;">${skillData[key].desc}</span>
                `;
                tooltip.style.opacity = '1';
                tooltip.style.borderColor = `#${colorHex}`;
                
                mesh.userData.hoverIntensity = THREE.MathUtils.lerp(mesh.userData.hoverIntensity, 1, 0.1);
            } else {
                mesh.userData.hoverIntensity = THREE.MathUtils.lerp(mesh.userData.hoverIntensity, 0, 0.1);
            }

            const intensity = mesh.userData.hoverIntensity;
            mesh.scale.setScalar(1 + intensity * 0.3);
            mesh.material.emissiveIntensity = 0.2 + intensity * 1.5;
        });

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });
}

document.addEventListener('DOMContentLoaded', init3DArsenal);

window.addEventListener('DOMContentLoaded', initGallery);