import './style.css'
import { AudioController } from './audio/AudioController.js'
import { Visualizer } from './visualizer/Visualizer.js'
import { TranscriptionController } from './audio/TranscriptionController.js'

document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('start-btn');
  const overlay = document.getElementById('overlay');
  const canvas = document.getElementById('visualizer');
  const subtitles = document.getElementById('subtitles');

  // Instantiate classes
  const audioController = new AudioController();
  const visualizer = new Visualizer(canvas, audioController);

  let clearSubtitleTimeout;
  const transcriptionController = new TranscriptionController((text, isFinal) => {
    subtitles.textContent = text;

    if (isFinal) {
      clearTimeout(clearSubtitleTimeout);
      clearSubtitleTimeout = setTimeout(() => {
        subtitles.textContent = '';
      }, 3000);
    }
  });

  startBtn.addEventListener('click', async () => {
    try {
      startBtn.textContent = "Connecting...";
      startBtn.disabled = true;

      await audioController.init();
      transcriptionController.start();

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
