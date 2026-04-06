import React from 'react';
import { IoBarbell } from 'react-icons/io5';
import styles from './Header.module.css';

const Header = ({ title, showLogo = false }) => {
  return (
    <div className={styles.header}>
      {showLogo && (
        <div className={styles.logoBadge}>
          <IoBarbell size={24} color="#000" />
        </div>
      )}
      <h1 className={styles.title}>{title || 'FitVerse'}</h1>
    </div>
  );
};

export default Header;
