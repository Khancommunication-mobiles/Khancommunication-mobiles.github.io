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
