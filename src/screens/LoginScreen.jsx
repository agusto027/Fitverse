import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoMailOutline, IoLockClosedOutline } from 'react-icons/io5';
import Header from '../components/Header';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import styles from './Auth.module.css';

const LoginScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    if (!formData.password.trim()) {
      setError('Password is required');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      
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
          <h2 className={styles.title}>Welcome back</h2>
          <p className={styles.subtitle}>Sign in to continue your fitness journey</p>
          
          {error && <div style={{color: 'var(--color-red)', marginBottom: '16px', fontSize: '14px', textAlign: 'center'}}>{error}</div>}

          <form className={styles.form} onSubmit={handleLogin}>
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
              placeholder="Enter your password"
              icon={IoLockClosedOutline}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            
            <Button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
          
          <div className={styles.footer}>
            Don't have an account? <Link to="/register">Sign up</Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginScreen;
