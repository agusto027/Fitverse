import React from 'react';
import styles from './Input.module.css';

const Input = ({ icon: Icon, type = 'text', placeholder, value, onChange, label, hint, required = true, disabled = false }) => {
  return (
    <div className={styles.container}>
      {label && <label className={styles.label}>{label}{required && <span className={styles.required}>*</span>}</label>}
      <div className={styles.inputWrapper}>
        {Icon && <Icon className={styles.icon} size={20} />}
        <input 
          type={type} 
          className={`${styles.input} ${Icon ? styles.withIcon : ''}`} 
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
        />
      </div>
      {hint && <span className={styles.hint}>{hint}</span>}
    </div>
  );
};

export default Input;
