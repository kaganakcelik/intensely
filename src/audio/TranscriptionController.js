export class TranscriptionController {
    constructor(onTranscript) {
        this.recognition = null;
        this.isListening = false;
        this.onTranscript = onTranscript;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US';

            this.recognition.onresult = (event) => {
                let transcript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    transcript += event.results[i][0].transcript;
                }
                this.onTranscript(transcript, event.results[event.results.length - 1].isFinal);
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
            };
        } else {
            console.error('Web Speech API not supported in this browser.');
        }
    }

    start() {
        if (this.recognition && !this.isListening) {
            try {
                this.recognition.start();
                this.isListening = true;
                console.log('Transcription started');
            } catch (e) {
                console.error('Failed to start recognition:', e);
            }
        }
    }

    stop() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
            console.log('Transcription stopped');
        }
    }
}
