import './style.css'
import { AudioController } from './audio/AudioController.js'
import { Visualizer } from './visualizer/Visualizer.js'

document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('start-btn');
  const overlay = document.getElementById('overlay');
  const canvas = document.getElementById('visualizer');

  // Instantiate classes
  const audioController = new AudioController();
  const visualizer = new Visualizer(canvas, audioController);

  startBtn.addEventListener('click', async () => {
    try {
      startBtn.textContent = "Connecting...";
      startBtn.disabled = true;

      await audioController.init();

      // Fade out overlay
      overlay.classList.add('hidden');

      // Start visualization
      visualizer.start();

    } catch (error) {
      console.error('Initialization failed:', error);
      startBtn.textContent = "Access Denied / Error";
      startBtn.disabled = false;
      alert("Microphone access is required for this experience. Please allow access and try again.");
    }
  });

  // Handle resume on click if context gets suspended (extra safety)
  document.addEventListener('click', () => {
    audioController.resume();
  });
});
