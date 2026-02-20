import State from './state.js';

const Simulator = {
    vars: {
        salary: 50,
        growth: 50,
        risk: 20,
        effort: 60
    },
    chart: null,

    init() {
        this.bindEvents();
        this.updateSimulation();
    },

    bindEvents() {
        document.querySelectorAll('.sim-slider').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const varName = e.target.dataset.var;
                this.vars[varName] = parseInt(e.target.value);
                e.target.previousElementSibling.querySelector('.val').textContent = e.target.value + '%';
                this.updateSimulation();
            });
        });
    },

    updateSimulation() {
        // Simple prediction algorithm
        const score = (this.vars.salary * 0.4) + (this.vars.growth * 0.3) - (this.vars.risk * 0.2) + (this.vars.effort * 0.1);
        const normalizedScore = Math.max(0, Math.min(100, Math.round(score)));

        document.getElementById('proj-score').textContent = normalizedScore;

        const volatility = this.vars.risk > 60 ? 'High' : (this.vars.risk > 30 ? 'Medium' : 'Low');
        const volEl = document.getElementById('proj-vol');
        volEl.textContent = volatility;
        volEl.style.color = volatility === 'High' ? 'var(--danger)' : (volatility === 'Medium' ? 'var(--warning)' : 'var(--success)');

        this.renderChart(normalizedScore);
    },

    renderChart(currentScore) {
        const ctx = document.getElementById('projection-chart').getContext('2d');
        const isDark = State.settings.theme === 'dark';

        // Generate trend points
        const labels = ['Current', '+1 Year', '+3 Years', '+5 Years'];
        const data = [
            currentScore,
            currentScore * (1 + (this.vars.growth / 200) - (this.vars.risk / 400)),
            currentScore * (1 + (this.vars.growth / 100) - (this.vars.risk / 200)),
            currentScore * (1 + (this.vars.growth / 50) - (this.vars.risk / 100))
        ].map(v => Math.max(0, Math.min(100, Math.round(v))));

        if (this.chart) this.chart.destroy();

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Projected Utility',
                    data,
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3,
                    pointBackgroundColor: '#6366f1'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
                        ticks: { color: isDark ? '#f1f5f9' : '#1e293b' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: isDark ? '#f1f5f9' : '#1e293b' }
                    }
                }
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => Simulator.init());
