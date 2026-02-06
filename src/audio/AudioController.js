export class AudioController {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.microphone = null;
        this.dataArray = null;
        this.isInitialized = false;
    }

    async init() {
        if (this.isInitialized) return;

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();

            // FFT Size determines the number of frequency bins
            // 2048 results in 1024 bins. We'll use a smaller number for broader bands if needed,
            // but 2048 gives good resolution.
            this.analyser.fftSize = 512;

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.microphone = this.audioContext.createMediaStreamSource(stream);
            this.microphone.connect(this.analyser);

            this.bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(this.bufferLength);
            this.timeDataArray = new Uint8Array(this.bufferLength);

            this.isInitialized = true;
            console.log('Audio initialized');
        } catch (error) {
            console.error('Error initializing audio:', error);
            throw error;
        }
    }

    getAudioData() {
        if (!this.isInitialized) return null;

        this.analyser.getByteFrequencyData(this.dataArray);
        this.analyser.getByteTimeDomainData(this.timeDataArray);

        // Calculate average volume (RMS-like) for radius scaling
        let sum = 0;
        for (let i = 0; i < this.bufferLength; i++) {
            sum += this.dataArray[i];
        }
        const volume = sum / this.bufferLength;
        const normalizedVolume = Math.min(1, volume / 128); // Normalize to 0-1 range, using 128 as a reasonable 'max' threshold for coloring

        return {
            frequencyData: this.dataArray,
            timeData: this.timeDataArray,
            volume: volume,
            intensity: normalizedVolume
        };
    }

    resume() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }
}
