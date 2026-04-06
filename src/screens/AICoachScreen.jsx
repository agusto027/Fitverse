import React, { useState } from 'react';
import { 
  IoChatbubbleEllipses, 
  IoSparkles,
  IoSend
} from 'react-icons/io5';
import Card from '../components/Card';
import styles from './AICoach.module.css';

const AICoachScreen = () => {
  const user = JSON.parse(localStorage.getItem('fitverse_user') || '{}');
  const userName = user.name || 'User';

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'bot',
      content: `Hey ${userName}! I'm your AI fitness coach. I'm here to help you with workout advice, nutrition tips, motivation, and more. What would you like to work on today?`,
      time: '12:16'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    'Weight Loss', 'Build Muscle', 'Diet Tips',
    'Workout Plan', 'Stay Motivated', 'Better Sleep'
  ];

  const handleSend = async (text) => {
    if (!text.trim()) return;
    
    // Add User Message
    const userMsg = { id: Date.now(), role: 'user', content: text, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_AI_ENGINE_URL}/api/coach/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: text, user_name: userName })
      });
      const data = await res.json();
      
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, role: 'bot', content: data.reply, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
      ]);
    } catch (e) {
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, role: 'bot', content: "An error occurred connecting to the AI Engine. Please make sure the Python server is running.", time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
      ]);
    }
    
    setIsTyping(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.iconBadge}>
          <IoChatbubbleEllipses size={24} />
        </div>
        <div>
          <h1 className={styles.title}>AI Fitness Coach</h1>
          <p className={styles.subtitle}>Your personal trainer, available 24/7</p>
        </div>
      </div>

      <Card className={styles.chatContainer}>
        <div className={styles.chatHeader}>
          <div>
            <h2 className={styles.chatTitle}>Chat</h2>
            <p className={styles.chatSubtitle}>Ask me anything about fitness</p>
          </div>
          <div className={styles.aiBadge}>
            <IoSparkles size={14} /> AI-Powered
          </div>
        </div>

        <div className={styles.messageArea}>
          {messages.map(msg => (
            <div key={msg.id} className={`${styles.messageWrapper} ${msg.role === 'user' ? styles.wrapperUser : styles.wrapperBot}`}>
              {msg.role === 'bot' && (
                <div className={styles.botAvatar}>
                  <IoChatbubbleEllipses size={16} />
                </div>
              )}
              <div className={`${styles.messageBubble} ${msg.role === 'user' ? styles.bubbleUser : styles.bubbleBot}`}>
                <p>{msg.content}</p>
                <span className={styles.time}>{msg.time}</span>
              </div>
            </div>
          ))}
          
          {isTyping && (
             <div className={`${styles.messageWrapper} ${styles.wrapperBot}`}>
               <div className={styles.botAvatar}>
                 <IoChatbubbleEllipses size={16} />
               </div>
               <div className={`${styles.messageBubble} ${styles.bubbleBot}`} style={{ opacity: 0.7 }}>
                 <p>Typing...</p>
               </div>
             </div>
          )}
        </div>
      </Card>

      <div className={styles.inputSection}>
        <div className={styles.quickPrompts}>
          {quickPrompts.map(prompt => (
            <button 
              key={prompt} 
              className={styles.promptChip}
              onClick={() => handleSend(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>

        <div className={styles.inputWrapper}>
          <input 
            type="text" 
            className={styles.inputField} 
            placeholder="Ask your fitness coach..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(inputVal)}
          />
          <button className={styles.sendBtn} onClick={() => handleSend(inputVal)}>
            <IoSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AICoachScreen;
