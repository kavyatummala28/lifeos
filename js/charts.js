const Charts = {
    colors: {
        primary: '#6366f1',
        accent: '#8b5cf6',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        text: {
            dark: '#f1f5f9',
            light: '#1e293b'
        }
    },

    getCommonOptions(isDark) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                r: {
                    grid: { color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
                    angleLines: { color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
                    pointLabels: { color: isDark ? '#f1f5f9' : '#1e293b' }
                }
            }
        };
    },

    /**
     * Render a Radar Chart for criteria comparison
     */
    renderRadar(ctx, labels, data, isDark) {
        return new Chart(ctx, {
            type: 'radar',
            data: {
                labels,
                datasets: [{
                    label: 'Weight/Importance',
                    data,
                    backgroundColor: 'rgba(99, 102, 241, 0.2)',
                    borderColor: this.colors.primary,
                    borderWidth: 2,
                    pointBackgroundColor: this.colors.primary
                }]
            },
            options: this.getCommonOptions(isDark)
        });
    },

    /**
     * Render a Bar Chart for option scores
     */
    renderBar(ctx, labels, data, isDark) {
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Overall Score',
                    data,
                    backgroundColor: labels.map((_, i) => i === 0 ? this.colors.primary : 'rgba(99, 102, 241, 0.5)'),
                    borderRadius: 8
                }]
            },
            options: {
                ...this.getCommonOptions(isDark),
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: { display: false },
                        ticks: { color: isDark ? '#f1f5f9' : '#1e293b' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: isDark ? '#f1f5f9' : '#1e293b' }
                    }
                }
            }
        });
    },

    /**
     * Render a simple Gauge using Canvas (without Chart.js for simplicity if needed)
     */
    renderGauge(canvas, score, isDark) {
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height - 20;
        const radius = 80;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background arc
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, Math.PI, 0);
        ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 15;
        ctx.stroke();

        // Score arc
        const endAngle = Math.PI + (Math.PI * (score / 100));
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, Math.PI, endAngle);

        let color = this.colors.danger;
        if (score > 70) color = this.colors.success;
        else if (score > 40) color = this.colors.warning;

        ctx.strokeStyle = color;
        ctx.lineWidth = 15;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Text
        ctx.font = 'bold 24px Inter';
        ctx.fillStyle = isDark ? '#f1f5f9' : '#1e293b';
        ctx.textAlign = 'center';
        ctx.fillText(`${Math.round(score)}%`, centerX, centerY - 10);
    }
};

export default Charts;
