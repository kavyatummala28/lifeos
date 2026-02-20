import State from './state.js';

const AI = {
    async callGemini(prompt) {
        if (!State.settings.apiKey) {
            throw new Error('Missing Gemini API Key. Please add it in settings.');
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${State.settings.apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        return data.candidates[0].content.parts[0].text;
    },

    /**
     * Suggest criteria based on decision description
     */
    async suggestCriteria(description) {
        const prompt = `Based on this decision description: "${description}", suggest 5 important criteria and their weights (1-10). 
        Format as JSON array of objects: [{"name": "Criterion Name", "weight": 8}]`;

        try {
            const result = await this.callGemini(prompt);
            return JSON.parse(result.substring(result.indexOf('['), result.lastIndexOf(']') + 1));
        } catch (e) {
            console.error('AI Error:', e);
            return null;
        }
    },

    /**
     * Complex Bias Detection
     */
    async detectBiases(text) {
        const prompt = `Analyze this decision reasoning text for cognitive biases: "${text}". 
        Return a JSON array: [{"name": "Bias Name", "description": "Short explanation", "severity": "High|Medium", "icon": "remix-icon-name"}]`;

        try {
            const result = await this.callGemini(prompt);
            return JSON.parse(result.substring(result.indexOf('['), result.lastIndexOf(']') + 1));
        } catch (e) {
            console.error('AI Error:', e);
            return null;
        }
    }
};

export default AI;
