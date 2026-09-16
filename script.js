// ---------- Footer year ----------
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Scroll-scrub frame animation ----------
const canvas = document.getElementById('scrollCanvas');
const ctx = canvas.getContext('2d');

const FRAME_COUNT = 96;
const FRAME_PATH = i => `assets/frames/frame_${String(i).padStart(3,'0')}.jpg`;

const images = [];
let loadedCount = 0;

function preloadImages(){
  for(let i=1; i<=FRAME_COUNT; i++){
    const img = new Image();
    img.src = FRAME_PATH(i);
    img.onload = () => {
      loadedCount++;
      if(i === 1) drawFrame(0); // paint first frame ASAP
    };
    images.push(img);
  }
}

function resizeCanvas(){
  canvas.width = canvas.clientWidth * window.devicePixelRatio;
  canvas.height = canvas.clientHeight * window.devicePixelRatio;
}

function drawFrame(index){
  const img = images[index];
  if(!img || !img.complete || img.naturalWidth === 0) return;

  const canvasRatio = canvas.width / canvas.height;
  const imgRatio = img.naturalWidth / img.naturalHeight;
  let drawW, drawH, offX, offY;

  if(imgRatio > canvasRatio){
    drawH = canvas.height;
    drawW = drawH * imgRatio;
    offX = (canvas.width - drawW) / 2;
    offY = 0;
  } else {
    drawW = canvas.width;
    drawH = drawW / imgRatio;
    offX = 0;
    offY = (canvas.height - drawH) / 2;
  }
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.drawImage(img, offX, offY, drawW, drawH);
}

let ticking = false;
function onScroll(){
  if(!ticking){
    window.requestAnimationFrame(() => {
      const hero = document.getElementById('hero');
      const rect = hero.getBoundingClientRect();
      const heroHeight = hero.offsetHeight;
      // progress: 0 when hero top at top of viewport, 1 when hero fully scrolled past
      const scrolled = Math.min(Math.max(-rect.top, 0), heroHeight);
      const progress = scrolled / heroHeight;
      const frameIndex = Math.min(
        FRAME_COUNT - 1,
        Math.floor(progress * FRAME_COUNT)
      );
      drawFrame(frameIndex);
      ticking = false;
    });
    ticking = true;
  }
}

window.addEventListener('resize', () => { resizeCanvas(); onScroll(); });
window.addEventListener('scroll', onScroll, { passive:true });

resizeCanvas();
preloadImages();
setTimeout(onScroll, 200);

// ---------- PINNED 3D SERVICE STAGE ----------
const stageSection = document.querySelector('.services-3d');
const stageCards = document.querySelectorAll('.stage-card');
const stageDots = document.querySelectorAll('.dot');
const STAGE_COUNT = stageCards.length;

function updateStage(){
  if(!stageSection) return;
  const rect = stageSection.getBoundingClientRect();
  const sectionHeight = stageSection.offsetHeight;
  const viewportH = window.innerHeight;

  // total scrollable distance within this pinned section
  const scrollable = sectionHeight - viewportH;
  const scrolled = Math.min(Math.max(-rect.top, 0), scrollable);
  const overall = scrollable > 0 ? scrolled / scrollable : 0; // 0 -> 1 across whole section

  const posInStages = overall * STAGE_COUNT; // 0 -> STAGE_COUNT

  stageCards.forEach((card, i) => {
    let diff = posInStages - i;
    diff = Math.max(-1, Math.min(1, diff));

    const rotateY = diff * -85;      // incoming from right, exits to left
    const translateX = diff * 60;    // percent
    const translateZ = -Math.abs(diff) * 420;
    const opacity = 1 - Math.abs(diff);
    const scale = 1 - Math.abs(diff) * 0.15;

    card.style.transform = `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
    card.style.opacity = Math.max(0, opacity).toFixed(3);
    card.style.pointerEvents = Math.abs(diff) < 0.5 ? 'auto' : 'none';
    card.style.zIndex = Math.round((1 - Math.abs(diff)) * 10);
  });

  const activeIndex = Math.min(STAGE_COUNT - 1, Math.round(posInStages));
  stageDots.forEach((dot, i) => dot.classList.toggle('active', i === activeIndex));
}

// ---------- GENERIC 3D SCROLL REVEAL ----------
const revealEls = document.querySelectorAll('[data-reveal-3d]');

function updateReveals(){
  const viewportH = window.innerHeight;
  revealEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    // progress: 0 when element top is at bottom of viewport, 1 when at 65% up the viewport
    const start = viewportH;
    const end = viewportH * 0.35;
    let progress = (start - rect.top) / (start - end);
    progress = Math.max(0, Math.min(1, progress));

    const dir = el.getAttribute('data-reveal-3d');
    const delay = parseInt(el.getAttribute('data-reveal-delay') || '0', 10);
    // stagger: shift progress slightly per delay index
    const staggered = Math.max(0, Math.min(1, progress - delay * 0.08));

    let transform = '';
    if(dir === 'left'){
      transform = `translateX(${(1-staggered) * -80}px) rotateY(${(1-staggered) * 25}deg)`;
    } else if(dir === 'right'){
      transform = `translateX(${(1-staggered) * 80}px) rotateY(${(1-staggered) * -25}deg)`;
    } else {
      transform = `translateY(${(1-staggered) * 60}px) rotateX(${(1-staggered) * 18}deg)`;
    }
    el.style.transform = transform;
    el.style.opacity = staggered.toFixed(3);
  });
}

let stageTicking = false;
function onStageScroll(){
  if(!stageTicking){
    window.requestAnimationFrame(() => {
      updateStage();
      updateReveals();
      stageTicking = false;
    });
    stageTicking = true;
  }
}
window.addEventListener('scroll', onStageScroll, { passive:true });
window.addEventListener('resize', onStageScroll);
setTimeout(onStageScroll, 200);

// ---------- Mobile nav toggle ----------
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');
if(navToggle){
  navToggle.addEventListener('click', () => {
    mainNav.style.display = mainNav.style.display === 'flex' ? 'none' : 'flex';
    mainNav.style.position = 'fixed';
    mainNav.style.top = '70px';
    mainNav.style.left = '0';
    mainNav.style.right = '0';
    mainNav.style.flexDirection = 'column';
    mainNav.style.background = '#0a0a0a';
    mainNav.style.padding = '24px 5%';
    mainNav.style.gap = '20px';
  });
}
