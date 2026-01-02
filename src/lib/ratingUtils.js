/**
 * Calculates a weighted average rating based on user answers.
 * Formula: Sum(score * weight) / Sum(weights)
 */
export const calculateFinalScore = (answers, questions) => {
    if (!questions || questions.length === 0) return 0;

    const totalScore = questions.reduce((acc, curr) => {
        // Default to a middle-ground score (3) if for some reason an answer is missing
        const score = answers[curr.id] || 3;
        return acc + (score * curr.weight);
    }, 0);

    const totalWeight = questions.reduce((acc, curr) => acc + curr.weight, 0);

    // Calculate, then round to the nearest 0.5 for a clean "star" rating
    const rawResult = totalScore / totalWeight;
    return Math.round(rawResult * 2) / 2;
};