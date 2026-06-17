/**
 * Health Score Calculation Utility
 * 
 * Calculates a health score from 0–100 based on 4 categories,
 * each worth a maximum of 25 points.
 */

function calculateSleepScore(hours) {
  if (hours >= 7 && hours <= 9) return 25;
  if ((hours >= 6 && hours < 7) || (hours > 9 && hours <= 10)) return 15;
  return 5;
}

function calculateWaterScore(glasses) {
  if (glasses >= 8) return 25;
  if (glasses >= 5 && glasses <= 7) return 15;
  return 5;
}

function calculateExerciseScore(minutes) {
  if (minutes >= 30) return 25;
  if (minutes >= 10 && minutes <= 29) return 15;
  return 5;
}

function calculateScreenTimeScore(hours) {
  if (hours <= 4) return 25;
  if (hours >= 5 && hours <= 7) return 15;
  return 5;
}

function calculateHealthScore({ sleepHours, waterGlasses, exerciseMinutes, screenTimeHours }) {
  const sleepScore = calculateSleepScore(sleepHours);
  const waterScore = calculateWaterScore(waterGlasses);
  const exerciseScore = calculateExerciseScore(exerciseMinutes);
  const screenScore = calculateScreenTimeScore(screenTimeHours);

  return sleepScore + waterScore + exerciseScore + screenScore;
}

function getScoreCategory(score) {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Needs Improvement';
}

function getScoreCategoryColor(score) {
  if (score >= 80) return '#10b981'; // emerald
  if (score >= 60) return '#3b82f6'; // blue
  if (score >= 40) return '#f59e0b'; // amber
  return '#ef4444'; // red
}

module.exports = {
  calculateHealthScore,
  getScoreCategory,
  getScoreCategoryColor,
  calculateSleepScore,
  calculateWaterScore,
  calculateExerciseScore,
  calculateScreenTimeScore,
};
