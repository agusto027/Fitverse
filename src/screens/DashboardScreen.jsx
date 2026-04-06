import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  IoFlashOutline, 
  IoTimeOutline, 
  IoCameraOutline, 
  IoBarbellOutline, 
  IoRestaurantOutline, 
  IoChatbubbleEllipsesOutline 
} from 'react-icons/io5';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import styles from './Dashboard.module.css';

const DashboardScreen = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('fitverse_user') || '{}');
  const userName = user.name || 'User';

  const quickActions = [
    {
      title: 'Exercise Detection',
      desc: 'AI posture analysis',
      icon: IoCameraOutline,
      color: '#3E8BFF',
      path: '/exercise'
    },
    {
      title: 'Workout Planner',
      desc: 'Weekly schedules',
      icon: IoBarbellOutline,
      color: 'var(--color-purple)',
      path: '/workout'
    },
    {
      title: 'Diet Planner',
      desc: 'Meal combinations',
      icon: IoRestaurantOutline,
      color: 'var(--color-orange)',
      path: '/diet'
    },
    {
      title: 'AI Coach',
      desc: '24/7 fitness help',
      icon: IoChatbubbleEllipsesOutline,
      color: 'var(--color-blue)',
      path: '/coach'
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.headerArea}>
        <h1 className={styles.greeting}>Good afternoon, {userName}</h1>
        <p className={styles.subtitle}>Ready to crush your fitness goals today?</p>
      </div>

      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.iconBadge} style={{ backgroundColor: 'rgba(62, 139, 255, 0.1)', color: 'var(--color-blue)' }}>
              <IoFlashOutline size={20} />
            </div>
            <span className={styles.statTitle}>Workouts Completed</span>
          </div>
          <h2 className={styles.statValue}>0</h2>
          <p className={styles.statSubText}>No activity yet</p>
        </Card>
        
        <Card className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.iconBadge} style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--color-primary)' }}>
              <IoTimeOutline size={20} />
            </div>
            <span className={styles.statTitle}>Last Workout</span>
          </div>
          <h2 className={styles.statValue}>--</h2>
          <p className={styles.statSubText}>No activity yet</p>
        </Card>
      </div>

      <h2 className={styles.sectionTitle}>Quick Actions</h2>
      <div className={styles.actionsGrid}>
        {quickActions.map((action, index) => (
          <Card key={index} className={styles.actionCard}>
            <div className={styles.actionIcon} style={{ color: action.color }}>
              <action.icon size={28} />
            </div>
            <div className={styles.actionInfo}>
              <h3>{action.title}</h3>
              <p>{action.desc}</p>
            </div>
            <Button 
              variant="outline" 
              className={styles.actionBtn}
              onClick={() => navigate(action.path)}
            >
              Get Started
            </Button>
          </Card>
        ))}
      </div>

      <h2 className={styles.sectionTitle}>Tips for Today</h2>
      <Card className={styles.tipsCard}>
        <h3 className={styles.tipsTitle}>Daily Reminders</h3>
        <p className={styles.tipsSubtitle}>Small steps lead to big changes</p>
        <ul className={styles.tipsList}>
          <li>
            <span className={styles.dot} style={{ backgroundColor: 'var(--color-primary)' }} />
            Stay hydrated - aim for at least 8 glasses of water today
          </li>
          <li>
            <span className={styles.dot} style={{ backgroundColor: 'var(--color-blue)' }} />
            Take short breaks every hour to stretch and move around
          </li>
          <li>
            <span className={styles.dot} style={{ backgroundColor: 'var(--color-orange)' }} />
            Focus on protein-rich meals to support muscle recovery
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default DashboardScreen;
