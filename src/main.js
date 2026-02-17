import './style.css'

console.log('Thermo Energy Paris loaded');

// --- Living Pipe Animation ---
const svgNS = "http://www.w3.org/2000/svg";
const pipeContainer = document.createElementNS(svgNS, "svg");
pipeContainer.style.position = "absolute";
pipeContainer.style.top = "0";
pipeContainer.style.left = "0";
pipeContainer.style.width = "100%";
pipeContainer.style.zIndex = "0";
pipeContainer.style.pointerEvents = "none";
pipeContainer.style.overflow = "visible"; // Allow markers to overflow if needed
document.body.prepend(pipeContainer);

// Define Defs for 3D Effects (Gradients/Filters)
const defs = document.createElementNS(svgNS, "defs");
pipeContainer.appendChild(defs);

// Filter for Drop Shadow (Depth)
defs.innerHTML += `
<filter id="pipeShadow" x="-50%" y="-50%" width="200%" height="200%">
  <feDropShadow dx="4" dy="4" stdDeviation="3" flood-color="#000" flood-opacity="0.5"/>
</filter>
<linearGradient id="pipeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
  <stop offset="0%" stop-color="#f8c61e" />
  <stop offset="50%" stop-color="#FFC000" />
  <stop offset="100%" stop-color="#E5A000" />
</linearGradient>
<marker id="flange" markerWidth="10" markerHeight="20" refX="5" refY="10" orient="auto">
    <rect x="0" y="0" width="10" height="20" rx="2" fill="#f8c61e" stroke="#B8860B" stroke-width="2"/>
</marker>
`;

/* 
  We will draw THREE paths stacked to simulate a 3D Tube:
  1. Base/Shadow (Thickest, Darker)
  2. Main Body (Thick, Yellow)
  3. Highlight (Thinner, Lighter, Top-offset?)
*/

// 1. Shadow/Border Path
const pipeBase = document.createElementNS(svgNS, "path");
pipeBase.setAttribute("stroke", "#B8860B"); // Dark Goldenrod outline
pipeBase.setAttribute("stroke-width", "26");
pipeBase.setAttribute("fill", "none");
pipeBase.setAttribute("stroke-linecap", "butt");
pipeBase.setAttribute("stroke-linejoin", "round");
pipeBase.style.filter = "url(#pipeShadow)";
pipeContainer.appendChild(pipeBase);

// 2. Main Pipe Body
const pipeMain = document.createElementNS(svgNS, "path");
pipeMain.setAttribute("stroke", "#f8c61e"); // Standard Gold
pipeMain.setAttribute("stroke-width", "20");
pipeMain.setAttribute("fill", "none");
pipeMain.setAttribute("stroke-linecap", "butt");
pipeMain.setAttribute("stroke-linejoin", "round");
pipeContainer.appendChild(pipeMain);

// 3. Highlight (Reflection)
const pipeHighlight = document.createElementNS(svgNS, "path");
pipeHighlight.setAttribute("stroke", "rgba(255, 255, 255, 0.4)");
pipeHighlight.setAttribute("stroke-width", "6");
pipeHighlight.setAttribute("fill", "none");
pipeHighlight.setAttribute("stroke-linecap", "butt");
pipeHighlight.setAttribute("stroke-linejoin", "round");
// Shift highlight slightly up/left? Hard to do with just path data on complex turns. 
// For now, centered highlight simulates overhead lighting nicely on a tube.
pipeContainer.appendChild(pipeHighlight);

// --- SECOND PIPE SEGMENT (Hidden on Mobile) ---
const pipeSecondGroup = document.createElementNS(svgNS, "g");
pipeSecondGroup.classList.add("pipe-second-segment");
pipeContainer.appendChild(pipeSecondGroup);

// Second segment paths
const pipeBase2 = document.createElementNS(svgNS, "path");
pipeBase2.setAttribute("stroke", "#B8860B");
pipeBase2.setAttribute("stroke-width", "26");
pipeBase2.setAttribute("fill", "none");
pipeBase2.setAttribute("stroke-linecap", "butt");
pipeBase2.setAttribute("stroke-linejoin", "round");
pipeBase2.style.filter = "url(#pipeShadow)";
pipeSecondGroup.appendChild(pipeBase2);

const pipeMain2 = document.createElementNS(svgNS, "path");
pipeMain2.setAttribute("stroke", "#f8c61e");
pipeMain2.setAttribute("stroke-width", "20");
pipeMain2.setAttribute("fill", "none");
pipeMain2.setAttribute("stroke-linecap", "butt");
pipeMain2.setAttribute("stroke-linejoin", "round");
pipeSecondGroup.appendChild(pipeMain2);

const pipeHighlight2 = document.createElementNS(svgNS, "path");
pipeHighlight2.setAttribute("stroke", "rgba(255, 255, 255, 0.4)");
pipeHighlight2.setAttribute("stroke-width", "6");
pipeHighlight2.setAttribute("fill", "none");
pipeHighlight2.setAttribute("stroke-linecap", "butt");
pipeHighlight2.setAttribute("stroke-linejoin", "round");
pipeSecondGroup.appendChild(pipeHighlight2);

const flangesSecondContainer = document.createElementNS(svgNS, "g");
flangesSecondContainer.classList.add("pipe-second-segment");
pipeContainer.appendChild(flangesSecondContainer);


function getCenter(element) {
  if (!element) return { x: 0, y: 0 };
  const rect = element.getBoundingClientRect();
  const scrollX = window.scrollX || window.pageXOffset;
  const scrollY = window.scrollY || window.pageYOffset;
  return {
    x: rect.left + rect.width / 2 + scrollX,
    y: rect.top + rect.height / 2 + scrollY,
    rect: rect,
    scrollY: scrollY
  };
}

// --- Pipe Logic ---
const flangesContainer = document.createElementNS(svgNS, "g");
pipeContainer.appendChild(flangesContainer);

function createFlange(x, y, orientation) {
  const flange = document.createElementNS(svgNS, "rect");
  const size = 32; // Slightly wider than pipe (20px)
  const thickness = 8;

  // Centering logic
  let fx = x;
  let fy = y;
  let w = size;
  let h = thickness;

  if (orientation === 'vertical') {
    // Pipe is vertical, Flange is horizontal-ish? 
    // No, flange is a ring AROUND the pipe.
    // If pipe is vertical | , flange is a rect [-] across it.
    // width = size, height = thickness
    fx = x - size / 2;
    fy = y - thickness / 2;
    w = size;
    h = thickness;
  } else {
    // Pipe is horizontal, flange is vertical rect | |
    // width = thickness, height = size
    fx = x - thickness / 2;
    fy = y - size / 2;
    w = thickness;
    h = size;
  }

  flange.setAttribute("x", fx);
  flange.setAttribute("y", fy);
  flange.setAttribute("width", w);
  flange.setAttribute("height", h);
  flange.setAttribute("rx", "2"); // Rounded corners
  flange.setAttribute("fill", "#f8c61e");
  flange.setAttribute("stroke", "#B8860B");
  flange.setAttribute("stroke-width", "2");
  flange.classList.add('pipe-flange'); // For potential animation

  // Stili per l'animazione di apparizione
  flange.style.opacity = '0';
  flange.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
  flange.style.transformOrigin = 'center';
  flange.style.transformBox = 'fill-box';

  return flange;
}

// Helper to draw segment and place flanges
// currentPt is updated by ref
// d string is appended to by ref? No, pass D.
// Actually, let's build a path commands array
let currentPathCommands = "";
let currentX = 0;
let currentY = 0;
let activeFlangesContainer = flangesContainer; // Track which container to add flanges to

function moveTo(x, y) {
  currentPathCommands += `M ${x} ${y} `;
  currentX = x;
  currentY = y;
}

function lineTo(x, y) {
  // Determine orientation
  const isHorizontal = Math.abs(y - currentY) < 1;
  const isVertical = Math.abs(x - currentX) < 1;

  // Add flanges "Before" the line (at start), "Every Tot", and "After" (at end)?
  // User says "Before and After curves". The 'End' of this line is the 'Start' of a curve usually.
  // The 'Start' of this line is the 'End' of a previous curve.

  // Flange at Start (After previous curve)
  // Offset slightly? No, put it right at the joint usually.
  // Or offset by curve radius?
  // Let's place fitting at Start + 25px

  const length = Math.hypot(x - currentX, y - currentY);
  const segmentDirX = (x - currentX) / length;
  const segmentDirY = (y - currentY) / length;

  // Flange settings
  const fitOffset = 25; // How far from corner
  const repeatInterval = 300; // "Ogni tot"

  if (length > fitOffset * 2) {
    // Place Start Flange
    const sx = currentX + segmentDirX * fitOffset;
    const sy = currentY + segmentDirY * fitOffset;
    activeFlangesContainer.appendChild(createFlange(sx, sy, isHorizontal ? 'horizontal' : 'vertical'));

    // Place End Flange
    const ex = x - segmentDirX * fitOffset;
    const ey = y - segmentDirY * fitOffset;
    activeFlangesContainer.appendChild(createFlange(ex, ey, isHorizontal ? 'horizontal' : 'vertical'));

    // Intermediate Flanges
    let dist = fitOffset + repeatInterval;
    while (dist < length - fitOffset) {
      const ix = currentX + segmentDirX * dist;
      const iy = currentY + segmentDirY * dist;
      activeFlangesContainer.appendChild(createFlange(ix, iy, isHorizontal ? 'horizontal' : 'vertical'));
      dist += repeatInterval;
    }
  }

  // Draw the actual line
  if (isHorizontal) currentPathCommands += `H ${x} `;
  else if (isVertical) currentPathCommands += `V ${y} `;
  else currentPathCommands += `L ${x} ${y} `;

  currentX = x;
  currentY = y;
}

function drawPipe() {
  const docHeight = Math.max(
    document.body.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.clientHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight
  );
  pipeContainer.style.height = docHeight + 'px';

  // Clear previous flanges
  while (flangesContainer.firstChild) {
    flangesContainer.removeChild(flangesContainer.firstChild);
  }
  currentPathCommands = "";
  activeFlangesContainer = flangesContainer; // Reset to first segment container

  const w = window.innerWidth;

  const subtitle = document.querySelector('.hero-subtitle');
  const aboutUs = document.querySelector('.about-container');
  const pillars = document.querySelector('.pillars');
  const processSteps = document.querySelectorAll('.step-number');
  const contactForm = document.querySelector('.contact-form');

  if (!subtitle || !aboutUs || !pillars || processSteps.length === 0) return;

  // --- Path Construction ---
  const pSubtitle = getCenter(subtitle);
  const pipeY = pSubtitle.y + 70;
  const pAbout = getCenter(aboutUs);
  const pPillars = getCenter(pillars);
  const pProcess = getCenter(document.querySelector('#process'));

  // Start
  moveTo(-50, pipeY);

  // HERO VALVE SECTION
  const centerX = w / 2;
  const valveWidth = 200;
  const valveHeight = 50;

  // In to valve start
  lineTo(centerX - valveWidth, pipeY);

  // Valve Shape
  lineTo(centerX - valveWidth, pipeY - valveHeight);
  lineTo(centerX - valveWidth + 40, pipeY - valveHeight);
  lineTo(centerX - valveWidth + 40, pipeY);
  lineTo(centerX + valveWidth - 40, pipeY);
  lineTo(centerX + valveWidth - 40, pipeY - valveHeight);
  lineTo(centerX + valveWidth, pipeY - valveHeight);
  lineTo(centerX + valveWidth, pipeY);

  // Snaking through About Us
  const extraX = w * 0.15;
  lineTo(extraX, pipeY);
  lineTo(extraX, pAbout.y - 100);
  lineTo(extraX + 100, pAbout.y - 100);
  lineTo(extraX + 100, pAbout.y);
  lineTo(extraX, pAbout.y);
  lineTo(extraX, pAbout.y + 100);

  // Drop to Pillars and snake through cards
  const pillarCards = document.querySelectorAll('.pillar-card');
  if (pillarCards.length > 0) {
    // Go to right side first
    const p1 = getCenter(pillarCards[0]);
    const p2 = getCenter(pillarCards[1]);
    const p3 = getCenter(pillarCards[2]);

    // From About Us bottom
    lineTo(extraX + 100, p1.y); // Align with cards vertical center

    // Snake through card 1 (Plomberie) - PARFAIT
    lineTo(p1.x - 20, p1.y); // Entry joint
    lineTo(p1.x + 20, p1.y); // Exit joint

    // 1. Drop DOWN to contour UNDER Card 2 (Urgence)
    const dropBelow = p2.y + 180;
    const gapBetween12 = (p1.x + p2.x) / 2;
    lineTo(gapBetween12, p1.y);
    lineTo(gapBetween12, dropBelow);

    // 2. Contour UNDER Card 2
    const gapBetween23 = (p2.x + p3.x) / 2;
    lineTo(gapBetween23, dropBelow);

    // 3. Rise UP to contour OVER Card 3 (Chauffage)
    const riseAbove = p3.y - 180;
    lineTo(gapBetween23, riseAbove);

    // 4. Contour OVER Card 3
    const farRight = p3.x + 120;
    lineTo(farRight, riseAbove);
    // 5. EXIT RIGHT: Go off-screen right
    const offScreenRight = w + 100;
    lineTo(offScreenRight, riseAbove);

    // Misuriamo la lunghezza della prima parte prima del salto
    const tempPath = document.createElementNS(svgNS, "path");
    tempPath.setAttribute("d", currentPathCommands);
    const firstPartLength = tempPath.getTotalLength();
    pipeMain.dataset.firstPartLength = firstPartLength;

    // SAVE FIRST SEGMENT PATH and apply it
    const firstSegmentPath = currentPathCommands;
    pipeBase.setAttribute("d", firstSegmentPath);
    pipeMain.setAttribute("d", firstSegmentPath);
    pipeHighlight.setAttribute("d", firstSegmentPath);

    // --- SECOND SEGMENT (Hidden on Mobile) ---
    // Clear second segment flanges container
    while (flangesSecondContainer.firstChild) {
      flangesSecondContainer.removeChild(flangesSecondContainer.firstChild);
    }

    // Reset path commands for second segment
    currentPathCommands = "";
    // Store original flange container, switch to second segment container
    const originalFlangesContainer = flangesContainer;

    // 6. ENTER LEFT: Jump to left side below title
    const pProcessTitle = getCenter(document.querySelector('#process .section-title'));

    // Pipe enters from left of screen, goes under title
    const entryY_Process = pProcessTitle.y + 60; // Slightly below title
    const entryX_Process = pProcessTitle.x - 300; // Start left of title

    moveTo(0, entryY_Process);

    // Switch to second segment flanges container
    activeFlangesContainer = flangesSecondContainer;

    lineTo(pProcessTitle.x, entryY_Process);

    // 7. FOLLOW STAIRCASE (Connect spacing)
    // We will draw a line that 'steps' down with the cards.
    // Instead of going THROUGH cards, let's go ALONGSIDE them or BEHIND them to connect them.
    // Let's travel down the LEFT side of the cards to emphasize the stack.

    let prevX = pProcessTitle.x;
    let prevY = entryY_Process;

    processSteps.forEach((step, index) => {
      const parentStep = step.closest('.step');
      const cardBody = parentStep.querySelector('.card-body');
      const pCard = getCenter(cardBody);

      // Target point: Left edge of card + some padding
      // Actually, since they are staggered right, the left edge moves right too.
      // Let's aim for a point to the LEFT of the card.
      const targetX = pCard.x - 180; // 180px left of card center
      const targetY = pCard.y;

      // Draw standard plumbing right-angles
      // Drop down to target Y first? Or move X first?
      // Drop Y to match target Y, then move X.

      lineTo(prevX, targetY); // Vertical Drop
      lineTo(targetX, targetY); // Horizontal Move to card

      // Simulate connection "into" the card?
      // Add a small nub? 
      // lineTo(targetX + 30, targetY);
      // lineTo(targetX, targetY);

      // Update mechanism
      prevX = targetX;
      prevY = targetY;
    });

    // --- END PIPE LOGIC ---
    // From last point (Step 4), snake to image and then down.

    // We are currently at the bottom-left of Step 4 (or wherever the loop left us = prevX, prevY).
    // Loop actually draws to 'targetX, targetY' which is left of the card center.

    const step4 = processSteps[3];
    const pStep4 = getCenter(step4.closest('.step').querySelector('.card-body'));

    // 1. Go RIGHT from Step 4
    // Go past the card width significantly to reach the "gap" or image area.
    const xGap = pStep4.x + 250; // Move well to the right of Step 4

    lineTo(xGap, prevY); // Move horizontally right from Step 4 position

    // 2. Go UP to height of Step 3
    const step3 = processSteps[2];
    const pStep3 = getCenter(step3.closest('.step').querySelector('.card-body'));

    lineTo(xGap, pStep3.y); // Move vertically up

    // 3. Go RIGHT passing under the image
    // Find image center X
    const processImage = document.querySelector('.process-image');
    let pImageX = xGap + 200; // Default if no image
    if (processImage) {
      const pImage = getCenter(processImage);
      pImageX = pImage.x; // Center of image
    }

    lineTo(pImageX, pStep3.y); // Move right under image at Step 3 height

    // 4. Descend VERTICALLY to Contact Section
    if (contactForm) {
      const pContactCenter = getCenter(contactForm);
      // Drop down
      lineTo(pImageX, pContactCenter.y - 100);
      lineTo(pContactCenter.x, pContactCenter.y - 100);
      lineTo(pContactCenter.x, pContactCenter.y);
    }

    // Apply second segment path
    const secondSegmentPath = currentPathCommands;
    pipeBase2.setAttribute("d", secondSegmentPath);
    pipeMain2.setAttribute("d", secondSegmentPath);
    pipeHighlight2.setAttribute("d", secondSegmentPath);

    // Store second segment length
    pipeMain2.dataset.segmentLength = pipeMain2.getTotalLength();
  }
}

// Initial Draw and Resize Listener
window.addEventListener('load', () => {
  drawPipe();
  updateScroll();
});
window.addEventListener('resize', drawPipe);

// --- Scroll Logic for "Drawing" ---
function updateScroll() {
  // First segment path length
  const pathLength1 = pipeMain.getTotalLength();
  const pathLength2 = pipeMain2.getTotalLength() || 0;

  // Set dasharray for first segment
  pipeBase.style.strokeDasharray = pathLength1;
  pipeMain.style.strokeDasharray = pathLength1;
  pipeHighlight.style.strokeDasharray = pathLength1;

  // Set dasharray for second segment
  if (pathLength2 > 0) {
    pipeBase2.style.strokeDasharray = pathLength2;
    pipeMain2.style.strokeDasharray = pathLength2;
    pipeHighlight2.style.strokeDasharray = pathLength2;
  }

  const scrollY = window.scrollY;
  const windowH = window.innerHeight;
  const fullH = document.body.scrollHeight - windowH;

  // Rilevamento preciso della sezione #services (invece di #process)
  const servicesSection = document.querySelector('#services');
  const servicesRect = servicesSection ? servicesSection.getBoundingClientRect() : null;
  const servicesSectionTop = servicesRect ? servicesRect.top + scrollY : fullH;

  // Parametri di velocità (Modificabili)
  const isMobile = window.innerWidth <= 768;
  const speedPart1 = isMobile ? 1 : 1; // Più lento su mobile
  const speedPart2 = 1.4; // Rapidità seconda parte (più veloce)
  const mobileStartOffset = isMobile ? 150 : 0; // Inizia dopo 150px su mobile

  // --- FIRST SEGMENT ANIMATION ---
  let drawPercentage1;
  const effectiveScrollY = Math.max(0, scrollY - mobileStartOffset);
  const effectiveServiceTop = servicesSectionTop - mobileStartOffset;

  if (effectiveScrollY < effectiveServiceTop && effectiveServiceTop > 0) {
    // FASE 1: Prima di "Services" - anima primo segmento
    const progressInStage1 = Math.min((effectiveScrollY / effectiveServiceTop) * speedPart1, 1);
    drawPercentage1 = progressInStage1;
  } else {
    // Primo segmento completamente disegnato
    drawPercentage1 = 1;
  }

  const drawLength1 = pathLength1 * drawPercentage1;
  const offset1 = pathLength1 - drawLength1;

  pipeBase.style.strokeDashoffset = offset1;
  pipeMain.style.strokeDashoffset = offset1;
  pipeHighlight.style.strokeDashoffset = offset1;

  // --- SECOND SEGMENT ANIMATION ---
  let drawPercentage2 = 0;
  if (scrollY >= servicesSectionTop && pathLength2 > 0) {
    // FASE 2: Da "Services" in poi - anima secondo segmento
    const remainingScroll = fullH - servicesSectionTop;
    const progressInStage2 = remainingScroll > 0
      ? Math.min(((scrollY - servicesSectionTop) / remainingScroll) * speedPart2, 1)
      : 1;
    drawPercentage2 = progressInStage2;
  }

  const drawLength2 = pathLength2 * drawPercentage2;
  const offset2 = pathLength2 - drawLength2;

  pipeBase2.style.strokeDashoffset = offset2;
  pipeMain2.style.strokeDashoffset = offset2;
  pipeHighlight2.style.strokeDashoffset = offset2;

  // Animare l'apparizione delle flanges in base al progresso della pipe (primo segmento)
  const allFlanges = flangesContainer.querySelectorAll('.pipe-flange');
  allFlanges.forEach((flange, index) => {
    const flangeThreshold = (index / allFlanges.length) * 0.98;

    if (drawPercentage1 >= flangeThreshold) {
      const fadeRange = 0.02; // Apparizione molto rapida
      const fadeProgress = Math.min((drawPercentage1 - flangeThreshold) / fadeRange, 1);
      flange.style.opacity = fadeProgress;
      flange.style.transform = `scale(${0.5 + (fadeProgress * 0.5)})`;
    } else {
      flange.style.opacity = 0;
      flange.style.transform = 'scale(0.5)';
    }
  });

  // Animare le flanges del secondo segmento
  const allFlanges2 = flangesSecondContainer.querySelectorAll('.pipe-flange');
  allFlanges2.forEach((flange, index) => {
    const flangeThreshold = (index / allFlanges2.length) * 0.98;

    if (drawPercentage2 >= flangeThreshold) {
      const fadeRange = 0.02;
      const fadeProgress = Math.min((drawPercentage2 - flangeThreshold) / fadeRange, 1);
      flange.style.opacity = fadeProgress;
      flange.style.transform = `scale(${0.5 + (fadeProgress * 0.5)})`;
    } else {
      flange.style.opacity = 0;
      flange.style.transform = 'scale(0.5)';
    }
  });
}

// Optimization: Use requestAnimationFrame for smoother scroll
let isScrolling = false;

function onScroll() {
  if (!isScrolling) {
    window.requestAnimationFrame(() => {
      updateScroll();
      isScrolling = false;
    });
    isScrolling = true;
  }
}

window.addEventListener('scroll', onScroll, { passive: true });

// --- Review Slider Logic ---
const reviews = [
  {
    author: "Emmanuelle",
    text: "Intervention rapide et très efficace pour des toilettes bouchées. Plombier professionnel, ponctuel et sympa, travail propre et bien expliqué. Problème réglé en rien de temps, à un tarif correct. Je recommande sans hésiter ! Merci !!"
  },
  {
    author: "Océane",
    text: "Dépannage en urgence parfaitement réalisé. Intervention rapide, plombier professionnel et très efficace. Travail propre et soigné. Je recommande sans hésiter !"
  },
  {
    author: "Eliott",
    text: "Super expérience ! Intervention rapide, boulot propre et personne très sympa. Prix correct et aucun souci depuis. Franchement rien à dire, je recommande."
  },
  {
    author: "Emerick",
    text: "Excellent plombier ! Il est intervenu rapidement, a fait un travail de qualité et a été très sympathique. C'est rare de tomber sur quelqu'un d'aussi pro et agréable. Je recommande vivement."
  },
  {
    author: "Jonathan",
    text: "Intervention rapide dans le 75 et professionnelle pour la modification d’une vanne de gaz. J’ai obtenu un rendez-vous dès le lendemain, et le travail a été effectué avec sérieux et précision. Le plombier a pris le temps d’expliquer chaque étape et a laissé un chantier propre. Service fiable et prix raisonnable. Je recommande vivement !"
  }
];

let currentReviewIndex = 0;
const reviewAuthorEl = document.getElementById('review-author');
const reviewTextEl = document.getElementById('review-text');
const nextBtn = document.getElementById('next-review');

// Unified update function with smooth transition
function updateReviewDisplay(index) {
  if (!reviewAuthorEl || !reviewTextEl) return;

  // Fade out both elements
  reviewAuthorEl.style.opacity = '0';
  reviewTextEl.style.opacity = '0';

  setTimeout(() => {
    // Update content
    reviewAuthorEl.textContent = reviews[index].author;
    reviewTextEl.textContent = reviews[index].text;

    // Fade in both elements
    reviewAuthorEl.style.opacity = '1';
    reviewTextEl.style.opacity = '1';
  }, 400); // Wait for fade out
}

function nextReview() {
  currentReviewIndex = (currentReviewIndex + 1) % reviews.length;
  updateReviewDisplay(currentReviewIndex);
}

// Auto-Scroll Interval (10 seconds)
let autoScroll = setInterval(nextReview, 10000);

function resetInterval() {
  clearInterval(autoScroll);
  autoScroll = setInterval(nextReview, 10000);
}

// Initialize Slider
if (nextBtn) {
  // Set initial state
  reviewAuthorEl.textContent = reviews[0].author;
  reviewTextEl.textContent = reviews[0].text;

  nextBtn.addEventListener('click', () => {
    nextReview();
    resetInterval();
  });
}

// --- Custom Cursor Logic ---
function initCustomCursor() {
  const cursor = document.querySelector('.cursor');
  const cursorDot = document.querySelector('.cursor-dot');
  if (!cursor || !cursorDot) return;

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Dot tracks instantly for precision
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  function animate() {
    // Ring uses smooth follow (lerp) for the "liquid" effect
    const lerpSize = 0.15; // Slightly slower for more "liquid" feel
    cursorX += (mouseX - cursorX) * lerpSize;
    cursorY += (mouseY - cursorY) * lerpSize;

    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;

    requestAnimationFrame(animate);
  }
  animate();

  // Hover triggers
  function updateTriggers() {
    const triggers = document.querySelectorAll('.pillar-card, .btn-primary, .btn-secondary, .btn-urgent, a, button, .step, .hover-trigger');
    triggers.forEach(trigger => {
      trigger.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
      trigger.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
    });
  }

  updateTriggers();
  setTimeout(updateTriggers, 1000);
}

// Initialize on load

window.addEventListener('load', initCustomCursor);

// --- Dropdown Toggle Logic ---
document.addEventListener('click', (e) => {
  const toggle = e.target.closest('.dropdown-toggle');
  const dropdown = e.target.closest('.nav-item-dropdown');

  if (toggle) {
    e.preventDefault();
    e.stopPropagation();
    const parent = toggle.closest('.nav-item-dropdown');
    parent.classList.toggle('active');
    return;
  }

  // Close dropdown when clicking outside
  document.querySelectorAll('.nav-item-dropdown.active').forEach(el => {
    if (!dropdown || el !== dropdown) {
      el.classList.remove('active');
    }
  });
});

// --- Simple Image Gallery Slider ---
function initGallerySliders() {
  const sliders = document.querySelectorAll('.gallery-slider');

  sliders.forEach(slider => {
    const slides = slider.querySelectorAll('.gallery-slide');
    if (slides.length <= 1) return; // No arrows needed for single image
    let currentIndex = 0;

    const sliderId = slider.id;
    const prevBtn = document.querySelector(`.gallery-prev[data-slider="${sliderId}"]`);
    const nextBtn = document.querySelector(`.gallery-next[data-slider="${sliderId}"]`);

    function showSlide(index) {
      slides.forEach(s => s.classList.remove('active'));
      slides[index].classList.add('active');
      currentIndex = index;
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        showSlide((currentIndex - 1 + slides.length) % slides.length);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        showSlide((currentIndex + 1) % slides.length);
      });
    }
  });
}

window.addEventListener('load', initGallerySliders);
