import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBackOutline } from 'react-icons/io5';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import styles from './Profile.module.css';
import { calculateBMI, getBMICategory, getBMIColor } from '../utils/bmiCalculator';

const ProfileScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    age: '',
    fitnessGoal: 'balance'
  });
  const [bmi, setBmi] = useState(null);
  const [bmiCategory, setBmiCategory] = useState('');
  const [saved, setSaved] = useState(false);

  const user = JSON.parse(localStorage.getItem('fitverse_user') || '{}');

  useEffect(() => {
    // Load saved profile data
    const profileData = localStorage.getItem('fitverse_profile');
    if (profileData) {
      const data = JSON.parse(profileData);
      setFormData(data);
      const calculatedBMI = calculateBMI(data.weight, data.height);
      setBmi(calculatedBMI);
      setBmiCategory(getBMICategory(calculatedBMI));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Recalculate BMI
    if (name === 'weight' || name === 'height') {
      const height = name === 'height' ? value : formData.height;
      const weight = name === 'weight' ? value : formData.weight;
      
      if (height && weight) {
        const calculatedBMI = calculateBMI(weight, height);
        setBmi(calculatedBMI);
        setBmiCategory(getBMICategory(calculatedBMI));
      }
    }
  };

  const handleSave = () => {
    if (!formData.height || !formData.weight || !formData.age) {
      alert('Please fill in all fields');
      return;
    }

    localStorage.setItem('fitverse_profile', JSON.stringify(formData));
    setSaved(true);

    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className={styles.container}>
      <button 
        className={styles.backBtn}
        onClick={() => navigate('/dashboard')}
      >
        <IoArrowBackOutline size={20} /> Back
      </button>

      <h1 className={styles.title}>Your Fitness Profile</h1>
      <p className={styles.subtitle}>Help us personalize your fitness journey</p>

      <div className={styles.content}>
        <Card className={styles.formCard}>
          <h2 className={styles.sectionTitle}>Physical Measurements</h2>
          
          <div className={styles.inputRow}>
            <Input
              label="Height (cm)"
              type="number"
              name="height"
              placeholder="170"
              value={formData.height}
              onChange={handleChange}
            />
            <Input
              label="Weight (kg)"
              type="number"
              name="weight"
              placeholder="70"
              value={formData.weight}
              onChange={handleChange}
            />
          </div>

          <Input
            label="Age"
            type="number"
            name="age"
            placeholder="25"
            value={formData.age}
            onChange={handleChange}
          />

          <div className={styles.goalSection}>
            <label className={styles.label}>Fitness Goal</label>
            <div className={styles.goalOptions}>
              {['muscle-gain', 'fat-loss', 'balance'].map(goal => (
                <button
                  key={goal}
                  className={`${styles.goalBtn} ${formData.fitnessGoal === goal ? styles.goalActive : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, fitnessGoal: goal }))}
                >
                  {goal === 'muscle-gain' ? '💪 Build Muscle' : goal === 'fat-loss' ? '🔥 Lose Weight' : '⚖️ Maintain'}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={handleSave}>Save Profile</Button>
        </Card>

        {bmi && (
          <Card className={styles.bmiCard}>
            <h2 className={styles.sectionTitle}>Your BMI</h2>
            
            <div 
              className={styles.bmiDisplay}
              style={{ borderColor: getBMIColor(bmi) }}
            >
              <div className={styles.bmiValue} style={{ color: getBMIColor(bmi) }}>
                {bmi}
              </div>
              <p className={styles.bmiLabel}>{bmiCategory}</p>
            </div>

            <div className={styles.bmiInfo}>
              <h3>BMI Ranges:</h3>
              <ul>
                <li><span style={{ color: '#3E8BFF' }}>●</span> Underweight: &lt; 18.5</li>
                <li><span style={{ color: '#4ACE71' }}>●</span> Normal: 18.5 - 24.9</li>
                <li><span style={{ color: '#FF7B00' }}>●</span> Overweight: 25 - 29.9</li>
                <li><span style={{ color: '#FF4D4D' }}>●</span> Obese: ≥ 30</li>
              </ul>
            </div>

            {saved && (
              <div className={styles.successMessage}>
                ✅ Profile saved! Redirecting to dashboard...
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProfileScreen;
