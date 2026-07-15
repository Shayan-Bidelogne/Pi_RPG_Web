document.addEventListener('DOMContentLoaded', () => {
  initGameModal();
  initBannerAlligatorOrbit();
});

function initGameModal() {
  const playBtn = document.getElementById('playBtn');
  const closeBtn = document.getElementById('closeBtn');
  const gameModal = document.getElementById('gameModal');

  if (!playBtn || !closeBtn || !gameModal) {
    return;
  }

  // Keep the modal hidden until a page explicitly opens it.
  gameModal.style.display = 'none';

  playBtn.addEventListener('click', () => {
    gameModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  });

  closeBtn.addEventListener('click', () => {
    gameModal.style.display = 'none';
    document.body.style.overflow = '';
  });
}

function initBannerAlligatorOrbit() {
  const banner = document.querySelector('.learn-more-banner');
  const orbit = banner?.querySelector('[data-banner-orbit]');
  const alligator = orbit?.querySelector('[data-banner-alligator]');

  if (!banner || !orbit || !alligator) {
    return;
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const orbitSpeed = 112;
  const spriteScale = 2.25;
  const spriteSheets = {
    right: {
      src: 'Assets/Alligator/Mob_Alligator_walking_right.png',
      frameWidth: 32,
      frameHeight: 16,
      frameCount: 4,
    },
    left: {
      src: 'Assets/Alligator/Mob_Alligator_walking_left.png',
      frameWidth: 32,
      frameHeight: 16,
      frameCount: 4,
    },
    front: {
      src: 'Assets/Alligator/Mob_Alligator_walking_front.png',
      frameWidth: 16,
      frameHeight: 16,
      frameCount: 4,
    },
    back: {
      src: 'Assets/Alligator/Mob_Alligator_walking_back.png',
      frameWidth: 16,
      frameHeight: 16,
      frameCount: 4,
    },
  };

  let lastTimestamp = 0;
  let segmentIndex = 0;
  let frameClock = 0;
  let x = 0;
  let y = 0;
  let direction = 'right';

  const positionAlligator = () => {
    const sheet = spriteSheets[direction] || spriteSheets.front;
    const frameIndex = Math.floor(frameClock / 0.1) % sheet.frameCount;
    const displayWidth = sheet.frameWidth * spriteScale;
    const displayHeight = sheet.frameHeight * spriteScale;

    alligator.style.backgroundImage = `url('${sheet.src}')`;
    alligator.style.backgroundPosition = `${-frameIndex * sheet.frameWidth}px 0`;
    alligator.style.width = `${sheet.frameWidth}px`;
    alligator.style.height = `${sheet.frameHeight}px`;
    alligator.style.transform = `translate3d(${Math.round(x - displayWidth / 2)}px, ${Math.round(y - displayHeight / 2)}px, 0) scale(${spriteScale})`;
  };

  const getTrackBounds = () => {
    const bannerRect = banner.getBoundingClientRect();
    const orbitRect = orbit.getBoundingClientRect();
    const horizontalGap = Math.max(2, Math.round(bannerRect.width * 0.005));
    const verticalGap = Math.max(2, Math.round(bannerRect.height * 0.03));
    const trackHalfWidth = (32 * spriteScale) / 2;
    const trackHalfHeight = (16 * spriteScale) / 2;

    const left = bannerRect.left - orbitRect.left + horizontalGap + trackHalfWidth;
    const top = bannerRect.top - orbitRect.top + verticalGap + trackHalfHeight;
    const right = bannerRect.right - orbitRect.left - horizontalGap - trackHalfWidth;
    const bottom = bannerRect.bottom - orbitRect.top - verticalGap - trackHalfHeight;

    return {
      left: Math.min(left, right),
      top: Math.min(top, bottom),
      right: Math.max(left, right),
      bottom: Math.max(top, bottom),
    };
  };

  const getWaypoints = (bounds) => ([
    { x: bounds.right, y: bounds.top, direction: 'right' },
    { x: bounds.right, y: bounds.bottom, direction: 'front' },
    { x: bounds.left, y: bounds.bottom, direction: 'left' },
    { x: bounds.left, y: bounds.top, direction: 'back' },
  ]);

  const resetAlligator = () => {
    const bounds = getTrackBounds();
    x = bounds.left;
    y = bounds.top;
    segmentIndex = 0;
    lastTimestamp = 0;
    frameClock = 0;
    direction = 'right';
    positionAlligator();
  };

  const tick = (timestamp) => {
    const bounds = getTrackBounds();
    const waypoints = getWaypoints(bounds);

    if (reducedMotion.matches) {
      resetAlligator();
      return;
    }

    if (!lastTimestamp) {
      lastTimestamp = timestamp;
    }

    const deltaSeconds = Math.min(0.05, (timestamp - lastTimestamp) / 1000);
    lastTimestamp = timestamp;

    const target = waypoints[segmentIndex];
    direction = target.direction;

    frameClock += deltaSeconds;
    const dx = target.x - x;
    const dy = target.y - y;
    const distance = Math.hypot(dx, dy);
    const step = orbitSpeed * deltaSeconds;

    if (distance <= step || distance === 0) {
      x = target.x;
      y = target.y;
      segmentIndex = (segmentIndex + 1) % waypoints.length;
      frameClock = 0;
    } else {
      x += (dx / distance) * step;
      y += (dy / distance) * step;
    }

    positionAlligator();
    window.requestAnimationFrame(tick);
  };

  resetAlligator();
  window.requestAnimationFrame(tick);
}
