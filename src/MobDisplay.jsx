import React from 'react';

// Функція для отримання правильного шляху в Vite
const getImageUrl = (name) => {
  return new URL(`./assets/${name}`, import.meta.url).href;
};

const MobDisplay = ({ image }) => {
  return (
    <div className="mob-container animate-shake">
      <img 
        src={getImageUrl(image)} 
        alt="Bug" 
        style={{ width: '80px', height: '80px', objectFit: 'contain' }}
      />
      <div className="interact-hint">FIX THE CODE!</div>
    </div>
  );
};

export default MobDisplay;