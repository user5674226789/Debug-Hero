import React, { useEffect, useState } from 'react';

const WorldTransition = ({ nextWorldName, onComplete }) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length < 3 ? prev + '.' : ''));
    }, 400);
    
    const timeout = setTimeout(onComplete, 3000); // Перехід триває 3 секунди
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  return (
    <div className="transition-screen">
      <div className="glitch-wrapper">
        <div className="log-line">CONNECTING TO NEW SECTOR... [OK]</div>
        <div className="log-line">DECRYPTING ASSETS{dots}</div>
        <h1 className="next-world-title">ВХІД У: {nextWorldName}</h1>
        <div className="loading-bar-container">
          <div className="loading-bar-fill"></div>
        </div>
      </div>
    </div>
  );
};

export default WorldTransition;