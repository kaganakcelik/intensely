import './style.css'
import { AudioController } from './audio/AudioController.js'
import { Visualizer } from './visualizer/Visualizer.js'
import { TranscriptionController } from './audio/TranscriptionController.js'
import { EmotionController } from './audio/EmotionController.js'

document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('start-btn');
  const overlay = document.getElementById('overlay');
  const canvas = document.getElementById('visualizer');
  const subtitles = document.getElementById('subtitles');

  // Instantiate classes
  const audioController = new AudioController();
  const visualizer = new Visualizer(canvas, audioController);
  const emotionController = new EmotionController();

  let clearSubtitleTimeout;
  const transcriptionController = new TranscriptionController((text, isFinal) => {
    subtitles.textContent = text;

    // Feed transcript to emotion controller
    emotionController.addTranscript(text);

    // Get current emotion and update visualizer
    const { emotion, color } = emotionController.getEmotion();
    visualizer.setEmotion(emotion, color);

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
