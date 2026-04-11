// ── STARFIELD ──
(function() {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let W, H, stars = [];
 
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();
 
  for (let i = 0; i < 160; i++) {
    stars.push({
      x: Math.random() * 2000,
      y: Math.random() * 2000,
      r: Math.random() * 1.5 + 0.3,
      a: Math.random(),
      s: Math.random() * 0.01 + 0.003
    });
  }
 
  function draw() {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => {
      s.a += s.s;
      if (s.a > 1) s.s = -s.s;
      if (s.a < 0) { s.a = 0; s.s = Math.abs(s.s); }
      ctx.beginPath();
      ctx.arc(s.x % W, s.y % H, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,240,230,${s.a})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();
 
// ── PETALS ──
(function() {
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.top = '-20px';
    p.style.animationDuration = (5 + Math.random() * 8) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    p.style.width = (6 + Math.random() * 10) + 'px';
    p.style.opacity = '0';
    document.body.appendChild(p);
  }
})();
 
// ── STATE ──
let currentScreen = 0;
let candlesBlown = false;
let cakeCut = false;
let giftOpened = false;
 
// ── NAVIGATION ──
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}
 
function updateDots(n) {
  document.querySelectorAll('.dot').forEach((d,i) => {
    d.classList.toggle('active', i === n);
  });
}
 
function goToCake() {
  spawnConfetti(40);
  showScreen('screen-cake');
  updateDots(1);
  currentScreen = 1;
  spawnHearts(6);
}
 
function goToCut() {
  showScreen('screen-cut');
  updateDots(2);
  currentScreen = 2;
  spawnConfetti(30);
}
 
function goToGift() {
  showScreen('screen-gift');
  updateDots(3);
  currentScreen = 3;
  spawnHearts(8);
}
 
// ── BLOW CANDLES ──
let blowCount = 0;
function blowCandles() {
  const btn = document.getElementById('blowBtn');
  btn.classList.add('listening');
  btn.textContent = '💨';
 
  // Blow out candles one by one with delay
  blowCount = 0;
  const flames = ['f1','f2','f3','f4','f5'];
 
  // Shuffle for random order
  const shuffled = flames.sort(() => Math.random() - 0.5);
 
  shuffled.forEach((id, i) => {
    setTimeout(() => {
      document.getElementById(id).classList.add('out');
      // spawn sparks
      spawnSparks(i);
    }, i * 220);
  });
 
  setTimeout(() => {
    btn.classList.remove('listening');
    btn.textContent = '✅';
    btn.style.cursor = 'default';
    btn.onclick = null;
    spawnConfetti(60);
    spawnHearts(10);
    document.getElementById('proceedCut').classList.add('show');
    candlesBlown = true;
  }, flames.length * 220 + 600);
}
 
function spawnSparks(seed) {
  const colors = ['#ffd700','#ff8c00','#ff4500','#ffe4b5'];
  for (let i = 0; i < 6; i++) {
    const s = document.createElement('div');
    s.style.cssText = `
      position:fixed;
      width:5px;height:5px;
      border-radius:50%;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      left:${40 + seed*5 + Math.random()*20}%;
      top:${40 + Math.random()*10}%;
      pointer-events:none;
      z-index:999;
      animation:confettiFall 0.8s ease-out forwards;
    `;
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 900);
  }
}
 
// ── CUT CAKE ──
function cutCake() {
  if (cakeCut) return;
  cakeCut = true;
  const knife = document.getElementById('knife');
  // Lock transform so no rotation ever happens
  knife.style.transform = 'translateX(-50%)';
  knife.classList.add('cutting');
  knife.style.cursor = 'default';
  knife.onclick = null;
 
  // Show cut line
  setTimeout(() => {
    document.getElementById('cutLine').style.height = '120px';
  }, 300);
 
  setTimeout(() => {
    document.getElementById('cutHint').textContent = '🎉 Perfect cut!';
    document.getElementById('cutHint').style.color = '#f5c842';
    spawnConfetti(80);
    spawnHearts(12);
    knife.textContent = '✨';
    document.getElementById('proceedGift').classList.add('show');
  }, 700);
}
 
// ── OPEN GIFT ──
function openGift() {
  if (giftOpened) return;
  giftOpened = true;
 
  const area = document.getElementById('giftArea');
  area.classList.add('opened');
  document.getElementById('giftHint').style.opacity = '0';
 
  // Burst stars
  const positions = [
    '--burst-to:translate(-80px,-100px)',
    '--burst-to:translate(80px,-100px)',
    '--burst-to:translate(-120px,-50px)',
    '--burst-to:translate(120px,-50px)',
    '--burst-to:translate(0,-130px)',
    '--burst-to:translate(-60px,-130px)',
    '--burst-to:translate(60px,-130px)',
  ];
  const emojis = ['✨','⭐','💫','🌟','💕','🌸','💖'];
  positions.forEach((p, i) => {
    const star = document.createElement('div');
    star.className = 'burst-star';
    star.textContent = emojis[i];
    star.style.cssText = `
      ${p};
      left:50%;top:40%;
      animation-delay:${i * 0.06}s;
      animation-duration:${0.8 + Math.random()*0.4}s;
    `;
    area.appendChild(star);
    setTimeout(() => star.remove(), 1500);
  });
 
  // Show message card
  setTimeout(() => {
    document.getElementById('msgCard').classList.add('visible');
    spawnHearts(20);
    spawnConfetti(100);
  }, 600);
 
  // Show final message + gallery button
  setTimeout(() => {
    document.getElementById('finalMsg').classList.add('show');
  }, 1400);
  setTimeout(() => {
    document.getElementById('galleryBtn').classList.add('show');
  }, 2200);
}
 
// ── CONFETTI ──
function spawnConfetti(n) {
  const colors = ['#e8637a','#f5c842','#c9a7f5','#80deea','#ff80ab','#a5d6a7','#fff176'];
  const shapes = ['border-radius:50%', 'border-radius:2px', 'clip-path:polygon(50% 0%,100% 100%,0% 100%)'];
  for (let i = 0; i < n; i++) {
    const c = document.createElement('div');
    c.className = 'confetti-piece';
    const size = 6 + Math.random() * 8;
    c.style.cssText = `
      width:${size}px; height:${size}px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      ${shapes[Math.floor(Math.random()*shapes.length)]};
      left:${Math.random()*100}vw;
      top:-20px;
      animation-delay:${Math.random()*0.8}s;
      animation-duration:${2 + Math.random()*2}s;
    `;
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 4000);
  }
}
 
// ── HEARTS ──
function spawnHearts(n) {
  const hearts = ['♡','❤️','💕','💗','💖','🌸','✨'];
  for (let i = 0; i < n; i++) {
    const h = document.createElement('div');
    h.className = 'float-heart';
    h.textContent = hearts[Math.floor(Math.random()*hearts.length)];
    h.style.cssText = `
      left:${10 + Math.random()*80}vw;
      bottom:${10 + Math.random()*30}vh;
      font-size:${0.8 + Math.random()*1.2}rem;
      animation-delay:${Math.random()*0.6}s;
      animation-duration:${2 + Math.random()*2}s;
    `;
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 4000);
  }
}
 
 
// ── GALLERY ──
const photoData = [
  {
    title: '"Grace in Every Glance"',
    sub: 'The way you carry yourself is pure poetry — every pose, every smile, a masterpiece that the world is lucky to witness. Happy Birthday, Rikta. 🌸',
    hearts: '🌸 ♡ 🌸'
  },
  {
    title: '"Eyes That Hold Universes"',
    sub: 'Looking into your eyes is like finding a home I never knew I needed. You are radiant, real, and completely irreplaceable. I adore you. 💕',
    hearts: '💕 ♡ 💕'
  },
  {
    title: '"A Poem Written in Light"',
    sub: 'Even the golden hour bows before your beauty. You are the kind of girl that makes ordinary moments feel like fairytales. Always. ✨',
    hearts: '✨ ♡ ✨'
  }
];
 
function goToGallery() {
  showScreen('screen-gallery');
  updateDots(4);
  currentScreen = 4;
  spawnHearts(12);
  spawnConfetti(50);
}
 
function openLightbox(idx) {
  const lb = document.getElementById('lightbox');
  const imgs = document.querySelectorAll('.gallery-card img');
  document.getElementById('lightboxImg').src = imgs[idx].src;
  document.getElementById('lightboxTitle').textContent = photoData[idx].title;
  document.getElementById('lightboxSub').textContent = photoData[idx].sub;
  document.getElementById('lightboxHearts').textContent = photoData[idx].hearts;
  lb.classList.add('open');
  spawnHearts(8);
}
 
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
}
 
// Close lightbox on Escape
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeLightbox(); });
 
 
// ── MUSIC ──
let musicPlaying = false;
 
function startMusicOnce() {
  const music = document.getElementById('bgMusic');
  if (!musicPlaying) {
    music.volume = 0;
    music.play().then(() => {
      musicPlaying = true;
      updateMusicBtn();
      // Fade in volume
      let vol = 0;
      const fade = setInterval(() => {
        vol = Math.min(vol + 0.05, 0.55);
        music.volume = vol;
        if (vol >= 0.55) clearInterval(fade);
      }, 120);
    }).catch(() => {});
  }
}
 
function toggleMusic() {
  const music = document.getElementById('bgMusic');
  const label = document.getElementById('musicLabel');
  if (music.paused) {
    music.play().then(() => {
      musicPlaying = true;
      updateMusicBtn();
    }).catch(() => {});
  } else {
    music.pause();
    musicPlaying = false;
    updateMusicBtn();
  }
  // Show label briefly
  label.style.opacity = '1';
  clearTimeout(window._labelTimer);
  window._labelTimer = setTimeout(() => { label.style.opacity = '0'; }, 2000);
}
 
function updateMusicBtn() {
  const btn = document.getElementById('musicBtn');
  const music = document.getElementById('bgMusic');
  if (music.paused) {
    btn.textContent = '🔇';
    btn.style.opacity = '0.6';
    btn.title = 'Play Music';
  } else {
    btn.textContent = '🎵';
    btn.style.opacity = '1';
    btn.title = 'Pause Music';
  }
}
 
// Auto-start music on first user interaction with the page
document.addEventListener('click', function autoPlay() {
  startMusicOnce();
  document.removeEventListener('click', autoPlay);
}, { once: true });
 
// Also pulse the music button to hint at it
setTimeout(() => {
  const btn = document.getElementById('musicBtn');
  btn.style.animation = 'ringPulse 2s ease-in-out 3';
}, 2000);
 
// ── INITIAL HEARTS ──
setTimeout(() => spawnHearts(5), 1500);