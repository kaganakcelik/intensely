export class EmotionController {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

        this.emotionToColor = {
            'Love': '#ff0000', // Red
            'Anger': '#ff0000', // Red
            'Energy': '#ff0000', // Red
            'Joy': '#ffff00', // Yellow
            'Happiness': '#ffff00', // Yellow
            'Optimism': '#ffff00', // Yellow
            'Calmness': '#0000ff', // Blue
            'Relaxation': '#0000ff', // Blue
            'Sadness': '#0000ff', // Blue (Melancholy)
            'Peace': '#00ff00', // Green
            'Comfort': '#00ff00', // Green
            'Contentment': '#00ff00', // Green
            'Enthusiasm': '#ffa500', // Orange
            'Warmth': '#ffa500', // Orange
            'Pride': '#800080', // Purple
            'Power': '#800080', // Purple
            'Fear': '#800080', // Purple
            'Negativity': '#444444', // Black/Gray
            'Hope': '#ffffff', // White
            'Relief': '#ffffff' // White
        };
    }

    async analyzeEmotion(text) {
        if (!this.apiKey) return null;

        const prompt = `Analyze the following text and return ONLY one word representing the primary emotion from this list: Love, Anger, Energy, Joy, Happiness, Optimism, Calmness, Relaxation, Sadness, Peace, Comfort, Contentment, Enthusiasm, Warmth, Pride, Power, Fear, Negativity, Hope, Relief.

Text: "${text}"`;

        try {
            const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                })
            });

            const data = await response.json();
            const emotion = data.candidates[0].content.parts[0].text.trim();
            console.log('Detected Emotion:', emotion);

            return {
                label: emotion,
                color: this.emotionToColor[emotion] || null
            };
        } catch (error) {
            console.error('Emotion analysis failed:', error);
            return null;
        }
    }
}
