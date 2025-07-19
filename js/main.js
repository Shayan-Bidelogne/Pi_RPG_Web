document.addEventListener('DOMContentLoaded', () => {
  const playBtn = document.getElementById('playBtn');
  const closeBtn = document.getElementById('closeBtn');
  const gameModal = document.getElementById('gameModal');

  // Force modal fermée au départ
  gameModal.style.display = 'none';

  playBtn.addEventListener('click', () => {
    gameModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  });

  closeBtn.addEventListener('click', () => {
    gameModal.style.display = 'none';
    document.body.style.overflow = '';
  });
});
