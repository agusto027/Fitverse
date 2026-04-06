import React, { useState } from 'react';
import { IoBarbell, IoFlameOutline, IoCheckmarkCircle } from 'react-icons/io5';
import Card from '../components/Card';
import Button from '../components/Button';
import styles from './WorkoutPlanner.module.css';

const WorkoutPlannerScreen = () => {
  const [goal, setGoal] = useState('fat-loss');
  const [progress, setProgress] = useState({
    'fat-loss': [false, false, false, false, false, false, false],
    'muscle-gain': [false, false, false, false, false, false, false]
  });

  const plans = {
    'fat-loss': {
      title: 'Fat Loss Program',
      subtitle: 'High-intensity workouts to maximize calorie burn',
      days: [
        { day: 'Monday', title: 'Full Body HIIT', items: ['Burpees x 10', 'Squats x 15', 'Push-ups x 12', 'Mountain Climbers x 20'], completed: false },
        { day: 'Tuesday', title: 'Cardio + Core', items: ['Jumping Jacks x 30', 'Plank 45 sec', 'Bicycle Crunches x 20', 'High Knees x 30'], completed: false },
        { day: 'Wednesday', title: 'Lower Body', items: ['Lunges x 12 each', 'Squats x 20', 'Calf Raises x 20', 'Wall Sit 30 sec'], completed: false },
        { day: 'Thursday', title: 'Rest', items: ['Light walking', 'Stretching 15 min'], completed: false },
        { day: 'Friday', title: 'Upper Body', items: ['Push-ups x 15', 'Tricep Dips x 12'], completed: false },
        { day: 'Saturday', title: 'Full Body Circuit', items: ['Squat Jumps x 12', 'Push-ups x 12', 'Burpees x 8', 'Plank 60sec'], completed: false },
        { day: 'Sunday', title: 'Active Recovery', items: ['Yoga 20 min', 'Light stretching', 'Walking 30 min'], completed: false }
      ]
    },
    'muscle-gain': {
      title: 'Muscle Gain Program',
      subtitle: 'Hypertrophy focused lifting for muscle growth',
      days: [
        { day: 'Monday', title: 'Push Day', items: ['Bench Press', 'Overhead Press', 'Incline DB Press', 'Tricep Extensions'], completed: false },
        { day: 'Tuesday', title: 'Pull Day', items: ['Pull-ups', 'Barbell Rows', 'Face Pulls', 'Bicep Curls'], completed: false },
        { day: 'Wednesday', title: 'Rest', items: ['Light walking', 'Stretching 15 min'], completed: false },
        { day: 'Thursday', title: 'Leg Day', items: ['Squats', 'Romanian Deadlifts', 'Leg Press', 'Calf Raises'], completed: false },
        { day: 'Friday', title: 'Upper Body', items: ['Incline Bench', 'Weighted Pull-ups', 'Lateral Raises'], completed: false },
        { day: 'Saturday', title: 'Rest', items: ['Active Recovery / Yoga'], completed: false },
        { day: 'Sunday', title: 'Core', items: ['Planks', 'Russian Twists', 'Ab Rollouts'], completed: false }
      ]
    }
  };

  const activePlan = plans[goal];
  const activeProgress = progress[goal];
  const completedCount = activeProgress.filter(Boolean).length;

  const toggleDay = (idx) => {
    setProgress(prev => {
      const newProgress = [...prev[goal]];
      newProgress[idx] = !newProgress[idx];
      return { ...prev, [goal]: newProgress };
    });
  };

  const resetProgress = () => {
    setProgress(prev => ({
      ...prev,
      [goal]: [false, false, false, false, false, false, false]
    }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.iconBadge}>
          <IoBarbell size={24} />
        </div>
        <div>
          <h1 className={styles.title}>Workout Planner</h1>
          <p className={styles.subtitle}>Your weekly training schedule</p>
        </div>
      </div>

      <div className={styles.goalSelection}>
        <Card 
          className={`${styles.goalCard} ${goal === 'fat-loss' ? styles.activeFatLoss : ''}`}
          onClick={() => setGoal('fat-loss')}
        >
          <IoFlameOutline size={28} className={styles.goalIcon} color={goal === 'fat-loss' ? 'var(--color-orange)' : 'var(--color-text-secondary)'} />
          <h3>Fat Loss</h3>
        </Card>
        <Card 
          className={`${styles.goalCard} ${goal === 'muscle-gain' ? styles.activeMuscleGain : ''}`}
          onClick={() => setGoal('muscle-gain')}
        >
          <IoBarbell size={28} className={styles.goalIcon} color={goal === 'muscle-gain' ? 'var(--color-purple)' : 'var(--color-text-secondary)'} />
          <h3>Muscle Gain</h3>
        </Card>
      </div>

      <div className={styles.planHeader}>
        <div>
          <h2 className={styles.planTitle}>{activePlan.title}</h2>
          <p className={styles.planSubtitle}>{activePlan.subtitle}</p>
        </div>
        <Button variant="outline" className={styles.resetBtn} onClick={resetProgress}>
          Reset Progress
        </Button>
      </div>

      <div className={styles.daysGrid}>
        {activePlan.days.map((day, idx) => {
          const isCompleted = activeProgress[idx];
          return (
            <Card 
              key={idx} 
              className={`${styles.dayCard} ${isCompleted ? styles.completedCard : ''}`}
              onClick={() => toggleDay(idx)}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
            >
              <div className={styles.dayHeader}>
                <span className={styles.dayName}>{day.day}</span>
                <IoCheckmarkCircle 
                  size={22} 
                  className={`${styles.checkIcon} ${isCompleted ? styles.checkActive : ''}`} 
                  color={isCompleted ? 'var(--color-primary)' : 'var(--color-border)'}
                />
              </div>
            
            <div className={styles.focusPill}>
              {day.title}
            </div>

            <ul className={styles.exerciseList} style={{ opacity: isCompleted ? 0.6 : 1 }}>
              {day.items.map((item, i) => (
                <li key={i}>
                  <span className={styles.dot} />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        )})}
      </div>

      <div className={styles.progressSection}>
        <div className={styles.progressLabels}>
          <span>Progress</span>
          <span>{completedCount}/{activePlan.days.length} days</span>
        </div>
        <div className={styles.progressBarBg}>
          <div 
            className={styles.progressBarFill} 
            style={{ width: `${(completedCount / activePlan.days.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlannerScreen;
