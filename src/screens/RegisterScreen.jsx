import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoMailOutline, IoLockClosedOutline, IoPersonOutline } from 'react-icons/io5';
import Header from '../components/Header';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import styles from './Auth.module.css';

const RegisterScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Full name is required');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    if (!formData.password) {
      setError('Password is required');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      
      localStorage.setItem('fitverse_token', data.token);
      localStorage.setItem('fitverse_user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Header showLogo={true} />
        
        <Card className={styles.card}>
          <h2 className={styles.title}>Create your account</h2>
          <p className={styles.subtitle}>Start your fitness journey today</p>
          
          {error && <div style={{color: 'var(--color-red)', marginBottom: '16px', fontSize: '14px', textAlign: 'center'}}>{error}</div>}

          <form className={styles.form} onSubmit={handleRegister}>
            <Input 
              label="Full Name"
              type="text"
              placeholder="John Doe"
              icon={IoPersonOutline}
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            
            <Input 
              label="Email"
              type="email"
              placeholder="you@example.com"
              icon={IoMailOutline}
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            
            <Input 
              label="Password"
              type="password"
              placeholder="At least 6 characters"
              icon={IoLockClosedOutline}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            
            <Input 
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              icon={IoLockClosedOutline}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            />
            
            <Button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
          
          <div className={styles.footer}>
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterScreen;
