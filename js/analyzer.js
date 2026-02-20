import State from './state.js';

const Analyzer = {
    init() {
        this.bindEvents();
    },

    bindEvents() {
        const analyzeBtn = document.getElementById('analyze-btn');
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => this.performAnalysis());
        }
    },

    async performAnalysis() {
        const text = document.getElementById('reasoning-input').value;
        if (!text.trim()) return;

        const btn = document.getElementById('analyze-btn');
        btn.disabled = true;
        btn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Analyzing...';

        // Fake AI Analysis if no API key, or actual API call
        // For now, let's implement the logic to check for API key
        if (!State.settings.apiKey) {
            this.showLocalAnalysis(text);
        } else {
            // Placeholder for AI integration
            // await AI.detectBiases(text);
            this.showLocalAnalysis(text);
        }

        btn.disabled = false;
        btn.innerHTML = '<i class="ri-search-eye-line"></i> Analyze Reasoning';
        document.getElementById('results-area').classList.add('active');
    },

    showLocalAnalysis(text) {
        const biasList = document.getElementById('bias-list');
        const results = this.mockDetectBiases(text);

        biasList.innerHTML = results.map(bias => `
            <div class="bias-card glass-panel">
                <div class="bias-icon" style="background: ${bias.color}20; color: ${bias.color}">
                    <i class="ri-${bias.icon}"></i>
                </div>
                <div class="bias-info">
                    <h4>${bias.name}</h4>
                    <p>${bias.description}</p>
                </div>
                <span class="bias-severity ${bias.severity === 'High' ? 'severity-high' : 'severity-med'}">
                    ${bias.severity} Match
                </span>
            </div>
        `).join('');
    },

    mockDetectBiases(text) {
        const lowerText = text.toLowerCase();
        const detected = [];

        if (lowerText.includes('afraid') || lowerText.includes('fear') || lowerText.includes('loss')) {
            detected.push({
                name: 'Loss Aversion',
                description: 'The tendency to prefer avoiding losses to acquiring equivalent gains.',
                icon: 'contrast-drop-line',
                color: '#ef4444',
                severity: 'High'
            });
        }

        if (lowerText.includes('everyone') || lowerText.includes('they say')) {
            detected.push({
                name: 'Bandwagon Effect',
                description: 'Probability of one person adopting a belief based on the number of people who hold that belief.',
                icon: 'group-line',
                color: '#f59e0b',
                severity: 'Medium'
            });
        }

        if (lowerText.includes('already') || lowerText.includes('spent') || lowerText.includes('time on')) {
            detected.push({
                name: 'Sunk Cost Fallacy',
                description: 'Continuing an endeavor as a result of previously invested resources.',
                icon: 'history-line',
                color: '#8b5cf6',
                severity: 'High'
            });
        }

        if (detected.length === 0) {
            detected.push({
                name: 'Logical Clarity',
                description: 'No common cognitive biases were detected in this reasoning snippet.',
                icon: 'checkbox-circle-line',
                color: '#10b981',
                severity: 'Low'
            });
        }

        return detected;
    }
};

document.addEventListener('DOMContentLoaded', () => Analyzer.init());
