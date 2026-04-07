import React, { useState, useEffect } from 'react';
import { 
  IoRestaurant, 
  IoTrendingDownOutline, 
  IoDiscOutline,
  IoFlame,
  IoFastFood,
  IoLeaf,
  IoWater,
  IoScaleOutline
} from 'react-icons/io5';
import Card from '../components/Card';
import Button from '../components/Button';
import styles from './DietPlanner.module.css';
import { calculateBMI, getBMICategory, getRecommendations } from '../utils/bmiCalculator';

const DietPlannerScreen = () => {
  const [goal, setGoal] = useState('fat-loss');
  const [activeTab, setActiveTab] = useState('Mon');
  const [nutritionData, setNutritionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [bmi, setBmi] = useState(null);
  const [recommendation, setRecommendation] = useState(null);

  // Load user profile on mount
  useEffect(() => {
    const profileData = localStorage.getItem('fitverse_profile');
    if (profileData) {
      const data = JSON.parse(profileData);
      setProfile(data);
      const calculatedBMI = calculateBMI(data.weight, data.height);
      setBmi(calculatedBMI);
      const rec = getRecommendations(calculatedBMI, data.fitnessGoal);
      setRecommendation(rec);
      // Pre-select diet goal based on BMI recommendations
      setGoal(rec.diet);
    }
  }, []);

  const tabs = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const fetchDietPlan = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_AI_ENGINE_URL}/api/diet/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: goal, gender: 'Male' }) // In a real app, gender comes from User profile
      });
      const data = await res.json();
      setNutritionData(data);
    } catch (err) {
      console.error('Failed to fetch diet plan', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDietPlan();
  }, [goal]);

  const dayData = nutritionData ? nutritionData[activeTab] : null;
  const meals = dayData ? dayData.meals : [];
  const dailyTargets = dayData ? dayData.daily_targets : { calories: '--', protein: '--', carbs: '--', fat: '--' };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.iconBadge}>
          <IoRestaurant size={24} />
        </div>
        <div>
          <h1 className={styles.title}>Diet Planner</h1>
          <p className={styles.subtitle}>7-day personalized meal plans</p>
        </div>
      </div>

      {profile && bmi && recommendation && (
        <Card className={styles.profileInfoCard}>
          <div className={styles.profileGrid}>
            <div className={styles.profileItem}>
              <span className={styles.label}>BMI</span>
              <span className={styles.value} style={{ color: `${recommendation.diet === 'muscle-gain' ? '#3b82f6' : recommendation.diet === 'fat-loss' ? '#f97316' : '#10b981'}` }}>
                {bmi}
              </span>
            </div>
            <div className={styles.profileItem}>
              <span className={styles.label}>Age</span>
              <span className={styles.value}>{profile.age}</span>
            </div>
            <div className={styles.profileItem}>
              <span className={styles.label}>Height</span>
              <span className={styles.value}>{profile.height}cm</span>
            </div>
            <div className={styles.profileItem}>
              <span className={styles.label}>Weight</span>
              <span className={styles.value}>{profile.weight}kg</span>
            </div>
            <div className={styles.profileItem}>
              <span className={styles.label}>Daily Target</span>
              <span className={styles.value} style={{ fontSize: '14px' }}>{recommendation.dailyCalories} cal</span>
            </div>
          </div>
          <p className={styles.profileAdvice}>{recommendation.advice}</p>
        </Card>
      )}

      <Button variant="outline" className={styles.regenBtn} onClick={fetchDietPlan} disabled={loading}>
        {loading ? '↻ Loading...' : '↻ Regenerate Plan'}
      </Button>

      <div className={styles.goalSelection}>
        <Card 
          className={`${styles.goalCard} ${goal === 'fat-loss' ? styles.activeFatLoss : ''}`}
          onClick={() => setGoal('fat-loss')}
        >
          <div className={styles.goalContent}>
             <div className={`${styles.goalIconBox} ${styles.greenBg}`}>
               <IoTrendingDownOutline size={24} color="#fff" />
             </div>
             <div className={styles.goalText}>
               <h3>Fat Loss</h3>
               <p>Calorie deficit with high protein</p>
             </div>
          </div>
          {goal === 'fat-loss' && <span className={styles.selectedBadge}>Selected</span>}
        </Card>

        <Card 
          className={`${styles.goalCard} ${goal === 'muscle-gain' ? styles.activeMuscleGain : ''}`}
          onClick={() => setGoal('muscle-gain')}
        >
          <div className={styles.goalContent}>
             <div className={`${styles.goalIconBox} ${styles.blueBg}`}>
               <IoDiscOutline size={24} color="#fff" />
             </div>
             <div className={styles.goalText}>
               <h3>Muscle Gain</h3>
               <p>Calorie surplus for growth</p>
             </div>
          </div>
          {goal === 'muscle-gain' && <span className={styles.selectedBadgeBlue}>Selected</span>}
        </Card>

        <Card 
          className={`${styles.goalCard} ${goal === 'balance' ? styles.activeBalance : ''}`}
          onClick={() => setGoal('balance')}
        >
          <div className={styles.goalContent}>
             <div className={`${styles.goalIconBox} ${styles.greenBg}`}>
               <IoScaleOutline size={24} color="#fff" />
             </div>
             <div className={styles.goalText}>
               <h3>Maintain</h3>
               <p>Balanced nutrition and fitness</p>
             </div>
          </div>
          {goal === 'balance' && <span className={styles.selectedBadgeGreen}>Selected</span>}
        </Card>
      </div>

      <div className={styles.statsSection}>
        <h2 className={styles.sectionTitle}>Weekly Average</h2>
        <p className={styles.sectionSubtitle}>Your daily nutritional targets</p>
        
        <div className={styles.statsGrid}>
          <div className={styles.macroStat}>
            <IoFlame size={20} color="var(--color-orange)" />
            <div className={styles.macroInfo}>
              <span className={styles.macroValue}>{dailyTargets.calories}</span>
              <span className={styles.macroLabel}>Calories</span>
            </div>
          </div>
          <div className={styles.macroStat}>
            <IoFastFood size={20} color="var(--color-red)" />
            <div className={styles.macroInfo}>
              <span className={styles.macroValue}>{dailyTargets.protein}g</span>
              <span className={styles.macroLabel}>Protein</span>
            </div>
          </div>
          <div className={styles.macroStat}>
            <IoLeaf size={20} color="#E0A96D" />
            <div className={styles.macroInfo}>
              <span className={styles.macroValue}>{dailyTargets.carbs}g</span>
              <span className={styles.macroLabel}>Carbs</span>
            </div>
          </div>
          <div className={styles.macroStat}>
            <IoWater size={20} color="var(--color-blue)" />
            <div className={styles.macroInfo}>
              <span className={styles.macroValue}>{dailyTargets.fat}g</span>
              <span className={styles.macroLabel}>Fat</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.daysScroll}>
        {tabs.map(tab => (
          <button 
            key={tab} 
            className={`${styles.dayTab} ${activeTab === tab ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className={styles.mealsList}>
        {meals.map((meal, idx) => {
          let iconColor = '#FF9800'; // default breakfast
          if (meal.type === 'Lunch') iconColor = '#00BCD4';
          if (meal.type === 'Dinner') iconColor = '#2196F3';
          if (meal.type === 'Snacks') iconColor = '#E91E63';

          return (
            <Card key={idx} className={styles.mealCard}>
              <div className={styles.mealHeader}>
                <div className={styles.mealIconCircle} style={{ backgroundColor: iconColor }}>
                  {meal.type === 'Breakfast' ? <IoFastFood size={16} /> : meal.type === 'Lunch' ? <IoLeaf size={16} /> : meal.type === 'Dinner' ? <IoRestaurant size={16} /> : <IoFlame size={16} />}
                </div>
                <span className={styles.mealType}>{meal.type}</span>
              </div>
              
              {meal.name && <div className={styles.mealName}>{meal.name}</div>}
              {meal.desc && <p className={styles.mealDesc}>{meal.desc}</p>}
              
              {meal.items && (
                <div style={{marginTop: '8px'}}>
                  {meal.items.map((item, i) => (
                    <div key={i} className={styles.snackItemBox}>
                       <div className={styles.snackRow}>
                          <span className={styles.snackTitle}>{item.split(' with ')[0] || item}</span>
                          <span className={styles.snackCal}>200 cal</span>
                       </div>
                       <span className={styles.snackDesc}>{item}</span>
                    </div>
                  ))}
                </div>
              )}

              {!meal.items && (
                <div className={styles.macroPills}>
                  <span className={styles.macroPill}><IoFlame color="var(--color-orange)" size={14}/> {meal.cals} cal</span>
                  <span className={styles.macroPill}><span style={{color: 'var(--color-red)'}}>🥩</span> {meal.p}g</span>
                  <span className={styles.macroPill}><span style={{color: '#E0A96D'}}>🌾</span> {meal.c}g</span>
                  <span className={styles.macroPill}><IoWater color="var(--color-blue)" size={14}/> {meal.f}g</span>
                </div>
              )}
            </Card>
          );
        })}

        <Card className={styles.totalsCard}>
          <h3>{activeTab} Totals</h3>
          <p>{dailyTargets.calories} calories | {dailyTargets.protein}g protein | {dailyTargets.carbs}g carbs | {dailyTargets.fat}g fat</p>
        </Card>
      </div>
    </div>
  );
};

export default DietPlannerScreen;
