import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  IoGridOutline, 
  IoCameraOutline, 
  IoBarbellOutline, 
  IoRestaurantOutline, 
  IoChatbubbleEllipsesOutline,
  IoSunnyOutline,
  IoMoonOutline,
  IoDesktopOutline,
  IoLogOutOutline,
  IoMenuOutline,
  IoCloseOutline,
  IoMailOutline,
  IoPersonOutline
} from 'react-icons/io5';
import Header from './Header';
import styles from './Sidebar.module.css';

const Sidebar = ({ isMobile, isOpen, setIsOpen }) => {
  const [theme, setTheme] = useState('dark');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('fitverse_user') || '{}');
  const userName = user.name || 'User';
  const userEmail = user.email || 'user@example.com';
  const avatarLetter = userName.charAt(0).toUpperCase();

  useEffect(() => {
    // Load theme from localStorage if possible
    const savedTheme = localStorage.getItem('fitverse_theme') || 'dark';
    handleThemeChange(savedTheme);
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('fitverse_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else if (newTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
      }
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('fitverse_token');
    localStorage.removeItem('fitverse_user');
    navigate('/login');
  };

  const handleContactUs = () => {
    navigate('/contact');
    handleLinkClick();
  };

  const handleProfileClick = () => {
    navigate('/profile');
    handleLinkClick();
  };

  const handleLinkClick = () => {
    if (isMobile) setIsOpen(false);
  };

  const navLinks = [
    { to: '/dashboard', icon: IoGridOutline, label: 'Dashboard' },
    { to: '/profile', icon: IoPersonOutline, label: 'My Profile' },
    { to: '/exercise', icon: IoCameraOutline, label: 'Exercise Detection' },
    { to: '/workout', icon: IoBarbellOutline, label: 'Workout Planner' },
    { to: '/diet', icon: IoRestaurantOutline, label: 'Diet Planner' },
    { to: '/coach', icon: IoChatbubbleEllipsesOutline, label: 'AI Coach' },
  ];

  const appearanceOptions = [
    { value: 'light', icon: IoSunnyOutline, label: 'Light' },
    { value: 'dark', icon: IoMoonOutline, label: 'Dark' },
    { value: 'system', icon: IoDesktopOutline, label: 'System' },
  ];

  return (
    <>
      {isMobile && !isOpen && (
        <button className={styles.mobileMenuBtn} onClick={() => setIsOpen(true)}>
          <IoMenuOutline size={28} />
        </button>
      )}

      {isMobile && isOpen && (
        <div className={styles.backdrop} onClick={() => setIsOpen(false)} />
      )}

      <div className={`${styles.sidebar} ${isMobile ? styles.mobile : ''} ${isOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          <Header title="FitVerse" showLogo={true} />
          {isMobile && (
            <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
              <IoCloseOutline size={28} />
            </button>
          )}
        </div>

        <div className={styles.scrollArea}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Navigation</h3>
            <nav className={styles.nav}>
              {navLinks.map((link) => (
                <NavLink 
                  key={link.to} 
                  to={link.to} 
                  className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
                  onClick={handleLinkClick}
                >
                  <link.icon size={20} className={styles.navIcon} />
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          <div className={styles.section}>
            <button 
              className={styles.navItem}
              onClick={handleContactUs}
            >
              <IoMailOutline size={20} className={styles.navIcon} />
              <span>Contact Us</span>
            </button>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Appearance</h3>
            <div className={styles.nav}>
              {appearanceOptions.map((opt) => (
                <button 
                  key={opt.value}
                  className={`${styles.navItem} ${theme === opt.value ? styles.active : ''}`}
                  onClick={() => handleThemeChange(opt.value)}
                >
                  <opt.icon size={20} className={styles.navIcon} />
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          {showProfileMenu && (
            <div className={styles.popoverMenu}>
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>MY ACCOUNT</h3>
                <button className={`${styles.navItem} ${styles.signOut}`} onClick={handleSignOut}>
                  <IoLogOutOutline size={20} className={styles.navIcon} />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}

          <div className={`${styles.userProfile} ${showProfileMenu ? styles.activeProfile : ''}`} onClick={() => setShowProfileMenu(!showProfileMenu)}>
            <div className={styles.avatar}>{avatarLetter}</div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{userName}</span>
              <span className={styles.userEmail}>{userEmail}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
