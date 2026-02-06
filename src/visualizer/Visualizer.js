export class Visualizer {
    constructor(canvas, audioController) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.audioController = audioController;
        this.isPlaying = false;
        this.emotionText = null;

        // Color transition properties
        this.targetColor = { r: 173, g: 216, b: 230 }; // Start with light blue
        this.currentColor = { r: 173, g: 216, b: 230 };
        this.lerpSpeed = 0.05; // How fast to transition (0-1)

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        // Base radius relative to screen size
        this.baseRadius = Math.min(this.canvas.width, this.canvas.height) * 0.15;
    }

    start() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.animate();
    }

    stop() {
        this.isPlaying = false;
    }

    setEmotion(emotion, color) {
        this.emotionText = emotion; // Will be null when no emotion detected

        // Parse hex color to RGB only if valid color provided
        if (color && color.startsWith('#')) {
            const hex = color.slice(1);
            this.targetColor = {
                r: parseInt(hex.substring(0, 2), 16),
                g: parseInt(hex.substring(2, 4), 16),
                b: parseInt(hex.substring(4, 6), 16)
            };
        }
        // When emotion is null, the animate loop will use intensity-based color
    }

    animate() {
        if (!this.isPlaying) return;

        requestAnimationFrame(() => this.animate());

        // Clear canvas with slight fade effect for trails? 
        // Or pure clear for crispness. PRD says "minimalist", so pure clear or very subtle trail.
        // Let's go with pure clear for now to avoid messiness.
        this.ctx.fillStyle = '#050505';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const data = this.audioController.getAudioData();
        if (!data) return;

        const { frequencyData, volume, intensity } = data;
        const bufferLength = frequencyData.length;

        // S-curve (smoothstep) for intensity-to-color mapping
        // This creates a low slope at the start and end, with a fast transition in the middle.
        const t = intensity * intensity * (3 - 2 * intensity);

        // Calculate intensity-based color (Light Blue to Dark Red)
        const intensityR = Math.round(173 + (139 - 173) * t);
        const intensityG = Math.round(216 + (0 - 216) * t);
        const intensityB = Math.round(230 + (0 - 230) * t);

        // If no emotion is set, use intensity color as target
        if (!this.emotionText) {
            this.targetColor = { r: intensityR, g: intensityG, b: intensityB };
        }

        // Smoothly lerp current color toward target color
        this.currentColor.r += (this.targetColor.r - this.currentColor.r) * this.lerpSpeed;
        this.currentColor.g += (this.targetColor.g - this.currentColor.g) * this.lerpSpeed;
        this.currentColor.b += (this.targetColor.b - this.currentColor.b) * this.lerpSpeed;

        const color = `rgb(${Math.round(this.currentColor.r)}, ${Math.round(this.currentColor.g)}, ${Math.round(this.currentColor.b)})`;

        // Dynamic radius based on volume
        const radius = this.baseRadius + (volume * 1.5);

        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.closePath();

        // Draw emotion text in the center
        if (this.emotionText) {
            this.ctx.fillStyle = '#050505';
            this.ctx.font = `bold ${Math.round(radius * 0.25)}px Inter, system-ui, sans-serif`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(this.emotionText, this.centerX, this.centerY);
        }

        // Draw radial bars
        const bars = 64; // Number of bars to draw
        const step = Math.floor(bufferLength / bars);

        this.ctx.save();
        this.ctx.translate(this.centerX, this.centerY);

        for (let i = 0; i < bars; i++) {
            // Get frequency value for this bar
            const dataIndex = i * step;
            const value = frequencyData[dataIndex];

            // Map value to bar height
            const barHeight = Math.max(0, (value / 255) * (this.baseRadius * 1.5));

            this.ctx.rotate((Math.PI * 2) / bars);

            // Draw bar
            this.ctx.beginPath();
            // Start just outside the circle
            this.ctx.moveTo(0, radius + 5);
            this.ctx.lineTo(0, radius + 5 + barHeight);
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = 2;
            this.ctx.lineCap = 'round';
            this.ctx.stroke();
        }

        this.ctx.restore();
    }
}
