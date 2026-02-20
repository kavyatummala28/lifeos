import State from './state.js';
import DecisionEngine from './decisionEngine.js';
import Charts from './charts.js';

const DecisionBuilder = {
    criteria: [
        { id: 'c1', name: 'Impact', weight: 8 },
        { id: 'c2', name: 'Effort', weight: 4 }
    ],
    options: [
        { id: 'o1', name: 'Option A', values: { 'c1': 5, 'c2': 5 } },
        { id: 'o2', name: 'Option B', values: { 'c1': 5, 'c2': 5 } }
    ],
    activeOptionId: 'o1',
    charts: {},

    init() {
        this.renderCriteria();
        this.renderOptions();
        this.updateScoring();
        this.bindEvents();
    },

    bindEvents() {
        document.getElementById('add-criterion-btn').addEventListener('click', () => this.addCriterion());
        document.getElementById('add-option-btn').addEventListener('click', () => this.addOption());
        document.getElementById('save-decision-btn').addEventListener('click', () => this.saveDecision());

        // Delegation for dynamic inputs
        document.getElementById('criteria-list').addEventListener('input', (e) => {
            const row = e.target.closest('.item-row');
            const id = row.dataset.id;
            if (e.target.classList.contains('crit-name')) {
                const crit = this.criteria.find(c => c.id === id);
                crit.name = e.target.value;
            }
            if (e.target.classList.contains('crit-weight')) {
                const crit = this.criteria.find(c => c.id === id);
                crit.weight = parseInt(e.target.value) || 0;
            }
            this.updateScoring();
        });

        document.getElementById('option-values').addEventListener('input', (e) => {
            if (e.target.type === 'range') {
                const critId = e.target.dataset.critId;
                const option = this.options.find(o => o.id === this.activeOptionId);
                option.values[critId] = parseInt(e.target.value);
                e.target.nextElementSibling.textContent = e.target.value;
                this.updateScoring();
            }
        });
    },

    addCriterion() {
        const id = 'c' + Date.now();
        this.criteria.push({ id, name: 'New Criterion', weight: 5 });
        this.options.forEach(opt => opt.values[id] = 5);
        this.renderCriteria();
        this.updateScoring();
    },

    addOption() {
        const id = 'o' + Date.now();
        const values = {};
        this.criteria.forEach(c => values[c.id] = 5);
        this.options.push({ id, name: 'Option ' + (this.options.length + 1), values });
        this.activeOptionId = id;
        this.renderOptions();
        this.updateScoring();
    },

    renderCriteria() {
        const container = document.getElementById('criteria-list');
        container.innerHTML = this.criteria.map(c => `
            <div class="item-row" data-id="${c.id}">
                <input type="text" class="input-glass crit-name" value="${c.name}">
                <input type="number" class="input-glass crit-weight" value="${c.weight}" min="1" max="10">
                <button class="btn btn-icon" onclick="this.closest('.item-row').remove()"><i class="ri-delete-bin-line"></i></button>
            </div>
        `).join('');
    },

    renderOptions() {
        const tabs = document.getElementById('options-tabs');
        tabs.innerHTML = this.options.map(o => `
            <button class="tab-btn ${o.id === this.activeOptionId ? 'active' : ''}" data-id="${o.id}">
                ${o.name}
            </button>
        `).join('');

        // Bind tab clicks
        tabs.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.activeOptionId = btn.dataset.id;
                this.renderOptions();
                this.renderActiveOptionValues();
            });
        });

        this.renderActiveOptionValues();
    },

    renderActiveOptionValues() {
        const container = document.getElementById('option-values');
        const option = this.options.find(o => o.id === this.activeOptionId);

        container.innerHTML = this.criteria.map(c => `
            <div class="value-control">
                <div class="label-row">
                    <span>${c.name}</span>
                    <span class="value-tag">${option.values[c.id] || 5}</span>
                </div>
                <input type="range" min="0" max="10" step="1" value="${option.values[c.id] || 5}" data-crit-id="${c.id}">
            </div>
        `).join('');
    },

    updateScoring() {
        const decision = {
            options: this.options,
            criteria: this.criteria,
            weights: this.criteria.reduce((acc, c) => ({ ...acc, [c.id]: c.weight }), {})
        };

        const results = DecisionEngine.calculate(decision);

        // Update UI
        const activeResult = results.results.find(r => r.id === this.activeOptionId);
        document.getElementById('current-score').textContent = activeResult.score;
        document.getElementById('winner-text').textContent = `Best Path: ${results.winner.name}`;

        // Update Charts
        this.updateCharts(decision, results);
    },

    updateCharts(decision, results) {
        const isDark = State.settings.theme === 'dark';

        // Radar Chart
        const radarLabels = this.criteria.map(c => c.name);
        const radarData = this.criteria.map(c => c.weight);

        if (this.charts.radar) this.charts.radar.destroy();
        const radarCtx = document.getElementById('radar-chart').getContext('2d');
        this.charts.radar = Charts.renderRadar(radarCtx, radarLabels, radarData, isDark);

        // Health Gauge
        const healthCanvas = document.getElementById('health-canvas');
        Charts.renderGauge(healthCanvas, results.healthScore, isDark);
    },

    saveDecision() {
        const title = document.getElementById('decision-title').value || 'Untitled Decision';
        const decision = {
            title,
            criteria: this.criteria,
            options: this.options,
            weights: this.criteria.reduce((acc, c) => ({ ...acc, [c.id]: c.weight }), {}),
            healthScore: DecisionEngine.calculate({
                options: this.options,
                criteria: this.criteria,
                weights: this.criteria.reduce((acc, c) => ({ ...acc, [c.id]: c.weight }), {})
            }).healthScore
        };

        State.addDecision(decision);
        window.location.href = 'index.html';
    }
};

document.addEventListener('DOMContentLoaded', () => DecisionBuilder.init());
