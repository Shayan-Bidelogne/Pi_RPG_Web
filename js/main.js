document.addEventListener('DOMContentLoaded', () => {
  initGameModal();
  initHeroTerrain();
  initHeroWalker();
  initBannerAlligatorOrbit();
});

const HERO_MAP = {
  width: 20,
  height: 20,
  innerLeft: 2,
  innerTop: 2,
  innerRight: 17,
  innerBottom: 17,
};

const HERO_TMX = {
  width: 20,
  height: 20,
  tileWidth: 16,
  tileHeight: 16,
  tilesetColumns: 24,
  layer1: [
    [2, 2, 51], [3, 2, 75], [4, 2, 75], [5, 2, 75], [6, 2, 75], [7, 2, 75], [8, 2, 75], [9, 2, 75], [10, 2, 75], [11, 2, 75], [12, 2, 75], [13, 2, 75], [14, 2, 75], [15, 2, 75], [16, 2, 75], [17, 2, 53],
    [2, 3, 52], [17, 3, 100],
    [2, 4, 52], [17, 4, 100],
    [2, 5, 52], [17, 5, 100],
    [2, 6, 52], [17, 6, 100],
    [2, 7, 52], [17, 7, 100],
    [2, 8, 52], [17, 8, 100],
    [2, 9, 52], [17, 9, 100],
    [2, 10, 52], [17, 10, 100],
    [2, 11, 52], [17, 11, 100],
    [2, 12, 52], [17, 12, 100],
    [2, 13, 52], [17, 13, 100],
    [2, 14, 52], [17, 14, 100],
    [2, 15, 52], [17, 15, 100],
    [2, 16, 52], [17, 16, 100],
    [2, 17, 99], [3, 17, 75], [4, 17, 75], [5, 17, 75], [6, 17, 75], [7, 17, 75], [8, 17, 75], [9, 17, 75], [10, 17, 75], [11, 17, 75], [12, 17, 75], [13, 17, 75], [14, 17, 75], [15, 17, 75], [16, 17, 75], [17, 17, 101],
  ],
  layer2: [
    [18, 1, 94], [19, 1, 95],
    [18, 2, 118], [19, 2, 119],
    [18, 3, 142], [19, 3, 143],
    [6, 4, 34], [7, 4, 35],
    [5, 5, 34], [6, 5, 37], [7, 5, 38], [8, 5, 35],
    [5, 6, 58], [6, 6, 61], [7, 6, 62], [8, 6, 59],
    [6, 7, 58], [7, 7, 59],
    [14, 14, 34], [15, 14, 35],
    [14, 15, 58], [15, 15, 59],
    [18, 16, 34], [19, 16, 35],
    [18, 17, 58], [19, 17, 59],
    [15, 18, 34], [16, 18, 35], [17, 18, 34], [18, 18, 35], [19, 18, 34],
    [15, 19, 58], [16, 19, 59], [17, 19, 58], [18, 19, 59], [19, 19, 58],
  ],
};

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

function initHeroTerrain() {
  const runway = document.querySelector('[data-hero-walkway]');
  const canvas = runway?.querySelector('[data-hero-terrain]');

  if (!runway || !canvas) {
    return;
  }

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return;
  }

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const tileset = new Image();
  tileset.src = 'Assets/Tileset.png';

  const drawTile = (gid, dx, dy, dw, dh) => {
    if (!gid) {
      return;
    }
    const tileIndex = gid - 1;
    const sx = (tileIndex % HERO_TMX.tilesetColumns) * HERO_TMX.tileWidth;
    const sy = Math.floor(tileIndex / HERO_TMX.tilesetColumns) * HERO_TMX.tileHeight;
    ctx.drawImage(tileset, sx, sy, HERO_TMX.tileWidth, HERO_TMX.tileHeight, dx, dy, dw, dh);
  };

  const render = () => {
    const rect = runway.getBoundingClientRect();
    const dpr = clamp(window.devicePixelRatio || 1, 1, 2);
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.imageSmoothingEnabled = false;

    const tileW = width / HERO_TMX.width;
    const tileH = height / HERO_TMX.height;

    for (let y = 0; y < HERO_TMX.height; y += 1) {
      for (let x = 0; x < HERO_TMX.width; x += 1) {
        const dx = Math.round(x * tileW);
        const dy = Math.round(y * tileH);
        const dw = Math.max(1, Math.round((x + 1) * tileW) - dx);
        const dh = Math.max(1, Math.round((y + 1) * tileH) - dy);

        const layer1 = HERO_TMX.layer1.find((tile) => tile[0] === x && tile[1] === y);
        drawTile(layer1 ? layer1[2] : 26, dx, dy, dw, dh);
      }
    }

    HERO_TMX.layer2.forEach(([x, y, gid]) => {
      const dx = Math.round(x * tileW);
      const dy = Math.round(y * tileH);
      const dw = Math.max(1, Math.round((x + 1) * tileW) - dx);
      const dh = Math.max(1, Math.round((y + 1) * tileH) - dy);
      drawTile(gid, dx, dy, dw, dh);
    });
  };

  tileset.addEventListener('load', render, { once: true });

  const resizeObserver = window.ResizeObserver ? new ResizeObserver(render) : null;
  resizeObserver?.observe(runway);
  window.addEventListener('resize', render, { passive: true });
  render();
}

function initHeroWalker() {
  const runway = document.querySelector('[data-hero-walkway]');
  const sprite = runway?.querySelector('[data-hero-walker]');

  if (!runway || !sprite) {
    return;
  }

  const sheetSrc = 'Assets/NPC_Player.png';
  const frameMap = {
    right: { row: 2, mirrored: false },
    down: { row: 0, mirrored: false },
    left: { row: 1, mirrored: false },
    up: { row: 3, mirrored: false },
  };

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const spriteSize = 64;
  const speed = 140;
  const frameDuration = 0.11;

  let lastTimestamp = 0;
  let frameClock = 0;
  let previousDirection = '';
  let segmentIndex = 0;
  let x = 0;
  let y = 0;

  const setSpritePosition = () => {
    sprite.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
  };

  const setSpriteFrame = (direction, frameIndex) => {
    const frame = frameMap[direction] || frameMap.down;
    const offset = frameIndex % 4;
    sprite.style.backgroundImage = `url('${sheetSrc}')`;
    sprite.style.backgroundPosition = `${-offset * 64}px ${-frame.row * 64}px`;
    sprite.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)${frame.mirrored ? ' scaleX(-1)' : ''}`;
  };

  const getBounds = () => {
    const rect = runway.getBoundingClientRect();
    const horizontalInset = Math.max(16, Math.round(rect.width * 0.08));
    const verticalInset = Math.max(14, Math.round(rect.height * 0.19));
    const left = horizontalInset;
    const right = Math.max(left, rect.width - horizontalInset - spriteSize);
    const top = verticalInset;
    const bottom = Math.max(top, rect.height - verticalInset - spriteSize);

    return { left, right, top, bottom };
  };

  const getTargets = (bounds) => ([
    { x: bounds.right, y: bounds.top, direction: 'right' },
    { x: bounds.right, y: bounds.bottom, direction: 'down' },
    { x: bounds.left, y: bounds.bottom, direction: 'left' },
    { x: bounds.left, y: bounds.top, direction: 'up' },
  ]);

  const resetSprite = () => {
    const bounds = getBounds();
    x = bounds.left;
    y = bounds.top;
    segmentIndex = 0;
    frameClock = 0;
    previousDirection = '';
    sprite.style.backgroundImage = `url('${sheetSrc}')`;
    sprite.style.backgroundPosition = '0px 0px';
    setSpritePosition();
  };

  const tick = (timestamp) => {
    const bounds = getBounds();
    const targets = getTargets(bounds);

    if (reducedMotion.matches) {
      setSpriteFrame('down', 0);
      setSpritePosition();
      return;
    }

    if (!lastTimestamp) {
      lastTimestamp = timestamp;
    }

    const deltaSeconds = Math.min(0.05, (timestamp - lastTimestamp) / 1000);
    lastTimestamp = timestamp;

    const target = targets[segmentIndex];
    const dx = target.x - x;
    const dy = target.y - y;
    const distance = Math.hypot(dx, dy);
    const step = speed * deltaSeconds;

    if (target.direction !== previousDirection) {
      frameClock = 0;
      previousDirection = target.direction;
    }

    if (distance <= step || distance === 0) {
      x = target.x;
      y = target.y;
      segmentIndex = (segmentIndex + 1) % targets.length;
    } else {
      x += (dx / distance) * step;
      y += (dy / distance) * step;
    }

    frameClock += deltaSeconds;
    const frameIndex = Math.floor(frameClock / frameDuration) % 4;
    setSpriteFrame(target.direction, frameIndex);

    window.requestAnimationFrame(tick);
  };

  resetSprite();
  window.requestAnimationFrame(tick);
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
