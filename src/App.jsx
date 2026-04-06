import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import MainLayout from './layout/MainLayout';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DashboardScreen from './screens/DashboardScreen';
import ExerciseDetectionScreen from './screens/ExerciseDetectionScreen';
import WorkoutPlannerScreen from './screens/WorkoutPlannerScreen';
import DietPlannerScreen from './screens/DietPlannerScreen';
import AICoachScreen from './screens/AICoachScreen';
import ContactScreen from './screens/ContactScreen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardScreen />} />
          <Route path="/exercise" element={<ExerciseDetectionScreen />} />
          <Route path="/workout" element={<WorkoutPlannerScreen />} />
          <Route path="/diet" element={<DietPlannerScreen />} />
          <Route path="/coach" element={<AICoachScreen />} />
          <Route path="/contact" element={<ContactScreen />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
