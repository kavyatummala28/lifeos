import State from './state.js';

const Dashboard = {
    init() {
        this.updateStats();
        this.renderDecisions();
    },

    updateStats() {
        document.getElementById('total-decisions').textContent = State.data.stats.totalDecisions;
        document.getElementById('avg-health').textContent = State.data.stats.averageHealth + '%';
        document.getElementById('ai-insights').textContent = State.data.stats.aiInsightsGenerated;

        const alignmentEl = document.getElementById('alignment');
        if (State.data.stats.averageHealth > 75) alignmentEl.textContent = 'High';
        else if (State.data.stats.averageHealth > 40) alignmentEl.textContent = 'Moderate';
        else alignmentEl.textContent = 'Low';
    },

    renderDecisions() {
        const container = document.getElementById('decisions-list');
        const decisions = State.data.decisions.slice(0, 5); // Show last 5

        if (decisions.length === 0) return;

        container.innerHTML = decisions.map(d => `
            <div class="decision-card glass-panel animate-in">
                <div class="card-main">
                    <h4>${d.title}</h4>
                    <p>${new Date(d.timestamp).toLocaleDateString()} • ${d.options.length} Options</p>
                </div>
                <div class="card-meta">
                    <div class="health-mini">
                        <span class="label">Health</span>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${d.healthScore}%"></div>
                        </div>
                    </div>
                    <button class="btn btn-icon btn-sm delete-decision" data-id="${d.id}">
                        <i class="ri-delete-bin-line"></i>
                    </button>
                </div>
            </div>
        `).join('');

        // Bind deletes
        container.querySelectorAll('.delete-decision').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                State.deleteDecision(btn.dataset.id);
                this.init();
            });
        });
    }
};

// Add styles for the decision cards dynamically if needed, 
// but I'll add them to dashboard.css in a separate step or now.
document.addEventListener('DOMContentLoaded', () => Dashboard.init());
