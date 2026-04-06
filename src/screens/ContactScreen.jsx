import React, { useState } from 'react';
import { IoMailOutline, IoArrowBackOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import styles from './Contact.module.css';

const ContactScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('fitverse_user') || '{}');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    if (!formData.subject.trim()) {
      setError('Subject is required');
      return;
    }
    if (!formData.message.trim()) {
      setError('Message is required');
      return;
    }

    setLoading(true);
    try {
      // Copy to clipboard as fallback and show success
      const mailtoLink = `mailto:samrajnee05@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)}`;
      
      // Try to open email client
      window.location.href = mailtoLink;
      
      // Show success message
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch (err) {
      setError('Failed to open email client. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button 
          className={styles.backBtn}
          onClick={() => navigate('/dashboard')}
        >
          <IoArrowBackOutline size={20} />
        </button>
        <div className={styles.iconBadge}>
          <IoMailOutline size={24} />
        </div>
        <div>
          <h1 className={styles.title}>Contact Us</h1>
          <p className={styles.subtitle}>We'd love to hear from you. Send us a message!</p>
        </div>
      </div>

      <div className={styles.content}>
        <Card className={styles.formCard}>
          {submitted ? (
            <div className={styles.successMessage}>
              <h2>✅ Success!</h2>
              <p>Your email client is opening. Please send the email to complete your message.</p>
              <p className={styles.emailInfo}>If your email client didn't open, copy this email address:</p>
              <div className={styles.emailBox}>
                <code>samrajnee05@gmail.com</code>
                <button 
                  className={styles.copyBtn}
                  onClick={() => {
                    navigator.clipboard.writeText('samrajnee05@gmail.com');
                    alert('Email copied to clipboard!');
                  }}
                >
                  Copy
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 className={styles.formTitle}>Send us a Message</h2>
              
              {error && (
                <div className={styles.errorMessage}>{error}</div>
              )}

              <Input
                label="Full Name"
                type="text"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
              />

              <Input
                label="Email Address"
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
              />

              <Input
                label="Subject"
                type="text"
                name="subject"
                placeholder="What is this about?"
                value={formData.subject}
                onChange={handleChange}
              />

              <div className={styles.messageContainer}>
                <label className={styles.label}>Message</label>
                <textarea
                  name="message"
                  className={styles.textarea}
                  placeholder="Tell us more about your inquiry..."
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading}
              >
                {loading ? 'Opening Email...' : 'Send Message'}
              </Button>
            </form>
          )}
        </Card>

        <Card className={styles.infoCard}>
          <h3 className={styles.infoTitle}>Contact Information</h3>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>📧 Email:</span>
            <a href="mailto:samrajnee05@gmail.com" className={styles.infoLink}>
              samrajnee05@gmail.com
            </a>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>⏱️ Response Time:</span>
            <p>We typically respond within 24-48 hours</p>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>💬 Topics:</span>
            <p>Questions, feedback, technical issues, or suggestions are all welcome!</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ContactScreen;
