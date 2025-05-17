const videoFiles = [
    'videos/1.mp4',
    'videos/2.mp4',
    'videos/3.mp4',
    'videos/4.mp4',
    'videos/5.mp4',
    'videos/6.mp4',
    'videos/7.mp4',
    'videos/8.mp4',
    'videos/9.mp4',
    'videos/10.mp4',
    'videos/11.mp4',
    'videos/12.mp4',
    'videos/13.mp4',
    'videos/14.mp4',
    'videos/15.mp4',
    'videos/16.mp4',
    'videos/17.mp4',
    
  ];

  const videoElement = document.getElementById('local-video');

  function selectRandomVideo() {
    const randomIndex = Math.floor(Math.random() * videoFiles.length);
    const selectedVideo = videoFiles[randomIndex];
    videoElement.src = selectedVideo;
    videoElement.play();
  }

  // Posiciona a janela aleatoriamente na tela
  function randomizeWindowPosition() {
    const maxX = window.screen.availWidth - window.outerWidth;
    const maxY = window.screen.availHeight - window.outerHeight;
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    window.moveTo(randomX, randomY);
  }

  window.onload = function() {
    selectRandomVideo();
    randomizeWindowPosition();
  };