import React, { useState, useEffect, useRef } from 'react';
import { IoCamera, IoCameraOutline } from 'react-icons/io5';
import Card from '../components/Card';
import Button from '../components/Button';
import styles from './ExerciseDetection.module.css';
import { calculateBMI } from '../utils/bmiCalculator';

const ExerciseDetectionScreen = () => {
  const [activeExercise, setActiveExercise] = useState('squat');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState('Tracking...');
  const [socketConnected, setSocketConnected] = useState(false);
  const [profile, setProfile] = useState(null);
  const [recommendedExercises, setRecommendedExercises] = useState([]);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const wsRef = useRef(null);
  const cameraRef = useRef(null);
  const poseRef = useRef(null);

  const allExercises = {
    beginner: [
      { id: 'squat', name: 'Squat', desc: 'Lower body strength', difficulty: 'Beginner' },
      { id: 'plank', name: 'Plank', desc: 'Core stability exercise', difficulty: 'Beginner' },
      { id: 'marching', name: 'Marching in Place', desc: 'Cardio warm-up', difficulty: 'Beginner' },
      { id: 'shouldershrug', name: 'Shoulder Shrugs', desc: 'Shoulder and trap work', difficulty: 'Beginner' },
      { id: 'calfraisestanding', name: 'Calf Raises (Standing)', desc: 'Lower leg strength', difficulty: 'Beginner' }
    ],
    intermediate: [
      { id: 'squat', name: 'Squat', desc: 'Lower body strength', difficulty: 'Beginner' },
      { id: 'pushup', name: 'Push-up', desc: 'Upper body and core', difficulty: 'Intermediate' },
      { id: 'plank', name: 'Plank', desc: 'Core stability exercise', difficulty: 'Beginner' },
      { id: 'lunge', name: 'Lunge', desc: 'Lower body and balance', difficulty: 'Intermediate' },
      { id: 'jumpingjacks', name: 'Jumping Jacks', desc: 'Full body cardio', difficulty: 'Intermediate' },
      { id: 'bicepurl', name: 'Bicep Curl', desc: 'Upper arm strength', difficulty: 'Intermediate' },
      { id: 'tricepsdips', name: 'Triceps Dips', desc: 'Arm and chest strength', difficulty: 'Intermediate' },
      { id: 'lateralraise', name: 'Lateral Raise', desc: 'Shoulder strength', difficulty: 'Intermediate' },
      { id: 'overheadpress', name: 'Overhead Press', desc: 'Shoulder and core strength', difficulty: 'Intermediate' },
      { id: 'shouldershrug', name: 'Shoulder Shrugs', desc: 'Shoulder and trap work', difficulty: 'Beginner' },
      { id: 'calfraisestanding', name: 'Calf Raises (Standing)', desc: 'Lower leg strength', difficulty: 'Beginner' },
      { id: 'bentoverrow', name: 'Bent Over Row', desc: 'Back and bicep strength', difficulty: 'Intermediate' }
    ],
    advanced: [
      { id: 'squat', name: 'Squat', desc: 'Lower body strength', difficulty: 'Beginner' },
      { id: 'pushup', name: 'Push-up', desc: 'Upper body and core', difficulty: 'Intermediate' },
      { id: 'plank', name: 'Plank', desc: 'Core stability', difficulty: 'Beginner' },
      { id: 'lunge', name: 'Lunge', desc: 'Lower body and balance', difficulty: 'Intermediate' },
      { id: 'jumpingjacks', name: 'Jumping Jacks', desc: 'Full body cardio', difficulty: 'Intermediate' },
      { id: 'burpee', name: 'Burpee', desc: 'Full body HIIT', difficulty: 'Advanced' },
      { id: 'mountainclimber', name: 'Mountain Climber', desc: 'Core and cardio', difficulty: 'Advanced' },
      { id: 'bicepurl', name: 'Bicep Curl', desc: 'Upper arm strength', difficulty: 'Intermediate' },
      { id: 'tricepsdips', name: 'Triceps Dips', desc: 'Arm and chest strength', difficulty: 'Intermediate' },
      { id: 'lateralraise', name: 'Lateral Raise', desc: 'Shoulder strength', difficulty: 'Intermediate' },
      { id: 'overheadpress', name: 'Overhead Press', desc: 'Shoulder and core strength', difficulty: 'Intermediate' },
      { id: 'bentoverrow', name: 'Bent Over Row', desc: 'Back and bicep strength', difficulty: 'Intermediate' },
      { id: 'tricepextension', name: 'Tricep Extension', desc: 'Isolation tricep work', difficulty: 'Advanced' },
      { id: 'pullupsapproach', name: 'Pull-up Alternative', desc: 'Upper back strength', difficulty: 'Advanced' },
      { id: 'shoulderpress', name: 'Shoulder Press', desc: 'Full shoulder work', difficulty: 'Advanced' }
    ]
  };

  // Load profile and determine difficulty level
  useEffect(() => {
    const profileData = localStorage.getItem('fitverse_profile');
    if (profileData) {
      const data = JSON.parse(profileData);
      setProfile(data);
      
      // Determine difficulty based on BMI and age
      const bmi = calculateBMI(data.weight, data.height);
      let difficulty = 'beginner';
      
      if (bmi < 25 && data.age < 40) {
        difficulty = 'advanced';
      } else if (bmi < 30 && data.age < 50) {
        difficulty = 'intermediate';
      } else {
        difficulty = 'beginner';
      }
      
      setRecommendedExercises(allExercises[difficulty]);
      setActiveExercise(allExercises[difficulty][0].id);
    } else {
      setRecommendedExercises(allExercises.intermediate);
    }
  }, []);

  // Initialize WebSocket connected to FastAPI AI Engine
  useEffect(() => {
    const ws = new WebSocket(`${import.meta.env.VITE_AI_ENGINE_URL.replace('http', 'ws')}/ws/pose`);
    
    ws.onopen = () => setSocketConnected(true);
    ws.onclose = () => setSocketConnected(false);
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.rep_count !== undefined) {
          setRepCount(data.rep_count);
        }
        if (data.message) {
          setFeedbackMsg(data.message);
        }
      } catch (e) {
        console.error("WS Parse Error", e);
      }
    };
    
    wsRef.current = ws;

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  useEffect(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ command: 'reset' }));
      setRepCount(0);
      setFeedbackMsg('Exercise switched. Ready.');
    }
  }, [activeExercise]);

  useEffect(() => {
    if (!isCameraActive) {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      return;
    }

    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext('2d');

    // Make sure globals are loaded from index.html CDN
    if (!window.Pose || !window.Camera) {
      alert("MediaPipe scripts not loaded yet. Please refresh the page.");
      setIsCameraActive(false);
      return;
    }

    // Initialize Pose
    const pose = new window.Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      }
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    pose.onResults((results) => {
      if (!canvasElement || !canvasCtx) return;

      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      
      // Draw video frame to canvas
      canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height
      );

      // Draw skeleton
      if (results.poseLandmarks && window.drawConnectors && window.drawLandmarks) {
        window.drawConnectors(canvasCtx, results.poseLandmarks, window.POSE_CONNECTIONS,
                       {color: '#00FF00', lineWidth: 4});
        window.drawLandmarks(canvasCtx, results.poseLandmarks,
                      {color: '#FF0000', lineWidth: 2});

        // Send payload to Python AI engine via WS
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            const payload = {
              landmarks: results.poseLandmarks,
              exercise: activeExercise
            };
            wsRef.current.send(JSON.stringify(payload));
        }
      }
      canvasCtx.restore();
    });

    poseRef.current = pose;

    // Initialize Camera
    const camera = new window.Camera(videoElement, {
      onFrame: async () => {
        if (poseRef.current) {
          await poseRef.current.send({image: videoElement});
        }
      },
      width: 640,
      height: 480
    });

    camera.start();
    cameraRef.current = camera;

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      if (poseRef.current) {
        poseRef.current.close();
      }
    };
  }, [isCameraActive]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.iconBadge}>
          <IoCamera size={24} />
        </div>
        <div>
          <h1 className={styles.title}>Exercise Detection</h1>
          <p className={styles.subtitle}>AI-powered posture analysis {socketConnected ? '🟢' : '🔴 WS'}</p>
        </div>
      </div>

      <Card className={styles.cameraCard}>
        <div className={`${styles.previewArea} ${isCameraActive ? styles.active : ''}`} style={{ position: 'relative', overflow: 'hidden' }}>
          {!isCameraActive ? (
            <>
              <IoCameraOutline size={64} className={styles.previewIcon} />
              <p className={styles.previewText}>Click "Start Camera" to begin exercise detection</p>
              <p className={styles.previewSubtext}>Please allow camera permissions if prompted</p>
            </>
          ) : (
            <>
              <video 
                ref={videoRef} 
                style={{ display: 'none' }} 
                playsInline
              />
              <canvas 
                ref={canvasRef} 
                width={640} 
                height={480} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', top: '20px', left: '20px', background: 'rgba(0,0,0,0.7)', padding: '10px 20px', borderRadius: '12px' }}>
                 <p style={{ color: '#3b82f6', margin: 0, fontWeight: 'bold' }}>{feedbackMsg}</p>
                 <div className={styles.repCounter} style={{ position: 'relative', bottom: '0', left: '0', marginTop: '10px' }}>
                   <span className={styles.repCount}>{repCount}</span>
                   <span className={styles.repLabel}>reps</span>
                 </div>
              </div>
            </>
          )}
        </div>
        <Button 
          className={styles.startBtn} 
          onClick={() => setIsCameraActive(!isCameraActive)}
          variant={isCameraActive ? 'outline' : 'primary'}
        >
          {isCameraActive ? 'Stop Camera' : '▶ Start Camera'}
        </Button>
      </Card>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Choose an exercise to track</h2>
        <p className={styles.sectionSubtitle}>
          {profile ? `Personalized for ${profile.age}y, BMI ${calculateBMI(profile.weight, profile.height)}` : 'Select from available exercises'}
        </p>
        <div className={styles.grid}>
          {recommendedExercises.map(ex => (
            <div 
              key={ex.id}
              className={`${styles.exerciseCard} ${activeExercise === ex.id ? styles.activeCard : ''}`}
              onClick={() => setActiveExercise(ex.id)}
            >
              <h3>{ex.name}</h3>
              <p>{ex.desc}</p>
              <span className={styles.difficultyBadge} style={{ 
                background: ex.difficulty === 'Beginner' ? '#10b981' : ex.difficulty === 'Intermediate' ? '#f97316' : '#ef4444' 
              }}>
                {ex.difficulty}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>How It Works</h2>
        <ol className={styles.instructionList}>
          <li>Select an exercise from the list above</li>
          <li>Click "Start Camera" to begin</li>
          <li>Position yourself so your full body is visible</li>
          <li>Follow the real-time feedback on screen</li>
          <li>The AI will track your reps and form</li>
        </ol>

        <Card className={styles.tipsCard}>
          <h3 className={styles.tipsTitle}>Tips for Best Results:</h3>
          <ul className={styles.tipsList}>
            <li><span className={styles.dot} style={{ background: 'var(--color-primary)' }}/>Ensure good lighting for better detection</li>
            <li><span className={styles.dot} style={{ background: 'var(--color-blue)' }}/>Wear fitted clothing for accuracy</li>
            <li><span className={styles.dot} style={{ background: 'var(--color-orange)' }}/>Keep your full body in frame</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default ExerciseDetectionScreen;
