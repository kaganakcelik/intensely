// Lightweight keyword-based emotion detection
// Maps emotions to colors based on the user's chart

const EMOTION_MAP = {
    // Red emotions
    love: { emotion: 'Love', color: '#e63946' },
    passion: { emotion: 'Passion', color: '#e63946' },
    excited: { emotion: 'Excitement', color: '#e63946' },
    exciting: { emotion: 'Excitement', color: '#e63946' },
    anger: { emotion: 'Anger', color: '#d00000' },
    angry: { emotion: 'Anger', color: '#d00000' },
    mad: { emotion: 'Anger', color: '#d00000' },
    furious: { emotion: 'Anger', color: '#d00000' },
    hate: { emotion: 'Anger', color: '#d00000' },

    // Yellow emotions
    happy: { emotion: 'Joy', color: '#ffbe0b' },
    joy: { emotion: 'Joy', color: '#ffbe0b' },
    joyful: { emotion: 'Joy', color: '#ffbe0b' },
    optimistic: { emotion: 'Optimism', color: '#ffbe0b' },
    great: { emotion: 'Joy', color: '#ffbe0b' },
    amazing: { emotion: 'Joy', color: '#ffbe0b' },
    wonderful: { emotion: 'Joy', color: '#ffbe0b' },
    fantastic: { emotion: 'Joy', color: '#ffbe0b' },
    awesome: { emotion: 'Joy', color: '#ffbe0b' },

    // Blue emotions
    calm: { emotion: 'Calm', color: '#4361ee' },
    relaxed: { emotion: 'Relaxation', color: '#4361ee' },
    peaceful: { emotion: 'Peace', color: '#4361ee' },
    relief: { emotion: 'Relief', color: '#4361ee' },
    relieved: { emotion: 'Relief', color: '#4361ee' },
    sad: { emotion: 'Sadness', color: '#3a86ff' },
    melancholy: { emotion: 'Melancholy', color: '#3a86ff' },
    blue: { emotion: 'Sadness', color: '#3a86ff' },

    // Green emotions
    peace: { emotion: 'Peace', color: '#2a9d8f' },
    comfort: { emotion: 'Comfort', color: '#2a9d8f' },
    comfortable: { emotion: 'Comfort', color: '#2a9d8f' },
    content: { emotion: 'Contentment', color: '#2a9d8f' },
    balanced: { emotion: 'Balance', color: '#2a9d8f' },
    okay: { emotion: 'Contentment', color: '#2a9d8f' },
    fine: { emotion: 'Contentment', color: '#2a9d8f' },
    good: { emotion: 'Contentment', color: '#2a9d8f' },

    // Orange emotions
    enthusiastic: { emotion: 'Enthusiasm', color: '#fb8500' },
    enthusiasm: { emotion: 'Enthusiasm', color: '#fb8500' },
    warm: { emotion: 'Warmth', color: '#fb8500' },
    warmth: { emotion: 'Warmth', color: '#fb8500' },
    energetic: { emotion: 'Energy', color: '#fb8500' },
    energy: { emotion: 'Energy', color: '#fb8500' },

    // Purple emotions
    proud: { emotion: 'Pride', color: '#7209b7' },
    pride: { emotion: 'Pride', color: '#7209b7' },
    powerful: { emotion: 'Power', color: '#7209b7' },
    power: { emotion: 'Power', color: '#7209b7' },

    // Black/Gray emotions
    fear: { emotion: 'Fear', color: '#6c757d' },
    afraid: { emotion: 'Fear', color: '#6c757d' },
    scared: { emotion: 'Fear', color: '#6c757d' },
    negative: { emotion: 'Negativity', color: '#495057' },
    bad: { emotion: 'Negativity', color: '#495057' },
    terrible: { emotion: 'Negativity', color: '#495057' },
    awful: { emotion: 'Negativity', color: '#495057' },
    depressed: { emotion: 'Sadness', color: '#495057' },

    // White emotions
    hope: { emotion: 'Hope', color: '#f8f9fa' },
    hopeful: { emotion: 'Hope', color: '#f8f9fa' },
};

export class EmotionController {
    constructor() {
        this.transcriptHistory = [];
        this.currentEmotion = null;
        this.currentColor = null;
    }

    // Add transcript with timestamp
    addTranscript(text) {
        const now = Date.now();
        this.transcriptHistory.push({ text, timestamp: now });

        // Keep only last 3 seconds of transcripts
        this.transcriptHistory = this.transcriptHistory.filter(
            entry => now - entry.timestamp < 3000
        );

        // Analyze combined text
        this.analyzeEmotion();
    }

    analyzeEmotion() {
        // Combine all recent transcripts
        const combinedText = this.transcriptHistory
            .map(entry => entry.text)
            .join(' ')
            .toLowerCase();

        if (!combinedText.trim()) {
            // No recent transcripts, clear emotion
            this.currentEmotion = null;
            this.currentColor = null;
            return;
        }

        // Find matching emotions
        const words = combinedText.split(/\s+/);
        let detectedEmotion = null;

        // Check each word against our emotion map (check from end for most recent)
        for (let i = words.length - 1; i >= 0; i--) {
            // Clean the word of punctuation
            const cleanWord = words[i].replace(/[^a-z]/g, '');
            if (EMOTION_MAP[cleanWord]) {
                detectedEmotion = EMOTION_MAP[cleanWord];
                break; // Take most recent match
            }
        }

        if (detectedEmotion) {
            this.currentEmotion = detectedEmotion.emotion;
            this.currentColor = detectedEmotion.color;
        } else {
            // No emotion keyword found in recent text
            this.currentEmotion = null;
            this.currentColor = null;
        }
    }

    getEmotion() {
        return {
            emotion: this.currentEmotion,
            color: this.currentColor
        };
    }

    clearHistory() {
        this.transcriptHistory = [];
    }
}
