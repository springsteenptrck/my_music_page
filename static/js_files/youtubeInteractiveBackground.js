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
    this.waveCount = 10000000000;
    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
    this.maxRadius = Math.sqrt(this.canvas.width ** 2 + this.canvas.height ** 2) / 2;
    this.simulatedAudioLevel = 0;

    this.initializeCanvas();
    this.addEventListeners();
  }

  initializeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
    this.maxRadius = Math.sqrt(this.canvas.width ** 2 + this.canvas.height ** 2) / 2;
    window.addEventListener('resize', () => this.initializeCanvas());
  }

  addEventListeners() {
    window.addEventListener('videoStateChange', (event) => {
      if (event.detail.state === 'playing') {
        this.isPlaying = true;
        this.animateBackground();
      } else if (event.detail.state === 'paused') {
        this.isPlaying = false;
      }
    });
  }

  getSimulatedAudioLevel() {
    // Simulate audio level changes
    this.simulatedAudioLevel += (Math.random() - 0.5) * 0.1;
    this.simulatedAudioLevel = Math.max(0, Math.min(1, this.simulatedAudioLevel));
    return this.simulatedAudioLevel;
  }

  animateBackground() {
    const draw = () => {
      if (!this.isPlaying) return;

      requestAnimationFrame(draw);

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      const audioLevel = this.getSimulatedAudioLevel();

      // Create new waves
      if (this.waves.length < this.waveCount) {
        this.waves.push({
          radius: 0,
          alpha: 0.5,
          speed: 2 + audioLevel * 3  // Speed varies with simulated audio level
        });
      }

      // Draw and update waves
      this.waves.forEach((wave, index) => {
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, wave.radius, 0, Math.PI * 2);
        this.ctx.strokeStyle = `rgba(0, 255, 255, ${wave.alpha * audioLevel})`;  // Alpha varies with simulated audio level
        this.ctx.lineWidth = 3 + audioLevel * 2;  // Line width varies with simulated audio level
        this.ctx.stroke();

        wave.radius += wave.speed;
        wave.alpha -= 0.002;

        // Remove waves that have expanded beyond the max radius
        if (wave.radius > this.maxRadius) {
          this.waves.splice(index, 1);
        }
      });
    };

    draw();
  }
}