import State from './state.js';

const Timeline = {
    init() {
        this.renderTimeline();
    },

    renderTimeline() {
        const container = document.getElementById('timeline-list');
        const decisions = State.data.decisions;

        if (decisions.length === 0) return;

        container.innerHTML = decisions.map((d, i) => `
            <div class="timeline-item animate-in" style="animation-delay: ${i * 0.1}s">
                <span class="item-date">${new Date(d.timestamp).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <div class="timeline-content glass-panel">
                    <div class="decision-card" style="border: none; padding: 0;">
                        <div class="card-main">
                            <h4>${d.title}</h4>
                            <p>${d.options.length} Options considered • Health: ${d.healthScore}%</p>
                        </div>
                        <div class="card-meta">
                             <div class="health-mini">
                                <div class="progress-bar">
                                    <div class="progress" style="width: ${d.healthScore}%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }
};

document.addEventListener('DOMContentLoaded', () => Timeline.init());
