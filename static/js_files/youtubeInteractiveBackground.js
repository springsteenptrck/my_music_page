class YouTubeInteractiveBackground {
  constructor(canvasElementId) {
    this.canvas = document.getElementById(canvasElementId);
    if (!this.canvas) {
      console.error('Canvas element not found:', canvasElementId);
      return;
    }

    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) {
      console.error('Unable to get 2D context from canvas');
      return;
    }

    this.isPlaying = false;
    this.waves = [];
    this.waveCount = 100;
    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
    this.maxRadius = Math.sqrt(this.canvas.width ** 2 + this.canvas.height ** 2) / 2;
    this.simulatedAudioLevel = 0;
    this.animationFrameId = null;

    this.initializeCanvas();
    this.addEventListeners();
  }

  initializeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
    this.maxRadius = Math.sqrt(this.canvas.width ** 2 + this.canvas.height ** 2) / 2;
  }

  addEventListeners() {
    window.addEventListener('resize', () => this.initializeCanvas());
    window.addEventListener('backgroundStateChange', (event) => this.handleStateChange(event));
  }

  handleStateChange(event) {
    console.log('Background state change event:', event.detail.state);
    if (event.detail.state === 'playing') {
      this.start();
    } else {
      this.stop();
    }
  }

  start() {
    console.log('Starting animation');
    this.stop();  // Ensure we stop any existing animation before starting
    this.isPlaying = true;
    this.waves = [];
    this.animateBackground();
  }
  stop() {
    console.log('Stopping animation');
    this.isPlaying = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  getSimulatedAudioLevel() {
    this.simulatedAudioLevel += (Math.random() - 0.5) * 0.1;
    this.simulatedAudioLevel = Math.max(0, Math.min(1, this.simulatedAudioLevel));
    return this.simulatedAudioLevel;
  }


  animateBackground() {
    const draw = () => {
      if (!this.isPlaying) {
        console.log('Animation stopped');
        return;
      }

      this.animationFrameId = requestAnimationFrame(draw);

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      const audioLevel = this.getSimulatedAudioLevel();

      // Create new waves
      if (this.waves.length < this.waveCount) {
        this.waves.push({
          radius: 0,
          alpha: 0.5,
          speed: 2 + audioLevel * 3
        });
      }

      // Draw and update waves
      this.waves = this.waves.filter(wave => {
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, wave.radius, 0, Math.PI * 2);
        this.ctx.strokeStyle = `rgba(0, 255, 255, ${wave.alpha * audioLevel})`;
        this.ctx.lineWidth = 3 + audioLevel * 2;
        this.ctx.stroke();

        wave.radius += wave.speed;
        wave.alpha -= 0.002;

        return wave.radius <= this.maxRadius;
      });
    };

    draw();
  }
}