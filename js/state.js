const CONFIG = {
    STORAGE_KEY: 'lifeos_data',
    SETTINGS_KEY: 'lifeos_settings'
};

const State = {
    data: {
        decisions: [],
        stats: {
            totalDecisions: 0,
            averageHealth: 0,
            aiInsightsGenerated: 0
        }
    },

    settings: {
        apiKey: 'AIzaSyAuuV0siHClOYGK3wYuKGby5aLeXgNM55Y',
        theme: 'dark'
    },

    init() {
        this.load();
        this.applyTheme();
    },

    load() {
        const savedData = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (savedData) {
            this.data = JSON.parse(savedData);
        }

        const savedSettings = localStorage.getItem(CONFIG.SETTINGS_KEY);
        if (savedSettings) {
            this.settings = JSON.parse(savedSettings);
        }
    },

    save() {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(this.data));
    },

    saveSettings() {
        localStorage.setItem(CONFIG.SETTINGS_KEY, JSON.stringify(this.settings));
    },

    setApiKey(key) {
        this.settings.apiKey = key;
        this.saveSettings();
    },

    toggleTheme() {
        this.settings.theme = this.settings.theme === 'dark' ? 'light' : 'dark';
        this.saveSettings();
        this.applyTheme();
    },

    applyTheme() {
        if (this.settings.theme === 'light') {
            document.body.classList.add('light-mode');
        } else {
            document.body.classList.remove('light-mode');
        }
    },

    addDecision(decision) {
        this.data.decisions.unshift({
            ...decision,
            id: Date.now().toString(),
            timestamp: new Date().toISOString()
        });
        this.updateStats();
        this.save();
    },

    deleteDecision(id) {
        this.data.decisions = this.data.decisions.filter(d => d.id !== id);
        this.updateStats();
        this.save();
    },

    updateStats() {
        this.data.stats.totalDecisions = this.data.decisions.length;
        if (this.data.decisions.length > 0) {
            const sumHealth = this.data.decisions.reduce((acc, d) => acc + (d.healthScore || 0), 0);
            this.data.stats.averageHealth = Math.round(sumHealth / this.data.decisions.length);
        } else {
            this.data.stats.averageHealth = 0;
        }
    }
};

State.init();
export default State;
