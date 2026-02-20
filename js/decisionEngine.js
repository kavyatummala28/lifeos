const DecisionEngine = {
    /**
     * Calculate scores for all options based on criteria and weights
     * @param {Object} decision - { options, criteria, weights }
     * @returns {Object} - { scores, winner, healthScore }
     */
    calculate(decision) {
        const { options, criteria, weights } = decision;
        const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

        const results = options.map(option => {
            let score = 0;
            criteria.forEach(criterion => {
                const value = option.values[criterion.id] || 0;
                const weight = weights[criterion.id] || 0;
                score += (value * (weight / (totalWeight || 1)));
            });
            return {
                id: option.id,
                name: option.name,
                score: Math.round(score * 10) / 10 // Round to 1 decimal
            };
        });

        const winner = results.reduce((prev, current) => (prev.score > current.score) ? prev : current, results[0]);
        const healthScore = this.calculateHealth(decision);

        return {
            results,
            winner,
            healthScore
        };
    },

    /**
     * Calculate Decision Health (0-100)
     * Factors: criteria count, weight distribution, risk awareness
     */
    calculateHealth(decision) {
        let health = 0;

        // 1. Criteria Diversity (max 30 pts)
        const criteriaCount = decision.criteria.length;
        health += Math.min(criteriaCount * 6, 30);

        // 2. Weight Balance (max 30 pts)
        // High health if no single criterion has > 50% weight
        const weights = Object.values(decision.weights);
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        const maxWeight = Math.max(...weights);
        const weightRatio = maxWeight / (totalWeight || 1);

        if (weightRatio < 0.4) health += 30;
        else if (weightRatio < 0.6) health += 20;
        else health += 10;

        // 3. Emotional-Logical Alignment (max 40 pts)
        // This would normally come from user input comparison
        health += (decision.hasRiskAnalysis ? 20 : 0);
        health += (decision.options.length >= 2 ? 20 : 0);

        return Math.min(health, 100);
    }
};

export default DecisionEngine;
