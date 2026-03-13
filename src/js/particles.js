/**
 * Generates random particles using canvas
 */
export default class Particles {
  constructor() {
    // particle colors
    this.colors = [
      '255, 255, 255',
      '55, 99, 171',
      '29, 89, 119',
    ];
    // adds gradient to particles on true
    this.blurry = true;
    // adds white border
    this.border = false;
    // particle radius min/max
    this.minRadius = 3;
    this.maxRadius = 20;
    // particle opacity min/max
    this.minOpacity = 0.005;
    this.maxOpacity = 0.5;
    // particle speed min/max
    this.minSpeed = 0;
    this.maxSpeed = 0.1;
    // number of particles
    this.numParticles = 750;
    // required canvas variables
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.createParticles();
    this.animate();
  }

  /** Random number between min and max */
  _rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  /** Sets canvas size to fill the window */
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  /** Creates all particles with random attributes */
  createParticles() {
    for (let i = 0; i < this.numParticles; i++) {
      const color = this.colors[~~this._rand(0, this.colors.length)];
      const vy = this._rand(this.minSpeed, this.maxSpeed);

      this.particles[i] = {
        radius: 1,
        xPos: this._rand(0, this.canvas.width),
        yPos: this._rand(0, this.canvas.height),
        xVelocity: this._rand(this.minSpeed, this.maxSpeed),
        yVelocity: vy,
        color: `rgba(${color},${this._rand(this.minOpacity, this.maxOpacity)})`,
      };

      this.draw(i);
    }
  }

  /** Draws a single particle on canvas */
  draw(i) {
    const p = this.particles[i];
    const { ctx } = this;

    if (this.blurry) {
      const grd = ctx.createRadialGradient(
        p.xPos, p.yPos, p.radius,
        p.xPos, p.yPos, p.radius / 1.25,
      );
      grd.addColorStop(1.0, p.color);
      grd.addColorStop(0.0, 'rgba(34, 34, 34, 0)');
      ctx.fillStyle = grd;
    } else {
      ctx.fillStyle = p.color;
    }

    if (this.border) {
      ctx.strokeStyle = '#fff';
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(p.xPos, p.yPos, p.radius, 0, 2 * Math.PI, false);
    ctx.fill();
  }

  /** Animation loop using requestAnimationFrame */
  animate() {
    this.clearCanvas();

    for (let i = 0; i < this.numParticles; i++) {
      const p = this.particles[i];
      p.xPos += p.xVelocity;
      p.yPos -= p.yVelocity;

      // if particle goes off screen, reset it to the left or bottom edge
      if (p.xPos > this.canvas.width + p.radius || p.yPos < -p.radius) {
        this.resetParticle(i);
      } else {
        this.draw(i);
      }
    }

    requestAnimationFrame(() => this.animate());
  }

  /** Resets a particle that has gone off screen */
  resetParticle(i) {
    const p = this.particles[i];

    if (this._rand(0, 1) > 0.5) {
      // 50% chance particle comes from left side of window
      p.xPos = -p.radius;
      p.yPos = this._rand(0, this.canvas.height);
    } else {
      // ...or bottom of window
      p.xPos = this._rand(0, this.canvas.width);
      p.yPos = this.canvas.height + p.radius;
    }

    this.draw(i);
  }

  /** Clears canvas between animation frames */
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
