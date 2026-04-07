// BMI Calculator Utility Functions

export const calculateBMI = (weight, height) => {
  // weight in kg, height in cm
  if (!weight || !height) return null;
  const heightInMeters = height / 100;
  return (weight / (heightInMeters * heightInMeters)).toFixed(1);
};

export const getBMICategory = (bmi) => {
  if (!bmi) return 'Unknown';
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal Weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

export const getBMIColor = (bmi) => {
  if (!bmi) return '#888888';
  if (bmi < 18.5) return '#3E8BFF'; // Blue
  if (bmi < 25) return '#4ACE71'; // Green
  if (bmi < 30) return '#FF7B00'; // Orange
  return '#FF4D4D'; // Red
};

export const getRecommendations = (bmi, fitnessGoal = 'balance') => {
  const category = getBMICategory(bmi);
  
  const recommendations = {
    'Underweight': {
      diet: 'muscle-gain',
      workoutIntensity: 'high',
      advice: 'Focus on high-calorie, protein-rich meals. Aim for weight gain through muscle building.',
      dailyCalories: 2500,
    },
    'Normal Weight': {
      diet: 'balance',
      workoutIntensity: 'moderate',
      advice: 'Maintain your current weight with balanced nutrition and regular exercise.',
      dailyCalories: 2000,
    },
    'Overweight': {
      diet: 'fat-loss',
      workoutIntensity: 'high',
      advice: 'Create a caloric deficit with cardio and strength training. Increase water intake.',
      dailyCalories: 1800,
    },
    'Obese': {
      diet: 'fat-loss',
      workoutIntensity: 'moderate',
      advice: 'Start with low-impact cardio, strength training, and strict calorie tracking.',
      dailyCalories: 1600,
    }
  };
  
  return recommendations[category];
};
